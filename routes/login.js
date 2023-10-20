const express = require('express');
const router = express.Router();

const database = require('../database')
const {data} = require("express-session/session/cookie");

const controls = require

/* GET home page. */
router.get('/login', function (req, res) {
    res.render('login',
        {
            options: {
                loginRegister: false,
                hamburger: false
            }
        }
    );
});

router.post('/login', function (req, res) {
    database.findUser(req.body.email.trim(), req.body.password.trim(), function (user) {
        if (!user) {
            return res.send({success: 0})
        } else {
            req.session.user = user;
            req.session.user.email = user.email
            return res.send({success: 1})
        }
    })
});

router.post('/forgot-mail', function (req, res) {
    database.verifyMail(req.body.email.trim(), function (user) {
        if (!user) { //The user with this email is not found.
            return res.send({success: 0})
        } else { //One user is found.
            req.session.forgot = user
            return res.send({success: 1})
        }
    })
});

router.post('/forgot-otp', function (req, res) {
    let email = req.body.otp
    res.send({success: 1})
});

module.exports = router;
