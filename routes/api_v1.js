var express = require('express');
var router = express.Router();

var api_v1_snippets = require('./api_v1_snippets');

router.use('/snippets', api_v1_snippets);

module.exports = router;