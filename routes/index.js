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


router.get('/get-playlists', function(req, res){
    res.send({playlists: req.session.user.playlists});
});

router.post('/add-audio-to-playlist',async function(req, res, next){
    try {
        let status = await controls.addAudioToPlaylist(req.body.audioId, req.body.playlistId);
       
        res.send({success: status});
    } catch (error) {
        next();
    }
});
router.post('/delete-audio',async function(req, res, next){
    try {
        let status = await controls.deleteAudioFromPlaylist(req.body.audioId, req.body.playlistId);
        res.send({success: status});
    } catch (error) {
        next();
    }
}); 



module.exports = router;

