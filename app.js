if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbURL = process.env.ATLASDB_URL;
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressErorr = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter : 24 * 3600,
})

store.on("error",()=>{console.log("ERROR IN MONGO SESSION STORE")});

const sessionoptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));  //to serve static file

async function main() {
    await mongoose.connect(dbURL);
}

main()
.then(()=>{console.log("connected to db")})
.catch((err)=>{console.log(err)});

// app.get("/",(req,res)=>{
//     res.send("Hi I am root");
// });

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"kshitiz"
//     })

//     let registeredUser = await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);


app.all("*",(req,res,next)=>{
    next(new ExpressErorr(404,"Page not found!"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong !"} = err;
    res.status(status).render("listings/error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});