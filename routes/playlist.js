const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('../controls');
const database = require('../database');

router.get('/playlist/:id', async function (req, res, next) {
    if (!req.session.user) {
        res.redirect("/");
    }

    try {
        let playListAudio = await controls.loadPlaylistAudio(req.params.id, req.session.allAudio);

        let _playlists = [];
        if (req.session.user != null) {
            _playlists = req.session.user.playlists;
        }
        let lastPlaylistID = -1;

        if (req.session.user && req.session.user.lastPlayback) {
            lastPlaylistID = req.session.user.lastPlayback["PLAYLIST_ID"];
        }

        return res.render('index', {
            options: {
                hamburger: true,
                loginRegister: false
            },
            user: req.session.user,
            audioList: playListAudio,
            playlists: _playlists,
            playlistID: lastPlaylistID,
            countryOptions: controls.countryOptions,
            route: "/playlist"
        });
    } catch (error) {
        next();
    }
});

router.post('/playlist/:id', async function (req, res, next) {
    try {
        let playListAudio = await controls.loadPlaylistAudio(req.params.id, req.session.allAudio);
        if (!playListAudio) playListAudio = req.session.allAudio;
        res.render('audio-table', {
            tableRows: playListAudio
        }, function (err, html) {
            if (err) {
                console.warn(err)
            }
            res.send({html: html, loginRegister: !req.session.user, playListAudio: playListAudio});
        });
    } catch (error) {
        console.log(error)
        next();
    }
});

router.post('/new-playlist', async function (req, res, next) {
    let playlistName = req.body.playlistName;
    try {
        let result = await controls.createNewPlaylist(req.session.user.userID, playlistName);
        req.session.user.playlists.push({
            id: result.insertId,
            name: playlistName
        });
        res.send({
            success: 1,
            playlist: {
                id: result.insertId,
                name: playlistName
            }
        });
    } catch (error) {
        res.send({success: 0});
        next();
    }
});

router.post('/update-playlist/:playlistID', async function (req, res, next) {
    let playlistName = req.body.playlistName;
    let playlistID = req.params.playlistID;
    try {
        await controls.updatePlaylistName(playlistID, playlistName);

        

        res.send({
            success: 1,
            playlist: {
                id: playlistID,
                name: playlistName
            }
        });
    } catch (error) {
        res.send({success: 0});
        next();
    }
});


module.exports = router;
