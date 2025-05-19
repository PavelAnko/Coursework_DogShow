const db = require('../models/DataBase');

const RegisterDogsModel = {
    insertDogRegistration: async (dogId, exhibitionId, ownerId) => {
        await db.query(
        `INSERT INTO exhibition_registrations (dog_id, exhibition_id, owner_id, is_active)
        VALUES ($1, $2, $3, $4)`,
        [dogId, exhibitionId, ownerId, true]
        );
    },

    getDogBreed: async (dogId, ownerId) => {
        const result = await db.query(
        `SELECT breed_id FROM dogs WHERE id = $1 AND owner_id = $2`,
        [dogId, ownerId]
        );
        return result.rows[0];
    },

    getExhibitionsForBreed: async (breedId) => {
        const result = await db.query(
            `SELECT e.id, e.name, e.date
            FROM exhibitions e
            JOIN exhibition_allowed_breeds ab ON ab.exhibition_id = e.id
            WHERE $1 = ANY (ab.breed_ids)
            ORDER BY e.date`,
            [breedId]
        );
        return result.rows;
    },

    reactivateDogRegistration: async (dogId, exhibitionId) => {
        try {
            await db.query(
                `UPDATE exhibition_registrations
                 SET is_active = true, registered_at = NOW()
                 WHERE dog_id = $1 AND exhibition_id = $2`,
                [dogId, exhibitionId]
            );
        } catch (err) {
            console.error('DB error while updating registration:', err);
            throw new Error('Помилка БД при оновленні реєстрації');
        }
    },

    checkIfDogIsRegistered: async (dogId, exhibitionId) => {
        try {
            const result = await db.query(
                `SELECT is_active FROM exhibition_registrations
                 WHERE dog_id = $1 AND exhibition_id = $2`,
                [dogId, exhibitionId]
            );
            return result
        } catch (err) {
            console.error('DB error while checking registration:', err);
            throw new Error('Помилка БД при перевірці реєстрації');
        }
    }
};

module.exports = RegisterDogsModel;
