const path = require("path");
const fs = require("fs");
const express = require ("express");
const app = express();
const hbs = require("hbs");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.set("auth", path.join(__dirname, "views/auth"));
hbs.registerPartials(__dirname + "/views/partials");

const port = 8080;

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}:  ${req.method}  ${req.url}`;

    console.log(log);
    next();
});

app.get("/", (req, res) => {
    res.render('home.hbs');
})

app.get("/negozi", (req, res) => {
    res.render('negozi.hbs');
})

app.get("/sconti", (req, res) => {
    res.render('sconti.hbs');
})

app.get("/volantini", (req, res) => {
    res.render('volantini.hbs');
})

app.get("/login", (req, res) => {
    res.render('login.hbs');
})

app.listen(port, () => {
    console.log("Server is listening on port " + port);
});