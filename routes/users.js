var express = require('express');
var router = express.Router();
var idValidator = require('valid-objectid');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.render('users/index', {users: users});
  });
});

// GET request to /profile/:id, show profile for user with matching id
router.get('/profile/:id/', function(req, res, next) {
  if (idValidator.isValid(req.params.id)) {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        next(err);
      }

      res.render('users/profile', {user: user});
    });
  } else {
    res.render('users/profile', {user: false});
  }
});

// POST request to /profile/:id, make changes to profile with matching id
router.post('/profile/:id/', function(req, res, next) {
  if (idValidator.isValid(req.params.id)) {
    if (req.user.role === 'admin' || req.user._id.equals(req.params.id)) {
      req.sanitize('displayName').escape();
      req.sanitize('displayName').trim();
      
      req.sanitize('email').escape();
      req.sanitize('email').trim();
      req.checkBody('email', 'Please provide an email').notEmpty()
      req.checkBody('email', 'Please provide a valid email').isEmail();

      if(req.user.role === 'admin') {
        req.sanitize('role').escape();
        req.sanitize('role').trim();
        req.checkBody('role', 'Please select a valid role').matches(/\b(admin|regular|subhuman)\b/, 'i');
      }

      var errors = req.validationErrors();

      if (errors) {
        var errorMsgs = [];
        errors.forEach(function(err) {
          errorMsgs.push(err.msg);
        });
        req.flash('error', errorMsgs)
        return res.redirect('/users/profile/' + req.params.id)
      }
      
      User.findById(req.params.id, function(err, user) {
        if (err) {
          next(err);
        }

        if (user) {
          user.name = req.body.displayName;
          user.email = req.body.email;
          if (req.user.role === 'admin') {
            user.role = req.body.role;
          }
          user.save(function(err) {
            if (err) {
              next(err);
            }
            req.flash('info', 'Profile information successfully updated');
            return res.redirect('/users/profile/' + user._id);
          });
        } else {
          req.flash('error', 'Cannot edit a user that does not exist');
          res.redirect('/users')
        }
      });
    } else {
      req.flash('error', 'You do not have permission to edit this user');
      res.redirect('/users/');
    }
  } else {
    req.flash('error', 'Cannot edit this user');
    res.redirect('/users/');
  }
});

//GET request to /profile, redirect to profile with current user id
router.get('/profile', function(req, res, next) {
  var id = req.user._id;
  return res.redirect('/users/profile/' + id);
});

module.exports = router;
