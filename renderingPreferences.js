
// GET function of the preference page
function get(req, res) {
    var renderingPreference
    if(req.session.renderingPref != null){
        renderingPreference = req.session.renderingPref;
    }
    if (req.session.viewEngine == 'pug') {
        res.render('preferences.pug', { preference: renderingPreference });
    } else {
        res.render('preferences.ejs', { preference: renderingPreference });
    }
}

// POST function of the preference page
function post(req, res) {
    var renderingPreferenceVal = req.body["prefradio"];
    req.session.comingFromRender = true;
    req.session.renderingPref = renderingPreferenceVal;
    req.session.failedRequest == false;
    res.redirect('/survey');
}


module.exports = { get, post }