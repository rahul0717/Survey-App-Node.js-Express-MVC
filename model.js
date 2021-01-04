// The Model of the application
// The Model interacts with the Data Source and forms the Data which can be used by the Views

// The required imports and the global variables
var filePath = "./survey.json"
var surveyDataFilePath = "./surveyData.txt"
var fileOptions = { encoding: 'utf8', flag: 'r' }
var fs = require("fs");

// Function to read the Question data
function readQuestions() {
    var data = fs.readFileSync(filePath, fileOptions);
    var questionData = JSON.parse(data);
    return questionData
}


// Function to add new user data
function writeUserData(currentUserData) {
    var data = fs.readFileSync(surveyDataFilePath, fileOptions);
    data = JSON.parse(data);
    data.push(currentUserData);
    data = JSON.stringify(data, null, '\t');
    fs.writeFileSync(surveyDataFilePath, data);
}


// Function to check if the user is a returing user or not
function checkReturningUser(username) {
    var data = fs.readFileSync(surveyDataFilePath, fileOptions);
    data = JSON.parse(data);
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].username == username) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}


// Function to retrieve user data with Username
function searchUser(username) {
    var data = fs.readFileSync(surveyDataFilePath, fileOptions);
    data = JSON.parse(data);
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].username == username) {
                return data[i];
            }
        }

    }
}


// Function to update user data
function updateUserDetails(newUserDetails) {
    var data = fs.readFileSync(surveyDataFilePath, fileOptions);
    data = JSON.parse(data);
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].username == newUserDetails.username) {
                data[i] = newUserDetails;
            }
        }
    }
    data = JSON.stringify(data, null, '\t');
    fs.writeFileSync(surveyDataFilePath, data);
}


// Function to do the Match functionaity
function match(username) {
    var data = fs.readFileSync(surveyDataFilePath, fileOptions);
    data = JSON.parse(data);
    var currentUserdata = searchUser(username);
    var matchData = [];
    var tempMatchData = {}
    var maxmatch = 0;
    var valid = false;
    if (currentUserdata && currentUserdata.username) {
        for (var i = 0; i < currentUserdata.surveyAnswers.length; i++) {
            if (currentUserdata.surveyAnswers[i] != null) {
                valid = true;
            }
        }
    }
    if (valid) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].username != username) {
                for (var j = 0; j < data[i].surveyAnswers.length; j++) {
                    if (data[i]["surveyAnswers"][j] == currentUserdata.surveyAnswers[j]) {
                        maxmatch += 1;
                    }
                }
                tempMatchData.username = data[i].username;
                tempMatchData.maxMatch = maxmatch;
                matchData.push(tempMatchData);
                tempMatchData = {};
                maxmatch = 0;
            }
        }
        matchData.sort(function (a, b) {
            return parseInt(b.maxMatch) - parseInt(a.maxMatch);
        });

    } else {
        matchData[0] = "There were no match for ";
    }

    return matchData;

}

module.exports = { readQuestions, writeUserData, checkReturningUser, searchUser, updateUserDetails, match };