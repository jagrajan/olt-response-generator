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



module.exports = router;
