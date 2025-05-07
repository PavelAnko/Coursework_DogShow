const OwnerModel = require('../repository/OwnerRepository.js');

const RegOwnerController = {
    registerOwner: async (req, res) => {
        const { name, surname, phone_number, password } = req.body;
        let owner_id;
        let isUnique = false;

        const isPhoneUnique = await OwnerModel.isPhoneNumberUnique(phone_number);

        if (!isPhoneUnique) {
            return res.status(401).json({ error: 'Цей номер телефону вже зареєстрований!' });
        }

        while (!isUnique) {
            owner_id = Math.floor(Math.random() * 10000);
            isUnique = await OwnerModel.isOwnerIdUnique(owner_id);
        }

        req.session.temp_owner_data = {
            owner_id,
            owner_name: name,
            owner_surname: surname,
            phone_number,
            password
        };

        res.json({ redirectTo: '/add-dog' });
    }
};

module.exports = RegOwnerController;