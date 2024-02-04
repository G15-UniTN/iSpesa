const path = require("path");
const fs = require("fs");
const express = require ("express");
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const hbs = require("hbs");
const mysql = require("mysql");
const session = require("express-session");
const swaggerOptions ={
    swaggerDefinition: {
        info : {
            title: 'iSpesa API',
            version: '1.0.0',
        }
    },
    apis: ['main.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const methodOverride = require('method-override');

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(methodOverride('_method'));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(__dirname + "/views/partials");

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

var shutting_down = false;
app.use(function (req, resp, next) {
    if(!shutting_down)
      return next();
   
    resp.setHeader('Connection', "close");
    resp.send(503, "Server is in the process of closing");
});

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
            res.render("negozio.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato', title: 'formRecensione', formRecensione:'formRecensione'});
        }
        else{
            res.render("negozio.hbs", { title: 'header', header: 'header', title: 'formRecensione', formRecensione:'none'});
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
        req.session.destroy();
    }
    res.redirect("/");
})

app.get("/preferiti", (req, res) => {
    if(req.session.user != null){
        res.render("preferiti.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.render("preferiti.hbs", { title: 'header', header: 'header'});
    };
})

app.get("/area_personale", (req, res) => {
    if(req.session.user != null){
        if(req.session.isAdmin){
            res.render("area_personale.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato', title: 'admin', admin: 'admin_settings'});
        }
        else{
            res.render("area_personale.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato', title: 'admin', admin: 'none'});
        }
    }
    else{
        res.redirect("/");
    };
})

app.get("/admin_utenti", (req, res) => {
    if(req.session.isAdmin){
        res.render("admin_utenti.hbs", { title: 'header', header: 'header_loggato'});
    }
    else{
        res.redirect("/");
    };
})

app.get("/admin_recensioni", (req, res) => {
    if(req.session.isAdmin){
        res.render("admin_recensioni.hbs", { title: 'header', header: 'header_loggato'});
    }
    else{
        res.redirect("/");
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

app.post("/login", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var sql = "SELECT Username, Password, isAdmin FROM utente_registrato WHERE Username = '" + username + "' AND Password = '" + password + "'";
    con.query(sql, function(err, result, fields){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        }
        if(result.length > 0){
            req.session.regenerate(function(){
                req.session.user = username;
                if(result[0].isAdmin){
                    req.session.isAdmin = true;
                    console.log(req.session);
                }
                else{
                    req.session.isAdmin = false;
                }
                res.redirect(200, "/");
                return;
            })
        }
        else{
            res.redirect("/login?credenziali_errate=true");
            return;
        }
    })
});

app.post("/registrati", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var number = req.body.number;
    var check_fields = "SELECT * FROM utente_registrato WHERE Username = '" + username + "'";
    con.query(check_fields, function(err, result, fields){
        if(err) {
            console.log(err);
            res.sendStatus(500);
        }
        if(result.length > 0){
            res.redirect("/signup?exists_username=true");
            return;
        }
        else{
            query_new_user = "INSERT INTO utente_registrato (Username, FotoProfilo, Email, Telefono, Password) VALUES ('" + username + "','" + "/img/sito/pfp.jpg" + "','" + email + "','" + number + "','" + password + "')";
            con.query(query_new_user, function(err, result, fields){
                if(err) console.log(err);
                res.redirect("/login");
                return;
            })
        }
    })
});

//Chiamate API

//Volantini

app.post("/api/salvaVolantino", (req, res) => {
    var Negozio = req.body.Negozio;
    var DataFine = req.body.DataFine;
    var VolantinoFile = req.body.VolantinoFile;
    sql = "INSERT INTO volantino (Negozio, DataFine, VolantinoFile) VALUES ('" + Negozio + "','" + DataFine + "','" + VolantinoFile +"')";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.send("Aggiunto");
        return;
    });
})

app.delete("/api/eliminaVolantino", (req, res) => {
    var IDVolantino = req.body.IDVolantino;
    sql = "DELETE FROM volantino WHERE IDVolantino = '" + IDVolantino + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.send("Rimosso");
        return;
    });
})

/**
 * @swagger
 * /api/trovaTuttiVolantini:
 *  get:
 *      description: Trova tutti i volantini
 *      responses:
 *          200:
 *              description: Success
 */
