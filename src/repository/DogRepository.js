const db = require('../models/DataBase');

const DogModel = {
    async addDog(name, breed_id, age, owner_id) {
        const result = await db.query(`
            SELECT id FROM dogs ORDER BY id;
        `);

        const dogIds = result.rows.map(dog => dog.id); 
        let availableIndex = null;

        for (let i = 1; i <= dogIds.length; i++) {
            if (!dogIds.includes(i)) {
                availableIndex = i;  
                break;
            }
        }

        if (!availableIndex) {
            availableIndex = dogIds.length + 1;
        }

        await db.query(
            'INSERT INTO dogs (id, name, breed_id, age, owner_id) VALUES ($1, $2, $3, $4, $5)',
            [availableIndex, name, breed_id, age, owner_id]
        );
    },


    async updateOwnerDogCount(owner_id) {
        await db.query(
            'UPDATE owners SET dog_count = dog_count + 1 WHERE id = $1',
            [owner_id]
        );
    },

    async getBreedName(breed_id) {
        const result = await db.query('SELECT name FROM breeds WHERE id = $1', [breed_id]);
        return result.rows[0]?.name || 'невідома порода';
    },

    async getDogsByOwnerId(owner_id) {
        const result = await db.query(
            `SELECT dogs.id, dogs.name, breeds.name AS breed, dogs.age
             FROM dogs
             JOIN breeds ON dogs.breed_id = breeds.id
             WHERE dogs.owner_id = $1`,
            [owner_id]
        );
        return result.rows;
    }
};

module.exports = DogModel;