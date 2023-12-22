const path = require("path");
const fs = require("fs");
const express = require ("express");
const app = express();
const hbs = require("hbs");
const mysql = require("mysql");
const session = require("express-session");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.set("auth", path.join(__dirname, "views/auth"));
hbs.registerPartials(__dirname + "/views/partials");

const port = 8080;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ispesa"
})

app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    resave: false,
    saveUninitialized : false,
    secret: 'iSpesa segreto'
}));

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

app.get("/signup", (req, res) => {
    res.render('signup.hbs');
})

app.post("/checkLogin", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var sql = "SELECT Username, Password FROM utente_registrato WHERE Username = '" + username + "' AND Password = '" + password + "'";
    console.log(sql);
    con.connect(function(err) {
        if (err) console.log(err);
        con.query(sql, function(err, result, fields){
            if(err) console.log(err);
            if(result.length > 0){
                req.session.regenerate(function(){
                    req.session.user = username;
                    return res.redirect("/");
                })
            }
            else{
                return res.redirect("/login?credenziali_errate=true");
            }
        })
    })
});

app.post("/checkSignup", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var number = req.body.number;
    var check_fields = "SELECT * FROM utente_registrato WHERE Username = '" + username + "'";
    con.connect(async function(err) {
        if (err) console.log(err);
        con.query(check_fields, function(err, result, fields){
            if(err) console.log(err);
            if(result.length > 0){
                return res.redirect("/signup?exists_username=true")
            }
            else{
                query_new_user = "INSERT INTO utente_registrato (Username, Email, Telefono, Password) VALUES ('" + username + "','" + email + "','" + number + "','" + password + "')";
                con.query(query_new_user, function(err, result, fields){
                    if(err) console.log(err);
                    return res.redirect("/login");
                })
            }
        })
    })
});

//Chiamate API

//Volantini

app.get("/api/salvaVolantino", (req, res) => {
    
})

app.get("/api/eliminaVolantino", (req, res) => {
    
})

app.get("/api/trovaTuttiVolantini", (req, res) => {
    
})

app.get("/api/trovaVolantiniFiltroNegozio", (req, res) => {
    
})

app.get("/api/trovaVolantiniFiltroPreferiti", (req, res) => {
    
})

//Sconti

app.get("/api/salvaSconto", (req, res) => {
    
})

app.get("/api/eliminaSconto", (req, res) => {
    
})

app.get("/api/trovaTuttiSconti", (req, res) => {
    
})

app.get("/api/trovaScontiFiltroNegozio", (req, res) => {
    
})

app.get("/api/trovaScontiFiltroCategoria", (req, res) => {
    
})

app.get("/api/trovaScontiFiltroProdotto", (req, res) => {
    
})

app.get("/api/trovaScontiFiltroValore", (req, res) => {
    
})

app.get("/api/trovaScontiFiltroPreferiti", (req, res) => {
    
})

//Negozi

app.get("/api/salvaNegozio", (req, res) => {
    
})

app.get("/api/eliminaNegozio", (req, res) => {
    
})

app.get("/api/modificaOrario", (req, res) => {
    
})

app.get("/api/modificaUbicazione", (req, res) => {
    
})

app.get("/api/aggiungiRecensione", (req, res) => {
    
})

app.get("/api/aggiungiVolantino", (req, res) => {
    
})

app.get("/api/trovaTuttiNegozi", (req, res) => {
    
})

app.get("/api/trovaTuttiNegoziFiltroNome", (req, res) => {
    
})

app.get("/api/trovaTuttiNegoziFiltroLocalità", (req, res) => {
    
})

app.get("/api/trovaTuttiNegoziFiltroPreferiti", (req, res) => {
    
})

//Prodotti

app.get("/api/salvaProdotto", (req, res) => {
    
})

app.get("/api/eliminaProdotto", (req, res) => {
    
})

app.get("/api/modificaImmagine", (req, res) => {
    
})

app.get("/api/aggiungiPrezzo", (req, res) => {
    
})

app.get("/api/trovaTuttiProdotti", (req, res) => {
    
})

app.get("/api/trovaProdottiFiltroNome", (req, res) => {
    
})

app.get("/api/trovaProdottiFiltroNegozio", (req, res) => {
    
})

app.get("/api/trovaProdottiFiltroCategoria", (req, res) => {
    
})

app.get("/api/trovaProdottiFiltroPreferiti", (req, res) => {
    
})

//Utente

app.get("/api/salvaUtente", (req, res) => {
    
})

app.get("/api/eliminaUtente", (req, res) => {
    
})

app.get("/api/login", (req, res) => {
    
})

app.get("/api/ripristinoPassword", (req, res) => {
    
})

app.get("/api/registrati", (req, res) => {
    
})

app.get("/api/eliminaUtente", (req, res) => {
    
})

app.get("/api/modificaPassword", (req, res) => {
    
})

app.get("/api/modificaNumeroTelefono", (req, res) => {
    
})

app.get("/api/modificaFotoProfilo", (req, res) => {
    
})

app.get("/api/aggiungiProdottoAiPreferiti", (req, res) => {
    
})

app.get("/api/rimuoviProdottoDaiPreferiti", (req, res) => {
    
})

app.get("/api/aggiungiNegozioAiPreferiti", (req, res) => {
    
})

app.get("/api/rimuoviNegozioDaiPreferiti", (req, res) => {
    
})

app.get("/api/ottieniDatiUtente", (req, res) => {
    
})

app.get("/api/trovaTuttiUtenti", (req, res) => {
    
})

app.get("/api/trovaTuttiUtentiNome", (req, res) => {
    
})

app.get("/api/logout", (req, res) => {
    
})

app.get("/api/ottieniProdottiPreferiti", (req, res) => {
    
})

app.get("/api/ottieniNegoziPreferiti", (req, res) => {
    
})

//Recensione

app.get("/api/salvaRecensione", (req, res) => {
    
})

app.get("/api/eliminaRecensione", (req, res) => {
    
})

app.get("/api/oscuraTesto", (req, res) => {
    
})

app.get("/api/oscuraTuttoTesto", (req, res) => {
    
})

app.get("/api/trovaRecensioniFiltroUtente", (req, res) => {
    
})

app.get("/api/trovaRecensioniFiltroNegozio", (req, res) => {
    
})

app.get("/api/trovaTutteRecensioni", (req, res) => {
    
})

//Amministratore

app.get("/api/login", (req, res) => {
    
})

app.get("/api/logout", (req, res) => {
    
})

//Mail

app.get("/api/inviaMail", (req, res) => {
    
})

//Categoria

app.get("/api/categorie", (req, res) => {
    sql = "SELECT * FROM categoria";
    con.query(sql, function(err, results){
        res.json(results);
        return;
    });
})



app.listen(port, () => {
    console.log("Server is listening on port " + port);
});