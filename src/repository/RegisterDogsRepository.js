const db = require('../models/DataBase');

const RegisterDogsModel = {
    async insertDogRegistration(dogId, exhibitionId, ownerId) {
        await db.query(
        `INSERT INTO exhibition_registrations (dog_id, exhibition_id, owner_id, is_active)
        VALUES ($1, $2, $3, $4)`,
        [dogId, exhibitionId, ownerId, true]
        );
    },

    async getDogBreed(dogId, ownerId) {
        const result = await db.query(
        `SELECT breed_id FROM dogs WHERE id = $1 AND owner_id = $2`,
        [dogId, ownerId]
        );
        return result.rows[0];
    },

async getExhibitionsForBreed(breedId) {
    const result = await db.query(
        `SELECT e.id, e.name, e.date
        FROM exhibitions e
        JOIN exhibition_allowed_breeds ab ON ab.exhibition_id = e.id
        WHERE $1 = ANY (ab.breed_ids)
        ORDER BY e.date`,
        [breedId]
    );
    return result.rows;
}

};

module.exports = RegisterDogsModel;
