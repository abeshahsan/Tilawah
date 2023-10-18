const express = require('express');
const router = express.Router();

const controls = require

/* GET home page. */
router.get('/login', function (req, res) {
    res.render('login',
        {
            options: {
                loginRegister: false,
                hamburger: false
            }
        }
    );
});

router.post('/login', function (req, res) {
    res.send({
        success: 1
    })
});

router.post('/forgot-mail', function (req, res) {
    res.send({
        success: 1
    })
});

router.post('/forgot-otp', function (req, res) {
    res.send({
        success: 1
    })
});

module.exports = router;
