const express = require("express");
const app = express();
const session = require("express-session");

app.use(session({secret: "Gaangu", saveUninitialized: true, resave:false}));

app.get("/name", (req, res) => {
    const {name = "anonymous"} = req.query;
    req.session.name = name;
    res.send(name); 
})

app.get("/hello", (req, res) => {
    res.send(`Hello ${req.session.name}`);
})

app.get("/test", (req, res) => {
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`Session ${req.session.count}`);
})

app.listen(7860, () => {
    console.log("Listening on port 7860")
})