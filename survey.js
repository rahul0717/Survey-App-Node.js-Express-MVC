// The Survey Controller page
// The required imports and the global variables
// We will be invoking the Model method from here
var model = require("./model.js")
const { json } = require("body-parser");
var currentPage = 1;
var nextBtnFlag = "inline";
var previousBtnFlag = "none";
var choicesarr = [];
var username;
var questionData;
var totalQuestion;
var selectedChoices = []
var currentSessionId;


// GET function 
// We will render the same Survey page dynamically for all senarios using the specified view engine
function get(req, res) {
    currentSessionId = req.cookies['connect.sid'];
    // Checking if the session is valid and it's a valid request
    if (req.session && req.session.username && req.session.failedRequest == false) {
        if (req.session.survey == true) {
            // Clicked survey button
            console.log("inside the get survey");
            console.log(req);
            username = req.session.username;
            try {
                questionData = model.readQuestions();
            } catch (e) {
                req.session.failedRequest = true
                req.session.errorstatus = 500
                res.status("500")
                res.redirect('/survey')
            }
            totalQuestion = questionData.questions.length;
            // Checking if it' not the final page that is requested
            if (req.session.showFinal != true) {
                if (req.session.pagesVisited[currentPage - 1] == false) {
                    req.session.pagesVisited[currentPage - 1] = true
                    for (var i = 0; i < questionData.questions[currentPage - 1].choices.length; i++) {
                        choicesarr.push(questionData.questions[currentPage - 1].choices[i].choice)
                    }
                    if (req.session.isReturningUser) {
                        selectedChoices[currentPage - 1] = req.session.userData.surveyAnswers[currentPage - 1];
                    } else {
                        selectedChoices[currentPage - 1] = ""
                    }
                    req.session.choiceArr = choicesarr;
                    req.session.pageinfoSet = true;
                    req.session.currentPage = currentPage;
                    req.session.totalQuestion = totalQuestion;
                    req.session.lastPage = totalQuestion;
                    choicesarr = [];
                    // The uiParams is the object created for dynamically setting values to our views

                    var uiParams = {
                        showMatch: false,
                        showFinal: false,
                        name: username,
                        question: questionData.questions[currentPage - 1].question,
                        choices: req.session.choiceArr,
                        pref: req.session.renderingPref,
                        nextFlag: nextBtnFlag,
                        previousFlag: previousBtnFlag,
                        pageNum: req.session.currentPage,
                        choiceToBeSelected: selectedChoices[currentPage - 1],
                        matchData: "",
                        err: false,
                        errorcode: ""
                    }
                    if (req.session.viewEngine == 'pug') {
                        res.render('survey.pug', { uiParams: uiParams });
                    } else {
                        res.render('survey.ejs', { uiParams: uiParams });
                    }
                }
                // If the GET request is coming from the redering preference page then we just re-render 
                //      the same page with the details already present
                else if (req.session.pagesVisited[currentPage - 1] == true && req.session.comingFromRender == true) {
                    var uiParams = {
                        showMatch: false,
                        showFinal: false,
                        name: username,
                        question: questionData.questions[currentPage - 1].question,
                        choices: req.session.choiceArr,
                        pref: req.session.renderingPref,
                        nextFlag: nextBtnFlag,
                        previousFlag: previousBtnFlag,
                        pageNum: req.session.currentPage,
                        choiceToBeSelected: selectedChoices[currentPage - 1],
                        matchData: "",
                        err: false,
                        errorcode: ""
                    }
                    if (req.session.viewEngine == 'pug') {
                        res.render('survey.pug', { uiParams: uiParams });
                    } else {
                        res.render('survey.ejs', { uiParams: uiParams });
                    }
                }
                // This is the rendering from a post call or the user is a returning user
                else if (req.session.pagesVisited[currentPage - 1] == true && req.session.comingFromRender == false) {
                    currentPage = req.session.currentPage;
                    for (var i = 0; i < questionData.questions[currentPage - 1].choices.length; i++) {
                        choicesarr.push(questionData.questions[currentPage - 1].choices[i].choice)
                    }
                    req.session.choiceArr = choicesarr;
                    req.session.pageinfoSet = true;
                    req.session.currentPage = currentPage;
                    var uiParams = {
                        showMatch: false,
                        showFinal: false,
                        name: username,
                        question: questionData.questions[currentPage - 1].question,
                        choices: req.session.choiceArr,
                        pref: req.session.renderingPref,
                        nextFlag: nextBtnFlag,
                        previousFlag: previousBtnFlag,
                        pageNum: req.session.currentPage,
                        choiceToBeSelected: selectedChoices[currentPage - 1],
                        matchData: "",
                        err: false,
                        errorcode: ""
                    }
                    if (req.session.viewEngine == 'pug') {
                        res.render('survey.pug', { uiParams: uiParams });
                    } else {
                        res.render('survey.ejs', { uiParams: uiParams });
                    }
                }
            }
            // If the user has completed all the survey questions
            else if (req.session.showFinal == true) {
                var currentUserData = {}
                var viewEngine = req.session.viewEngine;
                currentUserData.username = req.session.username;
                currentUserData.surveyAnswers = req.session.userChoices;
                nextBtnFlag = "inline";
                previousBtnFlag = "none";
                if (req.session.isReturningUser) {
                    try {
                        model.updateUserDetails(currentUserData);
                    } catch (e) {
                        req.session.failedRequest = true
                        req.session.errorstatus = 500
                        res.status("500")
                        res.redirect('/survey')
                    }
                } else {
                    try {
                        model.writeUserData(currentUserData);
                    } catch (e) {
                        req.session.failedRequest = true
                        req.session.errorstatus = 500
                        res.status("500")
                        res.redirect('/survey')
                    }
                }
                res.cookie('username', req.session.username);
                res.cookie('renderingPreference', req.session.renderingPref)
                res.set("REFRESH", "20;URL=http://localhost:3000/landing")
                req.session.destroy();
                var uiParams = {
                    showMatch: false,
                    showFinal: true,
                    name: username,
                    question: "",
                    choices: "",
                    pref: "",
                    nextFlag: "",
                    previousFlag: "",
                    pageNum: "",
                    choiceToBeSelected: "",
                    matchData: "",
                    err: false,
                    errorcode: ""
                }
                if (viewEngine == 'pug') {
                    res.render('survey.pug', { uiParams: uiParams });
                } else {
                    res.render('survey.ejs', { uiParams: uiParams });
                }
            }

        } 
        // If the user clicked Match button
        else if (req.session.survey == false) {
            username = req.session.username;
            try {
                var matchData = model.match(username);
            } catch (e) {
                req.session.failedRequest = true
                req.session.errorstatus = 500
                res.status("500")
                res.redirect('/survey')
            }
            // If the user a new user or if the user hasn't selected any options in the survey
            if (matchData[0] != "There were no match for ") {
                var uiParams = {
                    showMatch: true,
                    showFinal: false,
                    name: username,
                    question: "",
                    choices: "",
                    pref: "",
                    nextFlag: "",
                    previousFlag: "",
                    pageNum: "",
                    choiceToBeSelected: "",
                    matchDataFlag: true,
                    matchData: matchData,
                    err: false,
                    errorcode: ""
                }

            } else {
                var uiParams = {
                    showMatch: true,
                    showFinal: false,
                    name: username,
                    question: "",
                    choices: "",
                    pref: "",
                    nextFlag: "",
                    previousFlag: "",
                    pageNum: "",
                    choiceToBeSelected: "",
                    matchDataFlag: false,
                    matchData: matchData,
                    err: false,
                    errorcode: ""
                }

            }
            if (req.session.viewEngine == 'pug') {
                res.render('survey.pug', { uiParams: uiParams });
            } else {
                res.render('survey.ejs', { uiParams: uiParams });
            }
        }

    } 
    // If the request is invalid or if an exception has occured
    // We will handle all the following requests:
    // 500: internal server error, 
    // 404: Page not found
    // 401: Invalid request
    // 405: Method not allowed
    else {
        if (req.session && req.session.errorstatus) {
            res.status(req.session.errorstatus);
            res.set("REFRESH", "20;URL=http://localhost:3000/landing")
            var uiParams = {
                showMatch: false,
                showFinal: false,
                name: username,
                question: "",
                choices: "",
                pref: "",
                nextFlag: "",
                previousFlag: "",
                pageNum: "",
                choiceToBeSelected: "",
                matchData: "",
                err: true,
                errorcode: req.session.errorstatus
            }
            if (req.session.viewEngine == 'pug') {
                res.render('survey.pug', { uiParams: uiParams });
            } else {
                res.render('survey.ejs', { uiParams: uiParams });
            }

        } else {
            res.status("401");
            res.set("REFRESH", "20;URL=http://localhost:3000/landing")
            var uiParams = {
                showMatch: false,
                showFinal: false,
                name: username,
                question: "",
                choices: "",
                pref: "",
                nextFlag: "",
                previousFlag: "",
                pageNum: "",
                choiceToBeSelected: "",
                matchData: "",
                err: true,
                errorcode: 401
            }
            if (req.session.viewEngine == 'pug') {
                res.render('survey.pug', { uiParams: uiParams });
            } else {
                res.render('survey.ejs', { uiParams: uiParams });
            }
        }
    }


}

