const path = require('path');
const RegistrationServiceDO = require('../../service/RegistrationServiceDO.js');
const DogRepository = require('../../repository/DogRepository.js');

const RegDogController = {
    getAddDogPage: (req, res) => {
        if (!req.session.temp_owner_data && !req.session.owner) {
            return res.redirect('/error/403');
        }
        res.sendFile(path.join(__dirname, '../../../views/add-dog.html'));
    },

    getBreeds: async (req, res) => {
        try {
            const breeds = await DogRepository.getAllBreeds();
            res.json(breeds);
        } catch (err) {
            console.error(err);
            res.redirect('/error/500');
        }
    },

    registerDog: async (req, res) => {
        const dogData = req.body;

        try {
            if (req.session.temp_owner_data) {
                const owner = await RegistrationServiceDO.registerDogForTempOwner(req.session, dogData);
                req.session.owner = owner;
                delete req.session.temp_owner_data;
                res.redirect('/dashboard');
            } 

            else if (req.session.owner) {
                await RegistrationServiceDO.registerDogForExistingOwner(req.session.owner.id, dogData);
                res.redirect('/dashboard');
            } 

            else {
                res.redirect('/error/403');
            }
        } catch (err) {
            console.error('Помилка при реєстрації собаки:', err);
            res.redirect('/error/500');
        }
    }    
};

module.exports = RegDogController;