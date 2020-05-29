const express = require("express")
const router = express.Router()
const app = express()
const request = require('request')
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const utils = require('../config/utils');
const {deleteToken} = require('../config/utils');
const dotenv = require('dotenv');
dotenv.config();


app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

router.get('/auth', (req, res) => {
    res.render('authentication')
});

router.get('/auth/signup', (req, res) => {
  res.render('signup')
});

router.get('/auth/signin', (req, res) => {
    res.render('signin');  
});

router.post('/auth/signup', (req, res) => {
    const {name, email, password, password2} = req.body;
    var errors = [];

    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields!'});
    }
    if(password !== password2){
        errors.push({msg: "Passwords don't match."});
    }
    if(password.length < 6){
        errors.push({msg: "Password should be at least 6 characters."});
    }
    if(errors.length > 0){
        res.render('signup', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({email: email})
            .then(user => {
                if(user){
                    errors.push({msg: 'Email is already registered.'});
                    res.render('signup', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else{
                    const newUser = new User({
                        secretKey: process.env.MY_SECRETKEY,
                        name,
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {

                            const jwt = utils.issueJWT(user);
                            //res.json({user: user, token: jwt.token, expires: jwt.expires})
                            res.redirect('/auth/signin');
                        })
                        .catch(err => console.log(err));
                    }))
                }
            });
    }
});

router.post('/auth/signin', (req, res) =>{
    const {email, password} = req.body;
    var errors = [];
    User.findOne({email: email})
        .then((user) =>{
            if(!user){
                errors.push({msg: 'Email not registered.'});
                res.render('signin', {
                    errors,
                    email,
                    password
                });
            }
            bcrypt.compare(password, user.password, (err, isMatch) =>{
                if(err) throw err;
                if(isMatch){
                    const jwt = utils.issueJWT(user);
                    res.setHeader('Authorization', 'Bearer ' + jwt.token);
                    //res.json({user: user, token: jwt.token, expires: jwt.expires})
                    res.redirect('/home')
                } else{
                    errors.push({msg: 'Password incorrect.'});
                    res.render('signin', {
                        errors,
                        email,
                        password
                    });
                }
            });
        })
        .catch(err => console.log(err));
});

// router.get('/auth/logout', (req,res) =>{
//     req.logout();
//     deleteToken(req,res);
// });

module.exports = router;