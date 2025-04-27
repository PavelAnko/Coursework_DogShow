const path = require('path');
const db = require('../models/DataBase.js');
const bcrypt = require('bcrypt');

const LogOwnerController = {
    getLogOwnerPage: (req, res) => {
        res.sendFile(path.join(__dirname, '../../views/log_in.html'));
    },
    
    loginOwner: async (req, res) => {
        const { id, name, surname, phone_number, password } = req.body;

        try {
            const result = await db.query(
                'SELECT id, name, surname, password FROM owners WHERE phone_number = $1',
                [phone_number]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Користувача з таким номером не знайдено' });
            }

            const owner = result.rows[0];

            if (owner.name !== name) {
                return res.status(401).json({ error: 'Неправильне ім’я' });
            }

            const isPasswordValid = await bcrypt.compare(password, owner.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Невірний пароль' });
            }
            req.session.owner = {
                id: owner.id,
                name: owner.name,
                surname: owner.surname,
            };

            res.json({ redirectTo: '/dashboard' });

        } catch (err) {
            console.error(err);
            return res.redirect('/error/500');
        }
    }     
};

module.exports = LogOwnerController;