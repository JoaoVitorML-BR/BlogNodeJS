const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

// View Engine
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));

// Body Parser (allowing to work with forms)
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

// connecting to database
connection
    .authenticate()
    .then(() => {console.log('Banco conectado com sucesso!')})
    .catch((e) => {console.log(e)})

// Servidor Starting / running

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(articles => { // searching the files/data

        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories}); // send to frontend the files/data
        });
    })
    
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug // search for an article by the slug that the user passes in the route
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories}); // send to frontend the files/data
            });
        }else{
            res.redirect('/')
        }
    }).catch(e => {
        res.redirect('/')
    });
});

app.get("/category/:slug",(req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] // when you search for x category it returns everything in it
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles,categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( e => {
        res.redirect("/");
    })
});

app.use('/', categoriesController);
app.use('/',articlesController); 

app.listen(8080, () => {
    console.log('Servidor rodando na porta: http://localhost:8080');
});
