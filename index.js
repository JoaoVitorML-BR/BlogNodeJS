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
    Article.findAll().then(articles => { // searching the files/data
        res.render('index', {articles: articles}); // send to frontend the files/data
    })
    
});

app.get('/slug', (req, res) => {
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug // search for an article by the slug that the user passes in the route
        }
    }).then(article => {
        if(article != undefined){
            res.render('article',{article: article})
        }else{
            res.redirect('/')
        }
    }).catch(e => {
        res.redirect('/')
    });
});

app.use('/', categoriesController);
app.use('/',articlesController); 

app.listen(8080, () => {
    console.log('Servidor rodando na porta: http://localhost:8080');
});