// POST function
function post(req, res) {
    var action = req.body["action"];
    currentPage = parseInt(req.body["pageNum"]);
    console.log("inide post");
    // If the user clicked the next button
    if (action == "next") {
        if (currentPage + 1 <= totalQuestion) {

            selectedChoices[currentPage - 1] = req.body["choice"];
            currentPage += 1;
            choicesarr = []
            nextBtnFlag = "inline";
            previousBtnFlag = "inline";
            req.session.currentPage = currentPage;
            req.session.userChoices = selectedChoices;
            req.session.comingFromRender = false;
            res.redirect('/survey');

        }
        else if (currentPage + 1 > totalQuestion) {
            choicesarr = []
            selectedChoices[currentPage - 1] = req.body["choice"];
            req.session.userChoices = selectedChoices;
            currentPage = 1
            req.session.showFinal = true
            res.redirect('/survey');
        }

    } 
    // If the user clicked the previous button
    else if (action == "previous") {
        if (currentPage - 1 > 1) {
            selectedChoices[currentPage - 1] = req.body["choice"];
            currentPage -= 1;
            req.session.currentPage = currentPage;
            choicesarr = []
            nextBtnFlag = "inline";
            previousBtnFlag = "inline";
            req.session.currentPage = currentPage;
            req.session.userChoices = selectedChoices;
            req.session.comingFromRender = false;
            res.redirect('/survey');

        }
        else if (currentPage - 1 == 1) {
            selectedChoices[currentPage - 1] = req.body["choice"];
            currentPage -= 1;
            req.session.currentPage = currentPage;
            choicesarr = []
            nextBtnFlag = "inline";
            previousBtnFlag = "none";
            req.session.currentPage = currentPage;
            req.session.userChoices = selectedChoices;
            req.session.comingFromRender = false;
            res.redirect('/survey');

        }

    }

}



module.exports = { get, post }