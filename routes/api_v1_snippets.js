var express = require('express');
var router = express.Router();

var Snippet = require('../models/snippet')

router.post('/quick_create', function(req, res, next) {
    if (req.user) {
        req.sanitize('content').trim();
        var content = req.body.content;
        if (content && content !== '') {
            var newSnippet = new Snippet({
            author: req.user._id,
            title: 'New Stockphrase',
            content: content
            });
            newSnippet.save(function(err) {
                if (err) {
                    return res.json({'error': 'Unable to create snippet'});
                } else {
                    return res.json({'success': 'New snippet successfully created'});
                }
            });
        } else {
            return res.json({'error': 'Invalid request'});
        }
        //return res.json({'user': req.user._id});
    } else {
        return res.json({'error': 'Unauthorized request'});
    }
});

module.exports = router;