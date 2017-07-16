var express = require('express');
var passport = require('passport');

var User = require('../models/user');

var router = express.Router();

//GET request to /, show home page
router.get('/', function(req, res, next) {
    res.render('home/index', {title: 'OLT Response Generator'});
});

//GET request to /logout, log out user, redirect to homepage
router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

//GET request to /login, show log in form
router.get('/login', function(req, res, next) {
    res.render('home/login', {title: 'Log In'});
});

//POST request to /login, authenticate or show form with errors
router.post('/login', function(req, res, next) {
    req.sanitize('email').escape();
    req.sanitize('password').escape();
    next();
}, passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

//GET request to /register, show register form
router.get('/register', function(req, res, next) {
    res.render('home/register', {title: 'Register', email: req.body.email});    
});

//POST request to /register, validate and authenticate, or show form with errors
router.post('/register', function(req, res, next) {
    
    //Sanitize input
    req.sanitize('email').escape();
    req.sanitize('email').trim();
    req.sanitize('password').escape();
    req.sanitize('password').trim();
    req.sanitize('confirmPassword').escape();
    req.sanitize('confirmPassword').trim();

    //Validate input
    req.checkBody('email', 'Please provide a valid email').isEmail();
    req.checkBody('password', 'Password must be atleast 8 characters').len(8, 128);
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    //If errors were found, render errors
    if (errors) {
        var errorMsgs = [];
        errors.forEach(function (error) {
            errorMsgs.push(error.msg);
        });
        res.render('home/register', {title: 'Register', errors: errorMsgs, email: req.body.email});
        return;
    }

    //Search for user with same email
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return next(err);
        }
        //If email already in use, send error message
        if (user) {
            req.flash('error', 'Email in use by another account');
            return res.redirect('/register');
        }

        //Create new user and save
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        newUser.save(next);
    });
}, passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));


module.exports = router;