app.get("/api/trovaTuttiVolantini", (req, res) => {
    sql = "SELECT v.Negozio AS IDNegozio, v.DataFine, v.VolantinoFile, v.IDVolantino, n.Nome as Negozio, n.Logo FROM volantino v, negozio n WHERE v.Negozio = n.IDNegozio";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    });
})

app.get("/api/trovaVolantiniFiltroNegozio", (req, res) => {
    var Negozio = req.query.IDNegozio;
    sql = "SELECT v.Negozio AS IDNegozio, v.DataFine, v.VolantinoFile, v.IDVolantino, n.Nome as Negozio, n.Logo FROM volantino v, negozio n WHERE v.Negozio = n.IDNegozio AND n.IDNegozio = '" + Negozio + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    });
})

//Sconti

app.post("/api/salvaSconto", (req, res) => {
    var Valore = req.body.Valore;
    var Negozio = req.body.Negozio;
    var DataInizio = req.body.DataInizio;
    var DataFine = req.body.DataFine;
    if(req.session.isAdmin){
        if(Valore == undefined || Negozio == undefined || DataInizio == undefined || DataFine == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "INSERT INTO sconto (Valore, Negozio, DataInizio, DataFine) VALUES ('" + Valore + "','" + Negozio + "','" + DataInizio + "'" + DataFine + "')";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(201);
            res.json(results);
            return;
        });    
    }
    else{
        res.sendStatus(403);
    }
})

app.delete("/api/eliminaSconto", (req, res) => {
    var IDSconto = req.body.IDSconto;
    if(req.session.isAdmin){
        if(IDSconto == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "DELETE FROM sconto WHERE IDSconto = '" + IDSconto + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(204);
            return;
        });    
    }
    else{
        res.sendStatus(403);
    }
})

