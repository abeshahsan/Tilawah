const express = require('express');
const controls = require("./controls");
const router = express.Router();

/* GET home page. */
router.get('/register', function (req, res) {
    res.render('register',
        {
            options: {
                loginRegister: false,
                hamburger: false
            }
        }
    );
});

router.post('/register-email', function (req, res) {
    res.send({
        success : 1
    })
});

router.post('/register-otp', function (req, res) {
    res.send({
        success : 1
    })
});

module.exports = router;
