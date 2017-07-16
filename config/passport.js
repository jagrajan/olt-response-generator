var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function() {
    
    //Used when saving user object into session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    //Used when turing session into user object
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //Defining the login strategy
    passport.use('login', new LocalStrategy({
        usernameField: 'email', //default is username, changed to email
        passwordField: 'password'
    }, function(email, password, done) {
        //Find a user by email
        User.findOne({email: email}, function(err, user){
            if (err) {
                return done(err);
            }
            
            //If no user with matching email is found
            if (!user) {
                return done(null, false, {message: 'Email does not exist in our database.'});
            }

            //Compare passwords
            user.checkPassword(password, function(err, isMatch) {
                if (err) {
                    return done(err);
                }

                //If password match, user is authenticated, otherwise return an invalid password message
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password.'});
                }
            });
        });
    }));
};