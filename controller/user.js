const User = require("../models/user.js");

module.exports.signUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    let newUser = new User({username,email});
    let registereduser = await User.register(newUser,password);
    req.logIn(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
       res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back on WanderLust");
    res.redirect("/listings");
}

module.exports.logOut = (req,res)=>{
    req.logOut((err)=>{
        if(err){
        return next(err);
        }
        req.flash("error","you were logged out!");
        res.redirect("/listings");
    });

}