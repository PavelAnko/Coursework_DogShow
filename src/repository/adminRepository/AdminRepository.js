const db = require('../../models/DataBase');
const bcrypt = require('bcrypt');

const AdminModel = {
    authenticateAdmin: async ({ first_name, last_name, password1, password2 }) => {
        if (!first_name || !last_name || !password1 || !password2) {
            throw new Error('Будь ласка, заповніть всі поля');
        }

        const result = await db.query(
            'SELECT * FROM admins WHERE first_name = $1 AND last_name = $2',
            [first_name, last_name]
        );

        if (result.rows.length === 0) {
            throw new Error('Адміністратора не знайдено');
        }

        const admin = result.rows[0];

        const match1 = await bcrypt.compare(password1, admin.password1);
        const match2 = await bcrypt.compare(password2, admin.password2);

        if (!match1 || !match2) {
            throw new Error('Невірні паролі');
        }

        return {
            id: admin.id,
            first_name: admin.first_name,
            last_name: admin.last_name
        };
    },
    
    achievementDogAdmin: async () => {
        try {
            const { rows } = await db.query('SELECT * FROM achievements');
            return rows;
        } catch (err) {
            console.error('Error fetching achievements:', err);
            throw new Error('Database error while fetching achievements');
        }
    },

    getDogsFromExhibitionsByOwnerId: async (owner_id) => {
        const result = await db.query(
            `SELECT DISTINCT dogs.id, dogs.name, breeds.name AS breed, dogs.age
            FROM dogs
            JOIN breeds ON dogs.breed_id = breeds.id
            JOIN exhibition_registrations er ON er.dog_id = dogs.id
            WHERE dogs.owner_id = $1
            AND er.is_active = true`,
            [owner_id]
        );
        return result.rows;
    },

    checkAchievementForDog: async (dogId, achievementId) => {
        try {
            const result = await db.query(
                `SELECT * FROM dog_achievements WHERE dog_id = $1 AND achievement_id = $2`,
                [dogId, achievementId]
            );
            return result.rows.length > 0; 
        } catch (err) {
            console.error('Error checking achievement for dog:', err);
            throw new Error('Database error while checking achievement');
        }
    },

    assignAchievementToDog: async (dogId, achievementId) => {
        try {
            await db.query(
                `INSERT INTO dog_achievements (dog_id, achievement_id) VALUES ($1, $2)`,
                [dogId, achievementId]
            );
        } catch (err) {
            console.error('Error assigning achievement:', err);
            throw new Error('Database error while assigning achievement');
        }
    },
    
    updateExhibitionRegistrationStatus: async (dogId, exhibitionId) => {
        try {
            await db.query(
                `UPDATE exhibition_registrations 
                SET is_active = false 
                WHERE dog_id = $1 AND exhibition_id = $2`,
                [dogId, exhibitionId]
            );
        } catch (err) {
            console.error('Error updating exhibition registration status:', err);
            throw new Error('Database error while updating exhibition registration status');
        }
    },

    getExhibitionsByDogId: async (dogId) => {
        try {
            const result = await db.query(`
                SELECT e.id, e.name AS title, e.date
                FROM exhibition_registrations er
                JOIN exhibitions e ON er.exhibition_id = e.id
                WHERE er.dog_id = $1 AND er.is_active = TRUE
            `, [dogId]);

            return result.rows;
        } catch (err) {
            console.error('Помилка при запиті виставок собаки:', err);
            throw new Error('DB error while fetching dog exhibitions');
        }
    },

    categoriesExhibitionsAdmin: async () => {
        try {
            const { rows } = await db.query('SELECT * FROM exhibition_categories');
            return rows;
        } catch (err) {
            console.error('Error fetching exhibition_categories:', err);
            throw new Error('Database error while fetching exhibition_categories');
        }
    },

    postExhibitionToDB: async (name, date, location, organizer, category_id) => {
        try {
            const { rows } = await db.query(
                `INSERT INTO exhibitions (name, date, location, organizer, category_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id`,
                [name, date, location, organizer, category_id]
            );
            return rows[0].id;
        } catch (err) {
            console.error('Error inserting exhibition:', err);
            throw new Error('Database error while inserting exhibition');
        }
    },

    updateExhibitionAllowedBreeds: async (exhibitionId, selectedBreeds) => {
        try {
            await db.query(
                `INSERT INTO exhibition_allowed_breeds (exhibition_id, breed_ids)
                VALUES ($1, $2)`,
                [exhibitionId, selectedBreeds]
            );
        } catch (err) {
            console.error('Error inserting allowed breeds:', err);
            throw new Error('Database error while inserting allowed breeds');
        }
    }
};

module.exports = AdminModel;