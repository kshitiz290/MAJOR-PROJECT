const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const userController = require("../controller/user.js"); 

router.route("/signup")
.get(userController.signUpForm)
.post(wrapAsync(userController.signUp))

router.route("/login")
.get(userController.loginForm)
.post(passport.authenticate("local",{failureRedirect : "/login",failureFlash:true}),
userController.login)

router.get("/logout",userController.logOut);

module.exports = router;