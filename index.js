const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilsw/error.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const flash = require("connect-flash")
const cookieParser = require("cookie-parser");
const session = require("express-session");


main()
    .then(res => console.log("connected to database"))
    .catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


const sessionOptions = {
    secret: "Gaangu",
    saveUninitialized: true,
    resave: false,
    cookie: {
        expires: Date.now() + 11 * 24 * 3600000,
        maxAge: 264 * 3600000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
    res.send("Home route is Working")
})

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"))
})

//----Error Handlers----//
app.use((err, req, res, next) => {
    console.log("-----Error------");
    const {status = 500, message = "Some Error Occurred"} = err;
    res.render("error.ejs", {message});
})

app.listen(3000, () => {
    console.log("Listening at port 3000");
})

