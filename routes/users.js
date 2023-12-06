const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('../controls')


/**
 * Default Get Request
 */
router.get(['/', '/home'], function (req, res) {
    // console.log(req.session.allAudio)
    let options = {}
    let _audioList = req.session.allAudio;

    options.loginRegister = !req.session.user;
    options.hamburger = true;

    res.render('index', {
        options: options,
        user: req.session.user,
        audioList: _audioList,
        countryOptions: controls.countryOptions,
        route: req.path
    });
});

router.get(['/login', '/register'], function (req, res) {
    // console.log(req.session.allAudio)
    let options = {}
    let _audioList = req.session.allAudio;

    options.loginRegister = false;
    options.hamburger = false;

    res.render('index', {
        options: options,
        user: req.session.user,
        audioList: _audioList,
        countryOptions: controls.countryOptions,
        route: req.path
    });
});

router.get('/profile', function (req, res, next) {

    if(!req.session.user) {
        res.redirect("/login");
    }

    // console.log(req.session.allAudio)
    let options = {}
    let _audioList = req.session.allAudio;

    options.loginRegister = false;
    options.hamburger = true;

    res.render('index', {
        options: options,
        user: req.session.user,
        audioList: _audioList,
        countryOptions: controls.countryOptions,
        route: req.path
    });
});

module.exports = router;