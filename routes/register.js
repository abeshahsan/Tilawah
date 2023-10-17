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

module.exports = router;
