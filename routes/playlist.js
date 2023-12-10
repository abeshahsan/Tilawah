const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('../controls');

router.get('/:id', async function (req, res, next) {

    try {
        let playListAudio = await controls.loadPlaylistAudio(req.params.id, req.session.allAudio);

        return res.render('index', {
            options: {
                hamburger: true,
                loginRegister: false
            },
            user: req.session.user,
            audioList: playListAudio,
            countryOptions: controls.countryOptions,
            route: "/playlist"
        });
    } catch (error) {
        next();
    }
});

module.exports = router;
