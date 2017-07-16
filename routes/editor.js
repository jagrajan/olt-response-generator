var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    return res.render('editor/index', {title: 'Editor'});
});

module.exports = router;