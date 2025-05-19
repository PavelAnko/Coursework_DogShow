const path = require('path');
const RegisterDogsModel = require('../../repository/RegisterDogsRepository.js');
const ExhibitionModel = require('../../repository/ExhibitionRepository.js');
const DogExhibitionService = require('../../service/DogExhibitionService.js')

const RegToExhibition = {
  getRegisterDogFormToExhibition: (req, res) => {
    if (!req.session.temp_owner_data && !req.session.owner) {
      return res.redirect('/error/403');
    }
    res.sendFile(path.join(__dirname, '../../../views/reg_exhibirions.html'));
  },

  registerDogToExhibition: async (req, res) => {
    try {
      await DogExhibitionService.registerDogToExhibition(req, res);
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
