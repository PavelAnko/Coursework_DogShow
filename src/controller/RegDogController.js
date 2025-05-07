const path = require('path');
const db = require('../models/DataBase.js');
const DogModel = require('../repository/DogRepository.js');
const OwnerModel = require('../repository/OwnerRepository.js')

const RegDogController = {
    getAddDogPage: (req, res) => {
        if (!req.session.temp_owner_data && !req.session.owner) {
            return res.redirect('/error/403');
        }
        res.sendFile(path.join(__dirname, '../../views/add-dog.html'));
    },

    getBreeds: async (req, res) => {
        try {
            const result = await db.query('SELECT id, name FROM breeds ORDER BY name');
            res.json(result.rows);
        } catch (err) {
            console.error(err);
            res.redirect('/error/500');
        }
    },

    registerDog: async (req, res) => {
        const { name, breed_id, age } = req.body;
    
        // Сценарій 1: реєстрація нового користувача
        if (req.session.temp_owner_data) {
            const { owner_id, owner_name, owner_surname, phone_number, password } = req.session.temp_owner_data;
    
            try {
                await OwnerModel.createOwner(owner_id, owner_name, owner_surname, phone_number, 1, password);
    
                await DogModel.addDog(name, breed_id, age, owner_id);
    
                req.session.owner = {
                    id: owner_id,
                    name: owner_name,
                    surname: owner_surname
                };
    
                delete req.session.temp_owner_data;
    
                res.redirect('/dashboard');
            } catch (err) {
                console.error('Помилка при збереженні нового користувача або собаки:', err);
                res.redirect('/error/500');
            }
    
        // Сценарій 2: додавання собаки зареєстрованим користувачем
        } else if (req.session.owner) {
            const owner_id = req.session.owner.id;
    
            try {
                await DogModel.addDog(name, breed_id, age, owner_id);
                await DogModel.updateOwnerDogCount(owner_id)
                res.redirect('/dashboard');
            } catch (err) {
                console.error('Помилка при додаванні собаки існуючому користувачу:', err);
                res.redirect('/error/500');
            }
    
        } else {
            res.redirect('/error/403');
        }
    }    
};

module.exports = RegDogController;