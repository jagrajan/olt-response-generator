var express = require('express');
var router = express.Router();
var idValidator = require('valid-objectid');

var Snippet = require('../models/snippet');

/* GET snippets listing. */
router.get('/', function(req, res, next) {
  Snippet.find({$or: [{public: true}, {author: req.user._id}]}).populate('author')
  .exec(function(err, snippets) {
    if (err) {
        return next(err);
    }
    return res.render('snippets/index', {title: 'Snippets', snippets: snippets});
  });
});

router.get('/mysnippets', function(req, res, next) {
  Snippet.find({author: req.user._id}).exec(function (err, snippets) {
    if (err) {
      return next(err);
    }
    
    return res.render('snippets/mysnippets', {title: 'My Snippets', snippets: snippets});
  });
});

router.get('/delete/:id', function(req, res, next) {
  if (idValidator.isValid(req.params.id)) {
    Snippet.findById(req.params.id, function(err, snippet) {
      if (err) {
        req.flash('error', 'Error when trying to delete snippet');
        return res.redirect('/snippets/mysnippets');
      }
      
      if (snippet) {
        if (snippet.author.equals(req.user._id) || (req.user.role === 'admin' && snippet.public === true)) {
          Snippet.remove({_id: snippet._id}, function (err) {
            if (err) {
              next(err);
            }
            req.flash('info', 'Snippet succesfully deleted');
            return res.redirect('/snippets/mysnippets');
          });
        } else {
          req.flash('info', 'You do not have permission to delete this snippet');
          return res.redirect('/snippets/mysnippets');
        }
      } else {
      req.flash('info', 'No snippet found to delete');
      return res.redirect('/snippets/mysnippets');
      }
    });
  } else {
    req.flash('info', 'No snippet found to delete');
    return res.redirect('/snippets/mysnippets');
  }
});

module.exports = router;