app.get("/api/trovaTuttiSconti", (req, res) => {
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo FROM sconto s, negozio n WHERE s.Negozio = n.IDNegozio";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

app.get("/api/trovaScontiConCategoria", (req, res) => {
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsc.CategoriaApplicabile AS Categoria FROM sconto s, negozio n, validita_sconto_categoria vsc WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsc.IDSconto";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

app.get("/api/trovaScontiConCategoriaFiltroNegozio", (req, res) => {
    var Negozio = req.query.Negozio;
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsc.CategoriaApplicabile AS Categoria FROM sconto s, negozio n, validita_sconto_categoria vsc WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsc.IDSconto AND s.Negozio = '" + Negozio + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

app.get("/api/trovaScontiConProdotto", (req, res) => {
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsp.prodotto AS IDProdotto FROM sconto s, negozio n, validita_sconto_prodotto vsp WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsp.Sconto";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

app.get("/api/trovaScontiConProdottoFiltroNegozio", (req, res) => {
    var Negozio = req.query.Negozio;
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsp.prodotto AS IDProdotto FROM sconto s, negozio n, validita_sconto_prodotto vsp WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsp.Sconto AND s.Negozio = '" + Negozio + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

//Negozi

app.post("/api/salvaNegozio", (req, res) => {
    var Ubicazione = req.body.Ubicazione;
    var Orari = req.body.Orari;
    var Nome = req.body.Nome;
    var Logo = req.body.Logo;
    if(req.session.isAdmin){
        if(Ubicazione == undefined || Orari == undefined || Nome == undefined || Logo == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "INSERT INTO negozio (Ubicazione, Orari, Nome, Logo) VALUES ('" + Ubicazione + "','" + Orari + "','" + Nome + "','" + Logo + "')";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(201);
            res.json(results);
            return;
        });    
    }
    else{
        res.sendStatus(403);
    }
})

app.delete("/api/eliminaNegozio", (req, res) => {
    var IDNegozio = req.body.IDNegozio;
    if(req.session.isAdmin){
        if(IDNegozio == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "DELETE FROM negozio WHERE IDNegozio = '" + IDNegozio + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(204);
            return;
        });    
    }
    else{
        res.sendStatus(403);
    }
})

app.patch("/api/modificaOrari", (req, res) => {
    var IDNegozio = req.body.IDNegozio;
    var Orari = req.body.Orari;
    if(req.session.isAdmin){
        if(IDNegozio == undefined || Orari == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "UPDATE negozio SET Orari = '" + Orari + "' WHERE IDNegozio = '" + IDNegozio + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(204);
            return;
        });    
    }
    else{
        res.sendStatus(403);
    }
})

app.patch("/api/modificaUbicazione", (req, res) => {
    var IDNegozio = req.body.IDNegozio;
    var Ubicazione = req.body.Ubicazione;
    if(req.session.isAdmin){
        if(IDNegozio == undefined || Ubicazione == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "UPDATE negozio SET Ubicazione = '" + Ubicazione + "' WHERE IDNegozio = '" + IDNegozio + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.sendStatus(204);
            return;
        });    
    }
    else{
        res.sendStatus(403);
    }
})


app.get("/api/trovaTuttiNegozi", (req, res) => {
    sql = "SELECT * FROM negozio";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

app.get("/api/trovaTuttiNegoziFiltroNome", (req, res) => {
    var Nome = req.query.Nome;
    sql = "SELECT * FROM negozio WHERE Nome = '" + Nome + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

app.get("/api/trovaTuttiNegoziFiltroUbicazione", (req, res) => {
    var Ubicazione = req.query.Ubicazione;
    sql = "SELECT * FROM negozio WHERE Ubicazione = '" + Ubicazione + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

app.get("/api/trovaNegozioFiltroID", (req, res) => {
    var IDNegozio = req.query.IDNegozio;
    var sql = "SELECT * FROM negozio WHERE IDNegozio = '" + IDNegozio + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    })
})

//Prodotti

app.post("/api/salvaProdotto", (req, res) => {
    var Nome = req.body.Nome;
    var Immagine = req.body.Immagine;
    var Categoria = req.body.Categoria;
    var IDNegozio = req.body.IDNegozio;
    sql = "INSERT INTO prodotto (Nome, Immagine, Categoria, IDNegozio) VALUES ('" + Nome + "','" + Immagine + "','" + Categoria + "'" + IDNegozio + "')";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.send("Aggiunto");
        return;
    });
})

app.delete("/api/eliminaProdotto", (req, res) => {
    var IDProdotto = req.body.IDProdotto;
    sql = "DELETE FROM prodotto WHERE IDProdotto = '" + IDProdotto + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.send("Rimosso");
        return;
    });
})

app.patch("/api/modificaImmagine", (req, res) => {
    var IDProdotto = req.body.IDProdotto;
    var Immagine = req.body.Immagine;
    sql = "UPDATE prodotto SET Immagine = '" + Immagine + "' WHERE IDProdotto = '" + IDProdotto + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.send("Aggiornato");
        return;
    });
})

app.post("/api/aggiungiPrezzo", (req, res) => {
    var Prodotto = req.body.Prodotto;
    var Prezzo = req.body.Prezzo;
    sql = "INSERT INTO storicoprezzi (Prodotto, Prezzo) VALUES ('" + Prodotto + "','" + Prezzo + "')";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.send("Aggiunto");
        return;
    });
})

app.get("/api/trovaTuttiProdotti", (req, res) => {
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
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
            res.sendStatus(500);
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
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/trovaProdottiFiltroNome", (req, res) => {
    var Nome = req.query.Nome;
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio AND p.Nome = '" + Nome + "' GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/trovaProdottoFiltroID", (req, res) => {
    var IDProdotto = req.query.IDProdotto;
    var sql = "SELECT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, n.IDNegozio, s2.Prezzo FROM prodotto p, storicoprezzi s2, negozio n WHERE p.IDProdotto = s2.Prodotto AND p.IDProdotto ='" + IDProdotto + "' AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(s2.Data)";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/trovaProdottiFiltroNegozio", (req, res) => {
    var IDNegozio = req.query.IDNegozio;
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio AND p.NegozioProvenienza = '" + Negozio + "' GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/trovaProdottiFiltroCategoria", (req, res) => {
    var Categoria = req.query.Categoria;
    var sql = "SELECT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, s2.Prezzo FROM prodotto p, storicoprezzi s2, negozio n WHERE p.IDProdotto = s2.Prodotto AND p.Categoria = '" + Categoria + "' AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(s2.Data)"
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

//Utente

//salvaUtente rimosso poichè equivale a /login

app.delete("/api/eliminaUtente", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin){
        var Username = req.body.Username;
        sql = "DELETE FROM utente_registrato WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.redirect('back');
            return;
        });
    }
})

