const express = require('express');
const router = express.Router();

const database = require('../database')
const mailer = require('../email')

router.post('/register-DOM', function (req, res) {
    res.render('register-DOM', function (err, html) {
        if(err) {
            console.warn(err)
        }
        res.send(html)
    });
});

/* Receive the user's email to register. */
router.post('/register-email', function (req, res) {
    let email = req.body.email.trim()
    database.verifyMail(email, function (user) {
        if (!user) { // No user with the email found. Registration can proceed
            req.session.register = {email}
            mailer.sendRegisterMail(email, function (sentOTP) {
                req.session.register.sentOTP = sentOTP
                res.send({success: 1})
            })
        } else {
            res.send({success: 0})
        }
    })
});


router.post('/register-otp', function (req, res) {
    let otp = req.body.otp.trim()

    // console.log(req.session.register.sentOTP)

    if (otp === req.session.register.sentOTP) {
        res.send({success: 1})
    } else {
        res.send({success: 0})
    }
});

router.post('/register-complete', function (req, res) {
    let name = req.body.name.trim()
    let password = req.body.password.trim()

    database.insertUser(req.session.register.email, password, name, function (userID) {
        if (userID) {
            req.session.user = {
                userID: userID,
                email: req.session.register.email,
                name: name,
                playlists: []
            }
            delete req.session.register
            res.send({success: 1})
        } else {
            res.send({success: 0})
        }
    })
});

module.exports = router;
