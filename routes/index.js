const express = require('express');
const router = express.Router();

const controls = require('./controls')

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        options: {
            loginRegister: !req.session.user,
            hamburger: true
        },
        user: req.session.user
    });
});

module.exports = router;
