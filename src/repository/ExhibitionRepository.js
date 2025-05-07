const db = require('../models/DataBase');

const ExhibitionRepository = {
    async getExhibitionRegistrationsByOwner(owner_id) {
        const result = await db.query(`
            SELECT 
                dogs.name AS dog_name, 
                exhibitions.name AS exhibition_name, 
                exhibitions.date,
                er.is_active AS status
            FROM exhibition_registrations er
            JOIN dogs ON er.dog_id = dogs.id
            JOIN exhibitions ON er.exhibition_id = exhibitions.id
            WHERE dogs.owner_id = $1
            ORDER BY exhibitions.date DESC
        `, [owner_id]);

        return result.rows.map(row => ({
            dog_name: row.dog_name,
            exhibition_name: row.exhibition_name,
            status: row.status ? 'Зареєстровано' : 'Неактивно'
        }));
    }
};

module.exports = ExhibitionRepository;
