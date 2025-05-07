const path = require('path');
const db = require('../models/DataBase.js');
const DashboardModel = require('../repository/DashboardRepository.js');
const ExhibitionModel = require('../repository/ExhibitionRepository.js');

const RegToExhibition = {
    getExhibitions: async (req, res) => {
        try {
            const exhibitions = await DashboardModel.getAllExhibitionsExceptLast();
            res.json(exhibitions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Помилка сервера при отриманні виставок' });
        }
    },

    getRegisterDogFormToExhibition: (req, res) => {
        if (!req.session.temp_owner_data && !req.session.owner) {
            return res.redirect('/error/403');
        }
        res.sendFile(path.join(__dirname, '../../views/reg_exhibirions.html'));
    },

    getExhibitions: async (req, res) => {
        try {
          const result = await db.query('SELECT id, name FROM exhibitions ORDER BY name');
          res.json(result.rows);
        } catch (err) {
          console.error(err);
          res.redirect('/error/500');
        }
    },

    registerDogToExhibition: async (req, res) => {
        try {
          const owner = req.session.owner;
          if (!owner) {
            return res.status(403).json({ error: 'Неавторизований доступ' });
          }
    
          const { dog_id, exhibition_id } = req.body;
    
          if (!dog_id || !exhibition_id) {
            return res.status(400).json({ error: 'Відсутні необхідні поля' });
          }
    
          await db.query(
            `INSERT INTO exhibition_registrations (dog_id, exhibition_id, owner_id, is_active)
             VALUES ($1, $2, $3, $4)`,
            [dog_id, exhibition_id, owner.id, true]
          );
    
          res.json({ redirectTo: '/dashboard' });
        } catch (err) {
          console.error('Помилка при реєстрації собаки на виставку:', err);
          res.status(500).json({ error: 'Помилка сервера при реєстрації' });
        }
    },

    getExhibitionRegistrations: async(req, res) => { 
        try {
            const owner = req.session.owner || req.session.temp_owner_data;
            if (!owner) {
                return res.status(403).json({ error: 'Неавторизований доступ' });
            }

            const registrations = await ExhibitionModel.getExhibitionRegistrationsByOwner(owner.id);
            res.json(registrations);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Помилка сервера при отриманні реєстрацій' });
        }
    }
};

module.exports = RegToExhibition;

