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
    req.sanitize('documentId').escape();
    req.sanitize('private').escape();
    req.sanitize('category').escape();
    var public = true;
    if (req.body.private) {
        public = false;
    }
    if(['stockphrase', 'template', 'snippet'].indexOf(req.body.category) == -1) {
        req.flash('error', 'Please select a valid category');
        res.redirect('/editor/edit');
    }
    if (req.body.documentId
        && idValidator.isValid(req.body.documentId)) {
        Snippet.findById(req.body.documentId, function(err, snippet) {
            if (err) {
                next(err);
            }
            console.log(snippet);
            if (snippet && (snippet.author.equals(req.user._id) || req.user.role === 'admin')) {
                snippet.public = public;
                snippet.type = req.body.category;
                snippet.title = req.body.title;
                snippet.content = req.body.content;
                snippet.save(function(err) {
                    if (err) {
                        req.flash('error', 'Unable to update snippet');
                        return res.redirect('/snippets/mysnippets');
                    } else {
                        req.flash('info', 'Snippet successfully updated');
                        return res.redirect('/snippets/mysnippets');
                    }
                });
            } else {
                req.flash('error', 'Unable to edit snippet');
                return res.redirect('/snippets/mysnippets');
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
                req.flash('error', 'Unable to save new snippet');
                return res.redirect('/snippets/mysnippets');
            }
            req.flash('info', 'Successfully created ' + newSnippet.type);
            return res.redirect('/snippets/mysnippets');
        });
    }
});

router.get('/edit/:id', function(req, res, next) {
    if (idValidator.isValid(req.params.id)) {
        Snippet.findById(req.params.id, function(err, snippet) {
            if (err) {
                next(err);
            }

            if (snippet && (snippet.public === true || snippet.author.equals(req.user._id))) {
                res.render('editor/edit', {title: 'Editor', snippet: snippet})
            } else {
                req.flash('error', 'Unable to find snippet');
                res.redirect('/editor/edit');
            }
        });
    } else {
        req.flash('error', 'Unable to find snippet');
        res.redirect('/editor/edit');
    }
});

module.exports = router;