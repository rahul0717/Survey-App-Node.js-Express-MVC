// app.js is the application entry point
// Required imports and global variables
// This is one the controller
var express = require('express');
const { ppid } = require('process');
var app = express();
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
var session = require("express-session");
var router = require('./Router.js');
var pug = require('pug');
var ejs = require('ejs');
//********************EXTRA CREDIT***********************
//**********Change the value og this variable to 'pug' or ''ejs *********
//*******************************************************
var selectedViewEngine = "pug";
//*******************************************************

app.use(bodyParser());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
}))

app.set('views', './Views');
// Based on the user choice the view engine is set to either PUG or EJS
if (selectedViewEngine == 'pug') {
    app.set('view engine', 'pug');
    app.engine('pug', pug.__express);
} else {
    app.set('view engine', 'ejs');
    app.engine('html', ejs.renderFile);
}
// Routing functionality
app.use(function (req, res, next) {
    router.setViewEngine(selectedViewEngine)
    next();
});
app.use(['/landing', '/'], router.router);
app.use('/survey', router.router);
app.use('/preferences', router.router);
app.use(function (req, res, next) {
    req.session.failedRequest = true
    req.session.errorstatus = 404
    res.set("REFRESH", "20;URL=http://localhost:3000/landing")
    var uiParams = {
        showMatch: false,
        showFinal: false,
        name: "",
        question: "",
        choices: "",
        pref: "",
        nextFlag: "",
        previousFlag: "",
        pageNum: "",
        choiceToBeSelected: "",
        matchData: "",
        err: true,
        errorcode: 404
    }
    res.render('survey.pug', { uiParams: uiParams })
})
app.listen(3000);