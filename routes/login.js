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

module.exports = router;
