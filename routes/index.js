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
        user: req.session.user,
        audioList: [
            {
                title: "a",
                creator: "abc",
                length: "00:00"
            },
            {
                title: "b",
                creator: "xyz",
                length: "00:00"
            },
            {
                title: "c",
                creator: "wpm",
                length: "00:00"
            },
            {
                title: "d",
                creator: "lsd",
                length: "00:00"
            },
        ]
    });
});

module.exports = router;
