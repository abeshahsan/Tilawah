const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('../controls');

router.get('/:id', async function (req, res, next) {
    try {
        let playListAudio = await controls.loadPlaylistAudio(req.params.id, req.session.allAudio);
        
        let _playlists = [];
        if(req.session.user != null){
            _playlists = req.session.user.playlists;
        }
        return res.render('index', {
            options: {
                hamburger: true,
                loginRegister: false
            },
            user: req.session.user,
            audioList: playListAudio,
            playlists: _playlists,
            countryOptions: controls.countryOptions,
            route: "/playlist"
        });
    } catch (error) {
        next();
    }
});




module.exports = router;
