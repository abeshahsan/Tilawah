const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const logger = require('morgan');
const database = require('./database');
const controls = require('./controls');

const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const profileRouter = require('./routes/profile');
const playlistRouter = require('./routes/playlist');
const app = express();

app.use(expressSession({
    secret: "kaane-kaane-boli-shuno", resave: true, saveUninitialized: true,
}));

(async () => {
    try {
        const allAudio = await controls.preLoadAllAudio();
        // Do something with the allAudio object
        console.log(Object.keys(allAudio).length + " audio loaded");

        /**
         * The server should load all the audio from the database.
         * Store it into session to use it globally
         */
        app.use((req, res, next) => {
            req.session.allAudio = allAudio;
            next();
        })

// view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');

// app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));


        app.use('/', indexRouter);
        app.use('/', loginRouter);
        app.use('/', registerRouter);
        app.use('/', profileRouter);
        app.use('/', usersRouter);
        app.use('/', playlistRouter);


        app.use(function (req, res, next) {
            next(createError(404))
        });
// catch 404 and forward to error handler

// error handler
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });

    } catch (error) {
        // Handle any errors that occurred during the loading process
        console.error("Error loading audio:", error);
    }
})();

module.exports = app;
