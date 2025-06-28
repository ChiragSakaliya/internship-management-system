const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'Promfessor@28',
        database: 'internship-management-system-db',
    },
});

module.exports = knex;