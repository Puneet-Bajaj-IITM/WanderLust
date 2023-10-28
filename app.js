if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilsw/error.js");

const flash = require("connect-flash")
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLAS_URL;

main()
    .then(res => console.log("connected to database"))
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})

const sessionOptions = {
    store,
    secret: process.env.SECRET ,
    saveUninitialized: true,
    resave: false,
    cookie: {
        expires: Date.now() + 11 * 24 * 3600000,
        maxAge: 264 * 3600000,
        httpOnly: true,
    }
}

store.on("error", (e)=> {
    console.log("ERROR IN MONGO SESSION", e);
})


app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(session(sessionOptions));
app.use(flash());

app.get("/", (req, res) => {
    res.send("Home route is Working")
})

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

//----Error Handlers----//
app.use((err, req, res, next) => {
    const {status = 500, message = "Some Error Occurred"} = err;
    res.status(status).render("error.ejs", {message});
})

app.listen(3000, () => {
    console.log("Listening at port 3000");
})

