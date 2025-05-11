const bcrypt = require('bcrypt');
const db = require('../models/DataBase.js');

const OwnerModel = {
    isOwnerIdUnique: async (owner_id) => {
        const result = await db.query('SELECT 1 FROM owners WHERE id = $1', [owner_id]);
        return result.rows.length === 0;
    },

    isPhoneNumberUnique: async (phone_number) => {
        const result = await db.query(
            'SELECT id FROM owners WHERE phone_number = $1',
            [phone_number]
        );
        return result.rows.length === 0; 
    },

    createOwner: async (owner_id, name, surname, phone_number, dogCount, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
    
        await db.query(
            'INSERT INTO owners (id, name, surname, phone_number, dog_count, password) VALUES ($1, $2, $3, $4, $5, $6)',
            [owner_id, name, surname, phone_number, dogCount, hashedPassword]
        );
    }
};

module.exports = OwnerModel;
