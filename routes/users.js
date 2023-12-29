const express = require('express');
const router = express.Router();
const controls = require('../controls')


router.get(['/', '/home'], function (req, res) {
    let options = {}
    let _audioList = req.session.allAudio;
    let _playlists = [];
    if (req.session.user != null) {
        _playlists = req.session.user.playlists;
    }
    options.loginRegister = !req.session.user;
    options.hamburger = true;
    let lastPlaylistID = -1;

    if(req.session.user && req.session.user.lastPlayback) {
        lastPlaylistID = req.session.user.lastPlayback["PLAYLIST_ID"];
    }

    res.render('index', {
        options: options,
        user: req.session.user,
        audioList: _audioList,
        playlists: _playlists,
        playlistID: lastPlaylistID,
        countryOptions: controls.countryOptions,
        route: req.path
    });
});

router.get(['/login', '/register'], function (req, res) {
    if (req.session.user) {
        return res.redirect("/");
    }

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
    if (!req.session.user) {
        return res.redirect("/");
    }

    let options = {}
    let _audioList = req.session.allAudio;
    let _playlists = req.session.user.playlists;
    options.loginRegister = false;
    options.hamburger = true;

    res.render('index', {
        options: options,
        user: req.session.user,
        audioList: _audioList,
        playlists: _playlists,
        countryOptions: controls.countryOptions,
        route: req.path
    });
});

module.exports = router;