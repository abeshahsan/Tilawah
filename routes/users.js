const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('../controls')


/**
 * Default Get Request
 */
router.get('*', function (req, res) {
    // console.log(req.session.allAudio)
    let options = {}
    let _audioList = req.session.allAudio;

    if (req.path === "/login" || req.path === "/register") {
        options.loginRegister = false;
        options.hamburger = false;
    } else {
        options.loginRegister = !req.session.user;
        options.hamburger = true;
    }

    res.render('index', {
        options: options,
        user: req.session.user,
        audioList: _audioList,
        countryOptions: controls.countryOptions,
        route: req.path
    });
});

module.exports = router;