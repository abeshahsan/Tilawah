const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('../controls')

/* GET home page. */
router.get("/song/:id", function (req, res) {
    res.sendFile(req.session.allAudio[req.params.id].path);
});

router.get('/logout', function (req, res, next) {
    delete req.session.user
    res.redirect("/")
});

router.post('/home', function (req, res) {
    res.render('audio-table', {
        tableRows: req.session.allAudio
    }, function (err, html) {
        if (err) {
            console.warn(err)
        }
        res.send({html, loginRegister: !req.session.user})
    });
});

router.post('/playlist/:id', async function (req, res, next) {
    try {
        let playListAudio = await controls.loadPlaylistAudio(req.params.id, req.session.allAudio);
        res.render('audio-table', {
            tableRows: playListAudio
        }, function (err, html) {
            if (err) {
                console.warn(err)
            }
            res.send({html, loginRegister: !req.session.user})
        });
    } catch (error) {
        next();
    }
});

router.post('/new-playlist', async function(req, res, next){
    let playlistName = req.body.playlistName;
    try {
        let result = await controls.createNewPlaylist(req.session.user.userID, playlistName);
        req.session.user.playlists.push({
            id: result.insertId,
            name: playlistName
        });
        res.send({
            success: 1,
            playlist:{
                id: result.insertId,
                 name: playlistName
            }
        });
    } catch (error) {
        next();
    }
});

module.exports = router;

