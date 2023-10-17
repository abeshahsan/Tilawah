const express = require('express');
const router = express.Router();

const controls = require('./controls')

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        options: controls
    });
});

module.exports = router;