app.get("/api/ripristinoPassword", (req, res) => {
    //Usa GMail
})

app.patch("/api/attiva2AF", (req, res) => {
    //Usa auth0
    var User = req.session.user;
    if(User == req.body.Username){
        var Username = req.body.Username;
        var EmailNuova = req.body.Email;
        sql = "UPDATE utente_registrato SET 2AF_attiva = '" + 1 + "' WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.redirect('back');
            return;
        });
    }
})


app.patch("/api/modificaPassword", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        var PasswordVecchia = req.body.PasswordVecchia;
        var PasswordNuova = req.body.Password;
        sql = "SELECT * FROM utente_registrato WHERE Password = '" + PasswordVecchia + "' AND Username = '" + Username + "'";
        con.query(sql, function(err, results){ // Controlla se la password vecchia corrisponde con quella nel database
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
            else if(results.length > 0){
                sql = "UPDATE utente_registrato SET Password = '" + PasswordNuova + "' WHERE Username = '" + Username + "'";
                con.query(sql, function(err, results){
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    res.status(200);
                    res.redirect('back');
                    return;
                });
            }
            else{
                res.send("Password vecchia sbagliata");
                return;
            }
        });
    }
    else{
        res.send("Privilegi insufficenti");
        return;
    }
})

app.patch("/api/modificaEmail", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        var EmailNuova = req.body.Email;
        sql = "UPDATE utente_registrato SET Email = '" + EmailNuova + "' WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.redirect('back');
            return;
        });
    }
})

app.patch("/api/modificaNumeroTelefono", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        var TelefonoNuovo = req.body.Telefono;
        sql = "UPDATE utente_registrato SET Telefono = '" + TelefonoNuovo + "' WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.redirect('back');
            return;
        });
    }
})

app.patch("/api/modificaFotoProfilo", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        var FotoProfilo = req.body.FotoProfilo;
        sql = "UPDATE utente_registrato SET FotoProfilo = '" + FotoProfilo + "' WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.redirect('back');
            return;
        });
    }
})

app.post("/api/aggiungiProdottoAiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDProdotto = req.body.IDProdotto;
    console.log("body:");
    console.log(req.body);
    var sql = "INSERT INTO prodottipreferiti (Prodotto, Utente) VALUES ('" + IDProdotto + "', '" + Username + "')";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

app.delete("/api/rimuoviProdottoDaiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDProdotto = req.body.IDProdotto;
    console.log("body remove:");
    console.log(req.body);
    var sql = "DELETE FROM prodottipreferiti WHERE Prodotto = '" + IDProdotto + "' AND Utente = '" + Username + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

app.post("/api/aggiungiNegozioAiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDNegozio = req.body.IDNegozio;
    var sql = "INSERT INTO negozipreferiti (Negozio, Utente) VALUES ('" + IDNegozio + "', '" + Username + "')";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

app.delete("/api/rimuoviNegozioDaiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDNegozio = req.body.IDNegozio;
    var sql = "DELETE FROM negozipreferiti WHERE Negozio = '" + IDNegozio + "' AND Utente = '" + Username + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    })
})

app.get("/api/ottieniDatiUtente", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || req.query.Username == User){
        var Username = req.query.Username;
        sql = "SELECT Username, FotoProfilo, 2AF_attiva AS TFA_attiva, Email, Bloccato, Telefono, Password, isAdmin FROM utente_registrato WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.send(results);
            return;
        });
    }
    else{
        res.send("Privilegi insufficenti");
    }
})

app.get("/api/trovaTuttiUtenti", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin){
        sql = "SELECT Username, FotoProfilo, 2AF_attiva AS TFA_attiva, Email, Bloccato, Telefono, Password, isAdmin FROM utente_registrato";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.send(results);
            return;
        });
    }
    else{
        res.send("Privilegi insufficenti");
    }
})

//trovaTuttiUtentiNome fa la stessa azione di ottieniDatiUtente, rimosso.


