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
    if(req.session.user != null){
        res.render("home.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.render("home.hbs", { title: 'header', header: 'header'});
    }
})

app.get("/negozi", (req, res) => {
    if(req.session.user != null){
        res.render("negozi.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.render("negozi.hbs", { title: 'header', header: 'header'});
    };
})

app.get("/negozio", (req, res) => {
    if(req.query.Negozio == null){
        res.send("Errore: nessun negozio selezionato");
    }
    else{
        if(req.session.user != null){
            res.render("negozio.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
        }
        else{
            res.render("negozio.hbs", { title: 'header', header: 'header'});
        };
    }
})

app.get("/sconti", (req, res) => {
    if(req.session.user != null){
        res.render("sconti.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.render("sconti.hbs", { title: 'header', header: 'header'});
    };
})

app.get("/volantini", (req, res) => {
    if(req.session.user != null){
        res.render("volantini.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.render("volantini.hbs", { title: 'header', header: 'header'});
    };
})

app.get("/login", (req, res) => {
    res.render('login.hbs');
})

app.get("/logout", (req, res) => {
    if(req.session.user != null){
        req.session.user = null;
        res.redirect("/");
    }
    else{
        res.redirect("/");
    }
})

app.get("/preferiti", (req, res) => {
    if(req.session.user != null){
        res.render("preferiti.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.render("preferiti.hbs", { title: 'header', header: 'header'});
    };
})

app.get("/signup", (req, res) => {
    res.render('signup.hbs');
})


app.get("/prodotto", (req, res) => {
    if(req.query.IDProdotto == null){
        res.send("Errore: nessun prodotto selezionato");
    }
    else{
        if(req.session.user != null){
            res.render("prodotto.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
        }
        else{
            res.render("prodotto.hbs", { title: 'header', header: 'header'});
        };
    }
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
    sql = "SELECT v.Negozio AS IDNegozio, v.DataFine, v.VolantinoFile, v.IDVolantino, n.Nome as Negozio, n.Logo FROM volantino v, negozio n WHERE v.Negozio = n.IDNegozio";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    });
})

app.get("/api/trovaVolantiniFiltroNegozio", (req, res) => {
    var negozio = req.query.IDNegozio;
    sql = "SELECT v.Negozio AS IDNegozio, v.DataFine, v.VolantinoFile, v.IDVolantino, n.Nome as Negozio, n.Logo FROM volantino v, negozio n WHERE v.Negozio = n.IDNegozio AND n.IDNegozio = '" + negozio + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    });
})

//Sconti

app.get("/api/salvaSconto", (req, res) => {
    
})

app.get("/api/eliminaSconto", (req, res) => {
    
})

app.get("/api/trovaTuttiSconti", (req, res) => {
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo FROM sconto s, negozio n WHERE s.Negozio = n.IDNegozio";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    });
})

app.get("/api/trovaScontiFiltroNegozio", (req, res) => {
    var negozio = req.query.Negozio;
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo FROM sconto s, negozio n WHERE s.Negozio = n.IDNegozio AND n.IDNegozio = '" + negozio + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    });
})

app.get("/api/trovaScontiFiltroCategoria", (req, res) => {
    
})

app.get("/api/trovaScontiConCategoria", (req, res) => {
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsc.CategoriaApplicabile AS Categoria FROM sconto s, negozio n, validita_sconto_categoria vsc WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsc.IDSconto";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    });
})

app.get("/api/trovaScontiConCategoriaFiltroNegozio", (req, res) => {
    var negozio = req.query.Negozio;
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsc.CategoriaApplicabile AS Categoria FROM sconto s, negozio n, validita_sconto_categoria vsc WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsc.IDSconto AND s.Negozio = '" + negozio + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    });
})


app.get("/api/trovaScontiFiltroProdotto", (req, res) => {
    
})

app.get("/api/trovaScontiFiltroValore", (req, res) => {
    
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
    sql = "SELECT * FROM negozio";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    });
})

app.get("/api/trovaTuttiNegoziFiltroNome", (req, res) => {
    
})

