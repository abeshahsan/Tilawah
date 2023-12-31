const express = require('express');
const router = express.Router();

const database = require('../database')
const controls = require('../controls')
const {data} = require("express-session/session/cookie");
const mailer = require("../email");

router.post('/login-DOM', function (req, res) {
    res.render('login-DOM', function (err, html) {
        if(err) {
            console.warn(err)
        }
        res.send(html)
    });
});

router.post('/login', function (req, res) {
    database.findUser(req.body.email.trim(), req.body.password.trim(), async function (user) {
        if (!user) {
            return res.send({success: 0})
        } else {
            req.session.user = user;
            req.session.user.email = user.email;

            try {
                req.session.user.lastPlayback = await controls.getLastPlayback(user.userID);

                database.loadPlaylistsOfCurrentUser(user.userID, function (result, error) {
                    if (error) {
                        res.send({success: 0});
                    }
                    let playlists = [];
                    result.forEach(function (entry) {
                        playlists.push({
                            id: entry.PLAYLIST_ID,
                            name: entry.PLAYLIST_NAME
                        });
                    });
                    req.session.user.playlists = playlists;
                    res.send({success: 1});
                });
            } catch (e) {
                console.log(e)
            }

        }
    })
});

router.post('/forgot-mail', function (req, res) {
    database.verifyMail(req.body.email.trim(), function (user) {
        if (!user) { //The user with this email is not found.
            return res.send({success: 0})
        } else { //One user is found.
            req.session.forgot = user
            mailer.sendPasswordResetMail(req.session.forgot.email, function (sentOTP) {
                // Callback function to handle the result of sending the email
                if (sentOTP) {
                    req.session.forgot.otp = sentOTP;
                    console.log(req.session.forgot.otp);
                    res.send({success: 1});
                } else {
                    res.send({success: 0});
                }
            });
        }
    })
});

router.post('/forgot-otp', function (req, res) {
    console.log(req.session.forgot)
    let otp = req.body.otp.trim()
    if (otp === req.session.forgot.otp) {
        return res.send({success: 1})
    } else {
        return res.send({success: 0})
    }
});

router.post('/reset-password', function (req, res) {
    let password = req.body['password'].trim()
    database.updatePassword(req.session.forgot.email, password, function (updated) {
        if (updated) {
            database.findUser(req.session.forgot.email, password, function (user) {
                req.session.user = user;
                req.session.user.email = user.email
                delete req.session.forgot
                return res.send({success: 1})
            })
        } else {
            return res.send({success: 0})
        }
    })
});

module.exports = router;
