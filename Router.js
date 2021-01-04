// The Main Routing module
// Control passes from app.js to router
// Required imports and global variables
var express = require('express')
var router = express.Router()
var landing = require("./landing.js")
var survey = require("./survey.js")
var rendPref = require("./renderingPreferences.js")
var ViewEngine;

//Function to set the selected vew engine
function setViewEngine(selectedViewEngine){
  ViewEngine = selectedViewEngine;
}

// Routing for the landing page
// We only allow GET and POST methods
router.route(['/landing', '/'])
  .get(function (req, res) {
    req.session.viewEngine = ViewEngine;
    landing.get(req, res);
  })
  .post(function (req, res) {
    landing.post(req, res);
  })
  .all(function (req, res) {
    req.session.failedRequest = true
    req.session.errorstatus = 405
    req.session.viewEngine = ViewEngine;
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
      errorcode: 405
    }
    res.render('survey.pug', { uiParams: uiParams })
  })


// Routing for the survey page
// We only allow GET and POST methods
router.route('/survey')
  .get(function (req, res) {
    req.session.viewEngine = ViewEngine;
    survey.get(req, res)
  })
  .post(function (req, res) {
    survey.post(req, res)
  })
  .all(function (req, res) {
    req.session.failedRequest = true
    req.session.errorstatus = 405
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
      errorcode: 405
    }
    res.render('survey.pug', { uiParams: uiParams })

  })

// Routing for the preference page
// We only allow GET and POST methods
router.route('/preferences')
  .get(function (req, res) {
    rendPref.get(req, res);
  })
  .post(function (req, res) {
    rendPref.post(req, res);
  })
  .all(function (req, res) {
    req.session.failedRequest = true
    req.session.errorstatus = 405
    res.set("REFRESH", "5;URL=http://localhost:3000/landing")
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
      errorcode: 405
    }
    res.render('survey.pug', { uiParams: uiParams })
  })


module.exports = {router,setViewEngine}