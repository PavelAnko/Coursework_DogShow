const path = require('path');
const db = require('../models/DataBase.js');
const DogRepository = require('../repository/DogRepository.js');
const DashboardModel = require('../repository/DashboardRepository.js');

const DashboardController = {
    getDashboardPage: (req, res) => {
        if (!req.session.temp_owner_data && !req.session.owner) {
            return res.redirect('/error/403');
        }
        res.sendFile(path.join(__dirname, '../../views/dashboard.html'));
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

    registerDogInDashboard: async (req, res) => {
        if (!req.session.temp_owner_data) {
            return res.redirect('/error/403'); 
        }
        const { owner_id } = req.session.temp_owner_data;
        const { name, breed_id, age } = req.body;

        try {
            await DogRepository.addDog(name, breed_id, age, owner_id);
            res.redirect('/dashboard'); 
        } catch (err) {
            console.error('Помилка при збереженні даних:', err);
            res.redirect('/error/500'); 
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
        console.log("Запит на видалення собаки з id:", dogId);
        try {
            await DashboardModel.deleteDogFromDB(dogId, owner_id); 
            res.status(200).json({ message: "Собаку успішно видалено" });
        } catch (err) {
            console.error('Помилка при видаленні собаки:', err);
            res.status(500).json({ error: 'Помилка сервера при видаленні собаки' });
        }
    }
};

module.exports = DashboardController;
