const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // used to encrypt the password
const User = require('./User');

router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users: users});
    });
});

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create');
});

// send data
router.post('/users/create', (req, res) => {
    var email = req.body.email; // get value
    var password = req.body.password;

    User.findOne({where: {email: email}}).then( user => {
        if(user == undefined){ // if user == undefined you can create the user
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/login')
            }).catch((e) => {
                res.redirect('/')
            });
        }else{ // don't create user
            res.redirect('/admin/users/create');
        }
    });

router.get('/admin/users/login', (req, res) => {
    res.render('admin/users/login');
});

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){ // if exists a user with it email
            // validating password
            var correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/login"); 
            }

        }else{
            res.redirect("/login");
        }
    });
});

});
    // res.json({email, password}); used to know if data is being sent correctly

module.exports = router;