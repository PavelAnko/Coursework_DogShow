const path = require('path');
const DogRepository = require('../../repository/DogRepository.js');
const DashboardModel = require('../../repository/DashboardRepository.js');

const DashboardController = {
    getDashboardPage: (req, res) => {
        if (!req.session.temp_owner_data && !req.session.owner) {
            return res.redirect('/error/403');
        }
        res.sendFile(path.join(__dirname, '../../../views/dashboard.html'));
    },

    getOwnerInfo: (req, res) => {  
        if (!req.session.owner) {
            return res.status(401).json({ error: 'Не авторизовано' });
        }
        const { name, surname } = req.session.owner;
        res.json({ name, surname });
    },

    getOwnerDogs: async (req, res) => {
        if (!req.session.owner) {
            return res.status(401).json({ error: 'Не авторизовано' });
        }
        try {
            const dogs = await DogRepository.getDogsByOwnerId(req.session.owner.id);
            res.json(dogs);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Помилка сервера при отриманні даних собак' });
        }
    },

    getExhibitions: async (req, res) => {
        try {
            const exhibitions = await DashboardModel.getAllExhibitionsExceptLast();
            res.json(exhibitions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Помилка сервера при отриманні виставок' });
        }
    },

    deleteDog: async (req, res) => {
        const dogId = req.params.dogId;
        const owner_id = req.session.owner.id;
        try {
            await DashboardModel.deleteDogFromDB(dogId, owner_id); 
            res.status(200).json({ message: "Собаку успішно видалено" });
        } catch (err) {
            console.error('Помилка при видаленні собаки:', err);
            res.status(500).json({ error: 'Помилка сервера при видаленні собаки' });
        }
    },

    logout: (req, res) => {
        req.session.destroy(err => {
          if (err) {
            console.error('Помилка при знищенні сесії:', err);
            return res.status(500).json({ error: 'Помилка виходу' });
          }
          res.clearCookie('connect.sid');
          res.sendStatus(200);
        });
    },

    getDogAchievementsById: async (req, res) => {
        try {
            const dogId = req.params.dogId;
            const result = await DashboardModel.getModelDogAchievementsById(dogId);
            res.json(result.rows);
        } catch (err) {
            console.error('Помилка отримання досягнень для собаки', dogId, err);
            res.status(500).json({ error: 'Помилка сервера при отриманні досягнень' });
        }
    }
};

module.exports = DashboardController;
