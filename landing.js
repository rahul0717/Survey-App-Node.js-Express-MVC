// Landing Page
// Required imports and global varibles
const { json } = require('body-parser');
var model = require("./model.js")
var renderingPref = "horizontal";
var currentSession = {}
var viewEngine;

// GET function of the Landing page
function get(req, res) {
    if (req.cookies.username != null) {
        var name = req.cookies.username
        renderingPref = req.cookies.renderingPreference
        res.clearCookie('username');
        if (req.session.viewEngine == 'pug') {
            res.render('landing.pug', { username: name })
        } else {
            res.render("landing.ejs", { username: name });
        }
    } else {
        if (req.session.viewEngine == 'pug') {
            res.render('landing.pug', { username: null })
        } else {
            res.render("landing.ejs", { username: null });
        }
    }
}


// POST functin of the Landing Page
function post(req, res) {
    if (req.body["usernameTxt"] != "") {
        var username = req.body["usernameTxt"];
        if (req.body["action"] == "survey") {
            currentSession["req.cookies['connect.sid']"] = {};
            try {
                var isReturningUser = model.checkReturningUser(username);
                var questionData = model.readQuestions();
            } catch (e) {
                req.session.failedRequest = true
                req.session.errorstatus = 500
                res.redirect('/survey')
            }
            var totalPages = questionData.questions.length;
            var isVisited = [];
            for (var i = 0; i < totalPages; i++) {
                isVisited.push(false);
            }
            if (isReturningUser) {
                try {
                    var userDataStored = model.searchUser(username);
                } catch (e) {
                    req.session.failedRequest = true
                    req.session.errorstatus = 500
                    res.redirect('/survey')
                }
                req.session.failedRequest = false;
                req.session.isReturningUser = true;
                req.session.userData = userDataStored;
                req.session.survey = true;
                req.session.username = username;
                req.session.comingFromRender = false;
                req.session.renderingPref = renderingPref;
                req.session.pagesVisited = isVisited;
                req.session.showFinal = false;
                res.redirect('/survey');

            }
            else if (isReturningUser == false) {
                req.session.failedRequest = false;
                req.session.isReturningUser = false;
                req.session.survey = true;
                req.session.username = username;
                req.session.comingFromRender = false;
                req.session.renderingPref = renderingPref;
                req.session.pagesVisited = isVisited;
                req.session.showFinal = false;
                res.redirect('/survey');

            }
        } else if (req.body["action"] == "match") {
            req.session.failedRequest = false;
            req.session.survey = false;
            req.session.username = username;
            res.redirect('/survey');
        }

    } else {
        if (req.session.viewEngine == 'pug') {
            res.render('landing.pug', { username: null })
        } else {
            res.render("landing.ejs", { username: null });
        }
    }


}



module.exports = { get, post }