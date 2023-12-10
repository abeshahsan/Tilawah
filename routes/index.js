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

router.post('/playlist/:id', function (req, res) {
    res.render('audio-table', {
        tableRows: req.session.allAudio
    }, function (err, html) {
        if (err) {
            console.warn(err)
        }
        res.send({html, loginRegister: !req.session.user})
    });
});

router.post('/new-playlist', async function(req, res, next){
    let playlistName = req.body.playlistName;
    try {
        let success = await controls.createNewPlaylist(req.session.user.userID, playlistName);
        res.send(success);
    } catch (error) {
        next();
    }
});

module.exports = router;

