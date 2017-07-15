var express = require('express');
var router = express.Router();
var idValidator = require('valid-objectid');

var Snippet = require('../models/snippet');

router.get('/', function(req, res, next) {
    return res.render('editor/index', {title: 'Editor'});
});

router.get('/edit', function(req, res, next) {
    return res.render('editor/edit', {title: 'Editor'});
});

router.post('/edit', function(req, res, next){
    var errors = [];
    req.sanitize('title').escape();
    req.sanitize('documentId').escape();
    req.sanitize('content').escape();
    req.sanitize('private').escape();
    req.sanitize('category').escape();
    var public = true;
    if (req.body.private) {
        public = false;
    }
    if (req.body.documentId
        && idValidator.isValid(req.body.documentId)) {
        Snippet.findById(req.body.documentID, function(err, snippet) {
            if (err) {
                next(err);
            }

            if (snippet && snippet.author.equals(req.user._id)) {
                req.flash('info', 'Editing snippet');
                return res.redirect('/editor/edit');
                //TODO edit snippet
            } else {
                req.flash('error', 'Unable to edit snippet');
                return res.redirect('/editor/edit');
            }
        });
    } else {
        var newSnippet = new Snippet({
            author: req.user._id,
            public: public,
            type: req.body.category,
            title: req.body.title,
            content: req.body.content
        });
        newSnippet.save(function(err) {
            if (err) {
                errors.push('Unable to create a new snippet');
            }
            req.flash('info', 'Successfully created ' + newSnippet.type);
            return res.redirect('/editor/edit');
        });
    }
});

module.exports = router;