const db = require('../models/DataBase');

const DashboardModel = {
    getAllExhibitionsExceptLast: async () => {
        const result = await db.query(
            `SELECT e.id, e.name, e.date, e.location, e.organizer, ec.name AS category_name
             FROM exhibitions e
             JOIN exhibition_categories ec ON e.category_id = ec.id
             ORDER BY e.date ASC`
        );
    
        return result.rows.slice(0, -1);
    },

    deleteDogFromDB: async (dogId, owner_id) => {
        try{
            await db.query('DELETE FROM exhibition_registrations WHERE dog_id = $1', [dogId]);

            await db.query('DELETE FROM dogs WHERE id = $1', [dogId]);

            await db.query(
                'UPDATE owners SET dog_count = dog_count - 1 WHERE id = $1',
                [owner_id]
            );
        }
        catch(err){
            console.error('Помилка при видаленні собаки:', err);
            throw err;
        }
    },

    getRegisteredDogs: async (ownerId) => {
        try {
            const { rows } = await db.query(
                `SELECT * FROM public.exhibition_registrations WHERE is_active = true AND owner_id = $1 ORDER BY dog_id ASC, exhibition_id ASC`,
                [ownerId]
            );
            return rows;
        } catch (err) {
            console.error('Error fetching registered dogs:', err);
            throw new Error('Database error while fetching registered dogs');
        }
    },
     
    getModelDogAchievementsById: async (dogId) => {
         const result = await db.query(
            `SELECT a.id, a.title
            FROM dog_achievements da
            JOIN achievements a ON a.id = da.achievement_id
            WHERE da.dog_id = $1`,
            [dogId]
        );
        return result;
    }
};

module.exports = DashboardModel;