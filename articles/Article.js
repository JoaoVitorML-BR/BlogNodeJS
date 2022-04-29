const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles',{
    title: { 
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// relationships

Category.hasMany(Article); // a category has many articles
Article.belongsTo(Category); // an article belongs to a category

// Article.sync({force: true}); // creates the table whenever I run the program again

module.exports = Article;