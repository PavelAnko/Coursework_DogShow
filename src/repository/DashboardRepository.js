const db = require('../models/DataBase');

const DashboardModel = {
    getAllExhibitionsExceptLast: async () => {
        const result = await db.query(
            `SELECT id, name, date, location, organizer, criteria, category_id
             FROM exhibitions
             ORDER BY date ASC`
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
    }
};

module.exports = DashboardModel;