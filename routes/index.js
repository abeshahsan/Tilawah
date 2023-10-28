const express = require('express');
const router = express.Router();
const path = require('path');
const controls = require('./controls')

/* GET home page. */
router.get('/', function (req, res) {
    console.log(req.session.allAudio)
    res.render('index', {
        options: {
            loginRegister: !req.session.user,
            hamburger: true
        },
        user: req.session.user,
        audioList: req.session.allAudio
    });
});

router.get("/song",function(req,res){
    res.sendFile("H:/Random Pics/Kya Khub Lagti Ho - Abeer Bhai.mp3");
});

module.exports = router;
