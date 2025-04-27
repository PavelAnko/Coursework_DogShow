const db = require('../models/DataBase');

const DashboardModel = {
    getAllExhibitionsExceptLast: async () => {
        const result = await db.query(
            `SELECT id, name, date, location, organizer, criteria, category_id
             FROM exhibitions
             ORDER BY date ASC`
        );

        return result.rows.slice(0, -1);
    }
};

module.exports = DashboardModel;