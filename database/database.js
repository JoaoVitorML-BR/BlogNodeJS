// making the database connection
const Sequelize = require('sequelize');
const connection = new Sequelize('blog', 'root', '1904', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;