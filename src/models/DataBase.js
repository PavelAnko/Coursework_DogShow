const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'canine_society',
    password: 'password',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to canine_society DB'))
    .catch(err => console.error('Database connection error:', err));

module.exports = client;