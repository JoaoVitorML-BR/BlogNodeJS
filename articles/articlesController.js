const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

//router articles
router.get("/admin/articles",(req, res) => {
    Article.findAll({
        include: [{model: Category}] // include the data of Category
    }).then(articles => {
        res.render("admin/articles/index",{articles: articles})
    });
});

// router to create article
router.get("/admin/articles/new",(req ,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories: categories})
    })    
});

// here i'm savings the articles in a database
router.post("/articles/save",(req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

// router to delete article
router.post("/articles/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){ // remove from bank through id
            Article.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect('/admin/articles');
            })
        }else{ // if not a number
            res.redirect('/admin/articles');
        };
    }else{ // if null
        res.redirect('/admin/articles');
    };
});

// router to edit articles
router.get('/admin/articles/edit/:id', (req, res) => {
    var id = req.params.id;

    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', {categories: categories, article: article});
            })
            
        }else{
            res.redirect('/')
        }
    }).catch(e => {
        res.redirect('/')
    });
});

// updating article information
router.post("/articles/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category

    Article.update({title: title, body: body, categoryID: category, slug:slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

// article pagination route
router.get('/articles/page/:num', (req, res) => {
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = parseInt(page) * 4; 
    }
    // this is the same thing as findAll but this returns the count
    Article.findAndCountAll({
        limit: 4,
        offset: offset
    }).then(articles => {
        var next;
        if(offset + 4 >= articles.count){ // if the offset + the number of elements on the page is greater than the number of articles, it means that I have exceeded the number of articles and there are no articles to be displayed anymore.
            next = false;
        }else{
            next = true; // means there is a next page to be displayed
        }
        var result = {
            next: next,
            articles: articles
        }

        res.json(result); // returns a json response to the browser
    })

})
module.exports = router;   