app.get("/api/ottieniProdottiPreferiti", (req, res) => {
    if(req.session.user != null){
        var user = req.session.user;
        var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n, prodottipreferiti pp WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio AND p.IDProdotto = pp.Prodotto AND pp.Utente = '" + user + "' GROUP BY p.IDProdotto HAVING MAX(sp.Data)";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
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

app.get("/api/checkProdottoPreferito", (req, res) => {
    if(req.session.user != null){
        var Username = req.session.user;
        var Prodotto = req.query.IDProdotto;
        var sql = "SELECT * FROM prodottipreferiti WHERE Utente = '" + Username + "' AND Prodotto = '" + Prodotto + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
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
    if(req.session.user != null){
        var user = req.session.user;
        var sql = "SELECT * FROM negozio n, negozipreferiti np WHERE n.IDNegozio = np.Negozio AND np.Utente = '" + user + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
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

app.get("/api/checkNegozioPreferito", (req, res) => {
    if(req.session.user != null){
        var Username = req.session.user;
        var Negozio = req.query.IDNegozio;
        var sql = "SELECT * FROM negozipreferiti WHERE Utente = '" + Username + "' AND Negozio = '" + Negozio + "'";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
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

//Recensione

app.post("/api/salvaRecensione", (req, res) => {
    if(req.session.user != null){
        var Username = req.session.user;
        var Titolo = req.body.Titolo;
        var N_stelle = req.body.Stelle;
        var Testo = req.body.Testo;
        var Negozio = req.body.IDNegozio;
        if(N_stelle < 1 || N_stelle > 5){
            res.send("Invio errato");
            return;
        }
        var sql = "INSERT INTO recensione (Titolo, Testo, N_stelle, Utente, Negozio) VALUES ('" + Titolo + "', '" + Testo + "', '" + N_stelle + "','" + Username + "','" + Negozio + "')";
        con.query(sql, function(err, results){
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.redirect('back');
            return;
        })
    }
    else{
        res.send("Richiesta inviata senza aver effettuato il login");
    }
})

app.delete("/api/eliminaRecensione", (req, res) => {
    if(req.session.user != null){
        var User = req.session.user;
        if(req.session.isAdmin || User == req.body.Username){
            var IDRecensione = req.body.IDRecensione;
            var sql = "DELETE FROM recensione WHERE IDRecensione = '" + IDRecensione + "'";
            con.query(sql, function(err, results){
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                };
                res.json(results);
                return;
            })
        }
        else{
            res.send("Permessi insufficenti");
        }
    }
    else{
        res.send("Richiesta inviata senza aver effettuato il login");
    }
})

//oscuraTesto difficilissimo da implementare

app.get("/api/trovaRecensioniFiltroUtente", (req, res) => {
    var Username = req.query.Username;
    sql = "SELECT r.Titolo, r.Testo, r.N_stelle, r.Data_creazione, r.Utente AS Nome, r.IDRecensione, u.FotoProfilo, n.Nome, n.IDNegozio as Negozio FROM recensione r, utente_registrato u, negozio n WHERE r.Negozio = n.IDNegozio AND r.Utente = u.Username AND r.Utente = '" + Username + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    });
})

app.get("/api/trovaRecensioniFiltroNegozio", (req, res) => {
    var Negozio = req.query.IDNegozio;
    sql = "SELECT r.Titolo, r.Testo, r.N_stelle, r.Data_creazione, r.Utente AS Nome, r.IDRecensione, u.FotoProfilo, n.Nome AS Negozio, n.IDNegozio FROM recensione r, utente_registrato u, negozio n WHERE r.Negozio = n.IDNegozio AND r.Utente = u.Username AND r.Negozio = '" + Negozio + "'";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    });
})

app.get("/api/trovaTutteRecensioni", (req, res) => {
    var sql = "SELECT r.Titolo, r.Testo, r.N_stelle, r.Data_creazione, r.Utente AS Nome, r.IDRecensione, u.FotoProfilo, n.Nome AS Negozio, n.IDNegozio FROM recensione r, utente_registrato u, negozio n WHERE r.Negozio = n.IDNegozio AND r.Utente = u.Username";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    });
})

//Mail

app.get("/api/inviaMail", (req, res) => {
    //GMail API
})

//Categoria

app.get("/api/categorie", (req, res) => {
    sql = "SELECT * FROM categoria";
    con.query(sql, function(err, results){
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.status(200);
        res.json(results);
        return;
    });
})

function closeDB(){
    con.end((error) => {
        if(error){
            console.error('Error closing MySQL connection:', error);
            return;
        }
    });
}

module.exports.app = app;
module.exports.closeDB = closeDB;