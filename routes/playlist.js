const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('../controls')

router.get('/2', async function (req, res, next) {
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
        route: '/home'
    });

    // console.log("lol");
    // try {
    //     let playListAudio = await controls.loadPlaylistAudio(req.params.id, req.session.allAudio);
    //
    //     console.log(playListAudio);
    //
    //     return res.render('index', {
    //         options: {
    //             hamburger: true,
    //             loginRegister: false
    //         },
    //         user: req.session.user,
    //         audioList: playListAudio,
    //         countryOptions: controls.countryOptions,
    //         route: "/playlist"
    //     });
    // } catch (error) {
    //     console.log(error);
    // }
});


module.exports = router;