app.get("/api/trovaTuttiNegoziFiltroLocalità", (req, res) => {
    
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
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/trovaTuttiProdottiScontati", (req, res) => {
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, s.Valore AS Sconto, sp.Prezzo FROM prodotto p, sconto s, storicoprezzi sp, validita_sconto_prodotto vsp, validita_sconto_categoria vsc, negozio n WHERE p.NegozioProvenienza = s.Negozio AND ((vsp.prodotto = p.IDProdotto AND vsp.Sconto = s.IDSconto) OR (vsc.CategoriaApplicabile = p.Categoria AND vsc.IDSconto = s.IDSconto)) AND p.IDProdotto = sp.Prodotto AND CURRENT_DATE() >= s.DataInizio AND CURRENT_DATE() <= s.DataFine AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/trovaTuttiProdottiScontatiFiltroCategoria", (req, res) => {
    var Categoria = req.query.Categoria;
    console.log(req.body);
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, s.Valore AS Sconto, sp.Prezzo FROM prodotto p, sconto s, storicoprezzi sp, validita_sconto_prodotto vsp, validita_sconto_categoria vsc, negozio n WHERE p.NegozioProvenienza = s.Negozio AND ((vsp.prodotto = p.IDProdotto AND vsp.Sconto = s.IDSconto) OR (vsc.CategoriaApplicabile = p.Categoria AND vsc.IDSconto = s.IDSconto)) AND p.IDProdotto = sp.Prodotto AND CURRENT_DATE() >= s.DataInizio AND CURRENT_DATE() <= s.DataFine AND p.Categoria = '" + Categoria + "' AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/trovaProdottiFiltroNome", (req, res) => {

})

app.get("/api/trovaProdottoFiltroID", (req, res) => {
    var IDProdotto = req.query.IDProdotto;
    var sql = "SELECT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, s2.Prezzo FROM prodotto p, storicoprezzi s2, negozio n WHERE p.IDProdotto = s2.Prodotto AND p.IDProdotto ='" + IDProdotto + "' AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(s2.Data)";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/trovaProdottiFiltroNegozio", (req, res) => {
    
})

app.get("/api/trovaProdottiFiltroCategoria", (req, res) => {
    var Categoria = req.query.Categoria;
    var sql = "SELECT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, s2.Prezzo FROM prodotto p, storicoprezzi s2, negozio n WHERE p.IDProdotto = s2.Prodotto AND p.Categoria = '" + Categoria + "' AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(s2.Data)"
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    })
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
    var Username = req.session.user;
    var IDProdotto = req.query.IDProdotto;
    var sql = "INSERT INTO prodottipreferiti (Prodotto, Utente) VALUES ('" + IDProdotto + "', '" + Username + "')";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/rimuoviProdottoDaiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDProdotto = req.query.IDProdotto;
    var sql = "DELETE FROM prodottipreferiti WHERE Prodotto = '" + IDProdotto + "' AND Utente = '" + Username + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    })
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
    if(req.session.user != null){
        var user = req.session.user;
        var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n, prodottipreferiti pp WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio AND p.IDProdotto = pp.Prodotto AND pp.Utente = '" + user + "' GROUP BY p.IDProdotto HAVING MAX(sp.Data)";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.send("Error");
                return;
            };
            res.json(results);
            return;
        })
    }
    else{
        res.send("Richiesta inviata senza aver effettuato il login");
    }
})

app.get("/api/ottieniProdottiPreferitiFiltroProdotto", (req, res) => {
    if(req.session.user != null){
        var Username = req.session.user;
        var Prodotto = req.query.IDProdotto;
        var sql = "SELECT * FROM prodottipreferiti WHERE Utente = '" + Username + "' AND Prodotto = '" + Prodotto + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.send("Error");
                return;
            };
            res.json(results);
            return;
        })
    }
    else{
        res.send("Richiesta inviata senza aver effettuato il login");
    }
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
        if(err){
            console.log(err);
            res.send("Error");
            return;
        };
        res.json(results);
        return;
    });
})



app.listen(port, () => {
    console.log("Server is listening on port " + port);
});