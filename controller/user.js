const User = require("../models/user.js");

module.exports.renderSignUp = (req, res) => {
    res.render("../users/signup.ejs");
}

module.exports.saveSignUpInfo = async (req, res, next) => {
    try{
        let { username, email, password} = req.body;
        let newUser = new User({email, username});
        let regUser = await User.register( newUser, password);
        req.login( regUser, (err) => {
            if(err) {return next(err)}
            req.flash("success", "Welcome to WanderLust! You're logged in as", username);
            res.redirect("/listings")
        })
    } catch (e) {
        req.flash("error" , e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLogin = (req, res) => {
    res.render("../users/login.ejs");
}

module.exports.userLogin =  async (req, res) => {
    try{
        let {username } = req.body;
        req.flash("success", "Welcome to WanderLust! You're logged in as", username);
        res.redirect(res.locals.redirectUrl)  
    } catch (e) {
        req.flash("error" , e.message)
        res.redirect("/login")
    }
}

module.exports.userLogOut =  (req, res, next) => {
    req.logout((err) => {
        if (err){
            return next(err)
        }
        req.flash("success", "Logged Out Successfully!");
        res.redirect("/listings")
    })
}