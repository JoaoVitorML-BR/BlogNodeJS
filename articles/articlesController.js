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

module.exports = router;   