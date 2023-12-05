const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('../controls')

/* GET home page. */
router.get("/song/:id", function (req, res) {
    res.sendFile(req.session.allAudio[req.params.id].path);
});

router.get('/playlist/:id', async function (req, res) {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    console.log("lol");
    try {
        let playListAudio = await controls.loadPlaylistAudio(2, req.session.allAudio);

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
        console.log(error);
    }
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

module.exports = router;

