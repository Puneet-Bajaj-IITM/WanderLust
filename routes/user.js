const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utilsw/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controller/user.js");

//---SignUp Route------//

router
    .route("/signup")
    .get( userController.renderSignUp) //render signup page
    .post( wrapAsync(userController.saveSignUpInfo)) // save signup info and then login

//-------Login Route--------//

router
    .route("/login")
    .get( userController.renderLogin) //render login page
    .post( saveRedirectUrl , passport.authenticate( "local", {failureRedirect: "/login", failureFlash: true}) , wrapAsync (userController.userLogin)) //login and save info

//--------LogOut route--------//

router.get("/logout", userController.userLogOut) //logout user

module.exports = router;