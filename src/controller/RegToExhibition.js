const path = require('path');
const db = require('../models/DataBase.js');
const RegisterDogsModel = require('../repository/RegisterDogsRepository.js');
const ExhibitionModel = require('../repository/ExhibitionRepository.js');

const RegToExhibition = {
  getRegisterDogFormToExhibition: (req, res) => {
    if (!req.session.temp_owner_data && !req.session.owner) {
      return res.redirect('/error/403');
    }
    res.sendFile(path.join(__dirname, '../../views/reg_exhibirions.html'));
  },

registerDogToExhibition: async (req, res) => {
    try {
      const owner = req.session.owner;
      if (!owner) return res.status(403).json({ error: 'Неавторизований доступ' });

      const { dog_id, exhibition_id } = req.body;
      if (!dog_id || !exhibition_id) {
        return res.status(400).json({ error: 'Відсутні необхідні поля' });
      }

      // Перевірка, чи ця собака вже зареєстрована на цю виставку
      const checkResult = await db.query(
        `SELECT is_active FROM exhibition_registrations
        WHERE dog_id = $1 AND exhibition_id = $2`,
        [dog_id, exhibition_id]
      );

      if (checkResult.rowCount > 0) {
        const existing = checkResult.rows[0];
        if (existing.is_active) {
          return res.status(409).json({ error: 'Собака вже зареєстрована на цю виставку' });
        } else {
          // Оновити запис — активувати
          await db.query(
            `UPDATE exhibition_registrations
            SET is_active = true, registered_at = NOW()
            WHERE dog_id = $1 AND exhibition_id = $2`,
            [dog_id, exhibition_id]
          );

          return res.json({ message: 'Реєстрацію оновлено повторно', redirectTo: '/dashboard' });
        }
      }

      // Якщо запису немає — додаємо
      await RegisterDogsModel.insertDogRegistration(dog_id, exhibition_id, owner.id);

      res.json({ redirectTo: '/dashboard' });
    } catch (err) {
      console.error('Помилка при реєстрації собаки на виставку:', err);
      res.status(500).json({ error: 'Помилка сервера при реєстрації' });
    }
  },

  getExhibitionRegistrations: async (req, res) => {
    try {
      const owner = req.session.owner || req.session.temp_owner_data;
      if (!owner) return res.status(403).json({ error: 'Неавторизований доступ' });

      const registrations = await ExhibitionModel.getExhibitionRegistrationsByOwner(owner.id);
      res.json(registrations);
    } catch (err) {
      console.error('Помилка при отриманні реєстрацій:', err);
      res.status(500).json({ error: 'Помилка сервера при отриманні реєстрацій' });
    }
  },

  getAvailableExhibitionsForDog: async (req, res) => {
    try {
      const owner = req.session.owner;
      const dogId = req.params.dogId;

      const breedInfo = await RegisterDogsModel.getDogBreed(dogId, owner.id);
      if (!breedInfo) {
        return res.status(404).json({ error: 'Собаку не знайдено' });
      }

      const exhibitions = await RegisterDogsModel.getExhibitionsForBreed(breedInfo.breed_id);
      res.json(exhibitions);
    } catch (err) {
      console.error('Помилка при отриманні виставок для собаки:', err);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }
};

module.exports = RegToExhibition;
