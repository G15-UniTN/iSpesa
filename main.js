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
            description: "Documentazione delle API per iSpesa",
            license: {
                "name": "MIT",
                "url": "https://opensource.org/licenses/MIT"
            }
        },
        schemes: ["http", "https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [
            {
                name: "Utente",
                description: "API per il modello 'Utente'. Tutte le API per gestire le azioni relative agli Utenti."
            },
            {
                name: "Volantino",
                description: "API per il modello 'Volantino'. Tutte le API per gestire le azioni relative ai Volantini."
            },
            {
                name: "Sconto",
                description: "API per il modello 'Sconto'. Tutte le API per gestire le azioni relative agli Sconti."
            },
            {
                name: "Negozio",
                description: "API per il modello 'Negozio'. Tutte le API per gestire le azioni relative ai Negozi."
            },
            {
                name: "Prodotto",
                description: "API per il modello 'Prodotto'. Tutte le API per gestire le azioni relative ai Prodotti."
            },
            {
                name: "Recensione",
                description: "API per il modello 'Recensione'. Tutte le API per gestire le azioni relative alle Recensioni."
            },
            {
                name: "GMail",
                description: "API per inviare Email agli Utenti. Non implementato. (Presente come placeholder)"
            },
            {
                name: "Categoria",
                description: "API per il modello 'Recensione'. Tutte le API per gestire le azioni relative alle Categorie."
            },
        ],
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

var con = mysql.createConnection({ // Per connettersi in locale, creare un database usando lo schema contenuto in ./Database/iSpesa_DB.sql e cambiare le credenziali in seguito.
    host: "10.18.241.198",
    user: "admin",
    password: "iSpesaPassword",
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
        res.status(200);
        res.render("home.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.status(200);
        res.render("home.hbs", { title: 'header', header: 'header'});
    }
})

app.get("/negozi", (req, res) => {
    if(req.session.user != null){
        res.status(200);
        res.render("negozi.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.status(200);
        res.render("negozi.hbs", { title: 'header', header: 'header'});
    };
})

app.get("/negozio", (req, res) => {
    if(req.query.Negozio == null){
        res.sendStatus(400);
        return;
    }
    else{
        if(req.session.user != null){
            res.status(200);
            res.render("negozio.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato', title: 'formRecensione', formRecensione:'formRecensione'});
        }
        else{
            res.status(200);
            res.render("negozio.hbs", { title: 'header', header: 'header', title: 'formRecensione', formRecensione:'none'});
        };
    }
})

app.get("/sconti", (req, res) => {
    if(req.session.user != null){
        res.status(200);
        res.render("sconti.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.status(200);
        res.render("sconti.hbs", { title: 'header', header: 'header'});
    };
})

app.get("/volantini", (req, res) => {
    if(req.session.user != null){
        res.status(200);
        res.render("volantini.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.status(200);
        res.render("volantini.hbs", { title: 'header', header: 'header'});
    };
})

app.get("/login", (req, res) => {
    res.status(200);
    res.render('login.hbs');
})

app.get("/logout", (req, res) => {
    if(req.session.user != null){
        req.session.destroy();
    }
    res.redirect(303, "/");
})

app.get("/preferiti", (req, res) => {
    if(req.session.user != null){
        res.status(200);
        res.render("preferiti.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
    }
    else{
        res.redirect(303, "/");
    };
})

app.get("/area_personale", (req, res) => {
    if(req.session.user != null){
        if(req.session.isAdmin){
            res.status(200);
            res.render("area_personale.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato', title: 'admin', admin: 'admin_settings'});
        }
        else{
            res.status(200);
            res.render("area_personale.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato', title: 'admin', admin: 'none'});
        }
    }
    else{
        res.redirect(303, "/");
    };
})

app.get("/admin_utenti", (req, res) => {
    if(req.session.isAdmin){
        res.status(200);
        res.render("admin_utenti.hbs", { title: 'header', header: 'header_loggato'});
    }
    else{
        res.redirect(303, "/");
    };
})

app.get("/admin_recensioni", (req, res) => {
    if(req.session.isAdmin){
        res.status(200);
        res.render("admin_recensioni.hbs", { title: 'header', header: 'header_loggato'});
    }
    else{
        res.redirect(303, "/");
    };
})

app.get("/signup", (req, res) => {
    res.status(200);
    res.render('signup.hbs');
})

app.get("/password_dimenticata", (req, res) => {
    res.status(200);
    res.render('password_dimenticata.hbs');
})

app.get("/prodotto", (req, res) => {
    if(req.query.IDProdotto == null){
        res.sendStatus(400);
    }
    else{
        if(req.session.user != null){
            res.status(200);
            res.render("prodotto.hbs", { title: 'user', user: req.session.user, title: 'header', header: 'header_loggato'});
        }
        else{
            res.status(200);
            res.render("prodotto.hbs", { title: 'header', header: 'header'});
        };
    }
})

/**
 * @swagger
 * /login:
 *  post:
 *      description: Utilizzata per effettuare il login.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente interessato.
 *       - in: query
 *         name: Password
 *         type: string
 *         description: Password dell'Utente da loggare.
 *      responses:
 *          303:
 *              description: SEE OTHER. Reindirizza l'utente ad un'altra pagina.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.post("/login", (req, res) => {
    var Username = req.body.Username;
    var Password = req.body.Password;
    var sql = "SELECT Username, Password, isAdmin FROM utente_registrato WHERE Username = '" + Username + "' AND Password = '" + Password + "'";
    con.query(sql, function(err, result, fields){
        /* istanbul ignore next */
        if(err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        if(result.length > 0){
            req.session.regenerate(function(){
                req.session.user = Username;
                if(result[0].isAdmin){
                    req.session.isAdmin = true;
                }
                else{
                    req.session.isAdmin = false;
                }
                res.redirect(303, "/");
                return;
            })
        }
        else{
            res.redirect(303, "/login?credenziali_errate=true");
            return;
        }
    })
});

/**
 * @swagger
 * /registrati:
 *  post:
 *      description: Usata per inserire nuovi Utenti nel sistema.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: body
 *         name: Dati Utente
 *         description: Dati dell'Utente da registrare.
 *         schema:
 *           type: object
 *           properties:
 *              Username:
 *                  type: string
 *                  description: Username dell'Utente.
 *                  example: Pippo12
 *              Password:
 *                  type: string
 *                  description: Password dell'Utente.
 *                  example: Notifica tristezza
 *              Email:
 *                  type: string
 *                  description: Email dell'Utente da registrare.
 *                  example: antonio@povo.com
 *              NumeroTelefono:
 *                  type: string
 *                  description: Numero di Telefono dell'Utente da registrare.
 *                  example: 3334455589
 *      responses:
 *          303:
 *              description: SEE OTHER. Reindirizza l'utente ad un'altra pagina.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.post("/registrati", (req, res) => {
    var Username = req.body.Username;
    var Password = req.body.Password;
    var Email = req.body.Email;
    var Telefono = req.body.Telefono;
    var check_fields = "SELECT * FROM utente_registrato WHERE Username = '" + Username + "'";
    con.query(check_fields, function(err, result, fields){
        /* istanbul ignore next */
        if(err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        if(result.length > 0){
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, "/signup?errore_inserimento=1");
                return;
            }
            res.sendStatus(400);
            return;
        }
        if(Password.length < 9){
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, "/signup?errore_inserimento=2");
                return;
            }
            res.sendStatus(400);
            return;
        }
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(!format.test(Password)){
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, "/signup?errore_inserimento=3");
                return;
            }
            res.sendStatus(400);
            return;
        }
        if(Password.toLowerCase() == Password || Password.toUpperCase() == Password){
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, "/signup?errore_inserimento=4");
                return;
            }
            res.sendStatus(400);
            return;
        }
        format = /[1234567890]+/;
        if(!format.test(Password)){
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, "/signup?errore_inserimento=5");
                return;
            }
            res.sendStatus(400);
            return;
        }
        else{
            query_new_user = "INSERT INTO utente_registrato (Username, FotoProfilo, Email, Telefono, `Password`) VALUES ('" + Username + "','" + "/img/sito/pfp.jpg" + "','" + Email + "','" + Telefono + "','" + Password + "')";
            con.query(query_new_user, function(err, results){
                /* istanbul ignore next */
                if(err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                res.redirect(303, "/login");
                return;
            })
        }
    })
});

//Chiamate API

//Volantini

/**
 * @swagger
 * /api/salvaVolantino:
 *  post:
 *      description: Aggiungi un nuovo Volantino al sistema.
 *      tags: ["Volantino"]
 *      parameters:
 *       - in: body
 *         name: Dati Volantino
 *         description: Dati del Volantino da salvare.
 *         schema:
 *           type: object
 *           properties:
 *              Negozio:
 *                  type: integer
 *                  description: ID del Negozio da associare al Volantino
 *                  example: 1
 *              DataFine:
 *                  type: string
 *                  format: date
 *                  description: Data di fine validità del Volantino
 *                  example: 2024-02-04
 *              VolantinoFile:
 *                  type: string
 *                  example: https://www.eurospin.it/volantino-nazionale-p04-2024/
 *                  description: File del Volantino sotto forma di URL (in formato base64)
 *      responses:
 *          201:
 *              description: Created. Volantino creato correttamente e salvato.
 *          400:
 *              description: BAD REQUEST. Dati del Volantino non validi.
 *          403:
 *              description: FORBIDDEN. L'Utente che sta provando ad effettuare l'inserimento non è un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */

app.post("/api/salvaVolantino", (req, res) => {
    var Negozio = req.body.Negozio;
    var DataFine = req.body.DataFine;
    var VolantinoFile = req.body.VolantinoFile;
    if(req.session.isAdmin){
        if(Negozio == undefined || DataFine == undefined || VolantinoFile == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "INSERT INTO volantino (Negozio, DataFine, VolantinoFile) VALUES ('" + Negozio + "','" + DataFine + "','" + VolantinoFile +"')";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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
        return;
    }
})
/**
 * @swagger
 * /api/eliminaVolantino:
 *  delete:
 *      description: Elimina un Volantino dal sistema.
 *      tags: ["Volantino"]
 *      parameters:
 *       - in: query
 *         name: IDVolantino
 *         type: integer
 *         description: ID del Volantino da eliminare.
 *      responses:
 *          204:
 *              description: NO CONTENT. Volantino eliminato correttamente e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. ID del Volantino non valido. 
 *          403:
 *              description: FORBIDDEN. L'Utente che sta provando ad effettuare l'inserimento non è un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.delete("/api/eliminaVolantino", (req, res) => {
    var IDVolantino = req.body.IDVolantino;
    sql = "DELETE FROM volantino WHERE IDVolantino = '" + IDVolantino + "'";
    if(req.session.isAdmin){
        if(IDVolantino == undefined){
            res.sendStatus(400);
            return;
        }
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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
        return;
    }
})

/**
 * @swagger
 * /api/trovaTuttiVolantini:
 *  get:
 *      description: Ottiene tutti i Volantini salvati nel sistema.
 *      tags: ["Volantino"]
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Volantini.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiVolantini", (req, res) => {
    sql = "SELECT v.Negozio AS IDNegozio, v.DataFine, v.VolantinoFile, v.IDVolantino, n.Nome as Negozio, n.Logo FROM volantino v, negozio n WHERE v.Negozio = n.IDNegozio";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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
/**
 * @swagger
 * /api/trovaVolantiniFiltroNegozio:
 *  get:
 *      description: Ottiene tutti i volantini salvati nel sistema che si riferiscono ad un determinato negozio.
 *      tags: ["Volantino"]
 *      parameters:
 *       - in: query
 *         name: IDNegozio
 *         type: integer
 *         description: ID del Negozio per cui trovare i Volantini
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Volantini associati al Negozio.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaVolantiniFiltroNegozio", (req, res) => {
    var Negozio = req.query.IDNegozio;
    sql = "SELECT v.Negozio AS IDNegozio, v.DataFine, v.VolantinoFile, v.IDVolantino, n.Nome as Negozio, n.Logo FROM volantino v, negozio n WHERE v.Negozio = n.IDNegozio AND n.IDNegozio = '" + Negozio + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

//Sconti

/**
 * @swagger
 * /api/salvaSconto:
 *  post:
 *      description: Aggungi un nuovo Sconto al sistema.
 *      tags: ["Sconto"]
 *      parameters:
 *       - in: body
 *         name: Dati Sconto
 *         description: Dati dello Sconto da salvare.
 *         schema:
 *           type: object
 *           properties:
 *              Valore:
 *                  type: number
 *                  format: float
 *                  description: Valore dello Sconto
 *                  example: 0.25
 *              Negozio:
 *                  type: integer
 *                  description: ID del Negozio da associare al Sconto
 *                  example: 1
 *              DataInizio:
 *                  type: string
 *                  format: date
 *                  description: Data di inizio validità dello Sconto
 *                  example: 2024-02-04
 *              DataFine:
 *                  type: string
 *                  format: date
 *                  description: Data di fine validità dello Sconto
 *                  example: 2024-03-04
 *      responses:
 *          201:
 *              description: CREATED. Sconto creato correttamente e salvato.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui i dati dello Sconto non siano validi.
 *          403:
 *              description: FORBIDDEN. Errore nel caso in cui un Utente non Amministratore provi a salvare uno Sconto.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
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
        sql = "INSERT INTO sconto (Valore, Negozio, DataInizio, DataFine) VALUES ('" + Valore + "','" + Negozio + "','" + DataInizio + "','" + DataFine + "')";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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

/**
 * @swagger
 * /api/eliminaSconto:
 *  delete:
 *      description: Elimina uno Sconto dal sistema.
 *      tags: ["Sconto"]
 *      parameters:
 *       - in: query
 *         name: IDSconto
 *         type: integer
 *         description: ID dello Sconto da eliminare.
 *      responses:
 *          204:
 *              description: NO CONTENT. Sconto eliminato correttamente e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. ID dello Sconto non valido.
 *          403:
 *              description: FORBIDDEN. Errore nel caso in cui un Utente non Amministratore provi a salvare uno Sconto.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */ 
app.delete("/api/eliminaSconto", (req, res) => {
    var IDSconto = req.body.IDSconto;
    if(req.session.isAdmin){
        if(IDSconto == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "DELETE FROM sconto WHERE IDSconto = '" + IDSconto + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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

/**
 * @swagger
 * /api/associaScontoProdotto:
 *  post:
 *      description: Associa ad uno Sconto un Prodotto.
 *      tags: ["Sconto"]
 *      parameters:
 *       - in: query
 *         name: IDSconto
 *         type: integer
 *         description: ID dello Sconto desiderato.
 *       - in: query
 *         name: IDProdotto
 *         type: integer
 *         description: ID del Prodotto da associare.

 *      responses:
 *          204:
 *              description: NO CONTENT. Associazione creata con successo e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. ID dello Sconto o del Prodotto non valido.
 *          403:
 *              description: FORBIDDEN. L'Utente che prova ad eseguire l'azione non è un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */ 
app.post("/api/associaScontoProdotto", (req, res) => {
    var IDProdotto = req.body.IDProdotto;
    var IDSconto = req.body.IDSconto;
    if(req.session.isAdmin){
        if(IDProdotto == undefined || IDSconto == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "INSERT INTO validita_sconto_prodotto (Sconto, prodotto) VALUES ('" + IDSconto + "','" + IDProdotto + "')";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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
        return;
    }
})

/**
 * @swagger
 * /api/associaScontoCategoria:
 *  post:
 *      description: Associa ad uno Sconto una Categoria.
 *      tags: ["Sconto"]
 *      parameters:
 *       - in: query
 *         name: IDSconto
 *         type: integer
 *         description: ID dello Sconto desiderato.
 *       - in: query
 *         name: Categoria
 *         type: string
 *         description: Categoria da associare.

 *      responses:
 *          204:
 *              description: NO CONTENT. Associazione creata con successo e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. ID dello Sconto o Categoria non valida.
 *          403:
 *              description: FORBIDDEN. L'Utente che prova ad eseguire l'azione non è un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */ 
app.post("/api/associaScontoCategoria", (req, res) => {
    var Categoria = req.body.Categoria;
    var IDSconto = req.body.IDSconto;
    if(req.session.isAdmin){
        if(IDSconto == undefined || Categoria == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "INSERT INTO validita_sconto_categoria (IDSconto, CategoriaApplicabile) VALUES ('" + IDSconto + "','" + Categoria + "')";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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
        return;
    }
})

/**
 * @swagger
 * /api/trovaTuttiSconti:
 *  get:
 *      description: Ottiene tutti gli Sconti salvati nel sistema.
 *      tags: ["Sconto"]
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti gli Sconti.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiSconti", (req, res) => {
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo FROM sconto s, negozio n WHERE s.Negozio = n.IDNegozio";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaScontiConCategoria:
 *  get:
 *      description: Ottiene tutti gli Sconti salvati nel sistema e la relativa categoria di riferimento.
 *      tags: ["Sconto"]
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti gli Sconti e la categoria associata.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaScontiConCategoria", (req, res) => {
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsc.CategoriaApplicabile AS Categoria FROM sconto s, negozio n, validita_sconto_categoria vsc WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsc.IDSconto";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaScontiConCategoriaFiltroNegozio:
 *  get:
 *      description: Ottiene tutti gli Sconti salvati nel sistema che si riferiscono ad un determinato Negozio e la loro relativa categoria.
 *      tags: ["Sconto"]
 *      parameters:
 *       - in: query
 *         name: IDNegozio
 *         type: integer
 *         description: ID del Negozio per cui trovare gli Sconti
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti gli Sconti associati al Negozio e la loro relativa categoria.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaScontiConCategoriaFiltroNegozio", (req, res) => {
    var Negozio = req.query.Negozio;
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsc.CategoriaApplicabile AS Categoria FROM sconto s, negozio n, validita_sconto_categoria vsc WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsc.IDSconto AND s.Negozio = '" + Negozio + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaScontiConProdotto:
 *  get:
 *      description: Ottiene tutti gli Sconti salvati nel sistema e i prodotti su cui valgono.
 *      tags: ["Sconto"]
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti gli Sconti e  i prodotti associati.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaScontiConProdotto", (req, res) => {
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsp.prodotto AS IDProdotto FROM sconto s, negozio n, validita_sconto_prodotto vsp WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsp.Sconto";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaScontiConProdottoFiltroNegozio:
 *  get:
 *      description: Ottiene tutti gli Sconti salvati nel sistema che si riferiscono ad un determinato Negozio e i prodotti su cui sono validi.
 *      tags: ["Sconto"]
 *      parameters:
 *       - in: query
 *         name: IDNegozio
 *         type: integer
 *         description: ID del Negozio per cui trovare gli Sconti
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti gli Sconti associati al Negozio e i rispettivi prodotti.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaScontiConProdottoFiltroNegozio", (req, res) => {
    var Negozio = req.query.Negozio;
    sql = "SELECT s.Valore, s.IDSconto, n.IDNegozio, s.DataInizio, s.DataFine, n.Nome AS Negozio, n.Logo, vsp.prodotto AS IDProdotto FROM sconto s, negozio n, validita_sconto_prodotto vsp WHERE s.Negozio = n.IDNegozio AND s.IDSconto = vsp.Sconto AND s.Negozio = '" + Negozio + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/salvaNegozio:
 *  post:
 *      description: Aggungi un nuovo Negozio al sistema.
 *      tags: ["Negozio"]
 *      parameters:
 *       - in: body
 *         name: Dati Negozio
 *         description: Dati dello Negozio da salvare.
 *         schema:
 *           type: object
 *           properties:
 *              Nome:
 *                  type: string
 *                  description: Nome del Negozio
 *                  example: Eurospinno
 *              Logo:
 *                  type: string
 *                  description: File del logo del Negozio sotto forma di URL
 *                  example: urlgenerico
 *              Ubicazione:
 *                  type: string
 *                  description: Indirizzo del Negozio
 *                  example: Via Antonio Gariboldi 1 Santa Categerina CZ
 *              Orari:
 *                  type: string
 *                  description: Orario di Apertura del Negozio
 *                  example: 08:00 - 20:00
 *      responses:
 *          201:
 *              description: CREATED. Negozio creato correttamente e salvato.
 *          400:
 *              description: BAD REQUEST. Errore inviato nel caso in cui i dati del Negozio siano non validi.
 *          403:
 *              description: FORBIDDEN. Errore nel caso in cui un Utente non Amministratore provi a salvare un Negozio.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
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
            /* istanbul ignore next */
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

/**
 * @swagger
 * /api/eliminaNegozio:
 *  delete:
 *      description: Elimina un Negozio dal sistema.
 *      tags: ["Negozio"]
 *      parameters:
 *       - in: query
 *         name: IDNegozio
 *         type: integer
 *         description: ID del Negozio da eliminare.
 *      responses:
 *          204:
 *              description: NO CONTENT. Negozio eliminato correttamente e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui l'ID del Negozio non sia valido.
 *          403:
 *              description: FORBIDDEN. Errore nel caso in cui un Utente non Amministratore provi ad eliminare un Negozio.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */ 
app.delete("/api/eliminaNegozio", (req, res) => {
    var IDNegozio = req.body.IDNegozio;
    if(req.session.isAdmin){
        if(IDNegozio == undefined){
            res.sendStatus(400);
            return;
        }
        sql = "DELETE FROM negozio WHERE IDNegozio = '" + IDNegozio + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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

/**
 * @swagger
 * /api/modificaOrari:
 *  patch:
 *      description: Modifica l'orario di un Negozio.
 *      tags: ["Negozio"]
 *      parameters:
 *       - in: query
 *         name: IDNegozio
 *         type: integer
 *         description: ID del Negozio interessato.
 *       - in: query
 *         name: NuovoOrario
 *         type: string
 *         description: Nuovo Orario del Negozio.
 *      responses:
 *          204:
 *              description: NO CONTENT. Orario modificato con successo e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui i dati non siano validi.
 *          403:
 *              description: FORBIDDEN. Errore nel caso in cui un Utente non Amministratore provi a modificare l'orario di un Negozio.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */ 
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
            /* istanbul ignore next */
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

/**
 * @swagger
 * /api/modificaUbicazione:
 *  patch:
 *      description: Modifica l'ubicazione di un Negozio.
 *      tags: ["Negozio"]
 *      parameters:
 *       - in: query
 *         name: IDNegozio
 *         type: integer
 *         description: ID del Negozio interessato.
 *       - in: query
 *         name: NuovaUbicazione
 *         type: string
 *         description: Nuova Ubicazione del Negozio.
 *      responses:
 *          204:
 *              description: NO CONTENT. Ubicazione modificata con successo e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui i dati non siano validi.
 *          403:
 *              description: FORBIDDEN. Errore nel caso in cui un Utente non Amministratore provi a modificare l'ubicazione di un Negozio.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */  
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
            /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaTuttiNegozi:
 *  get:
 *      description: Ottiene tutti i Negozi salvati nel sistema.
 *      tags: ["Negozio"]
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Negozi.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiNegozi", (req, res) => {
    sql = "SELECT * FROM negozio";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaTuttiNegoziFiltroNome:
 *  get:
 *      description: Ottiene tutti i Negozi salvati nel sistema con un determinato nome.
 *      tags: ["Negozio"]
 *      parameters:
 *       - in: query
 *         name: NomeNegozio
 *         type: string
 *         description: Nome del Negozio interessato.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Negozi con il nome desiderato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiNegoziFiltroNome", (req, res) => {
    var Nome = req.query.Nome;
    sql = "SELECT * FROM negozio WHERE Nome = '" + Nome + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaTuttiNegoziFiltroUbicazione:
 *  get:
 *      description: Ottiene tutti i Negozi salvati nel sistema che si trovano in un determinato luogo.
 *      tags: ["Negozio"]
 *      parameters:
 *       - in: query
 *         name: UbicazioneNegozio
 *         type: string
 *         description: Ubicazione del Negozio interessato.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Negozi con l'ubicazione desiderata.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiNegoziFiltroUbicazione", (req, res) => {
    var Ubicazione = req.query.Ubicazione;
    sql = "SELECT * FROM negozio WHERE Ubicazione = '" + Ubicazione + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaNegozioFiltroID:
 *  get:
 *      description: Ottiene il Negozio salvato nel sistema con l'ID desiderato.
 *      tags: ["Negozio"]
 *      parameters:
 *       - in: query
 *         name: IDNegozio
 *         type: int
 *         description: ID del Negozio interessato.
 *      responses:
 *          200:
 *              description: OK. Si ottiene correttamente il Negozio con l'ID desiderato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaNegozioFiltroID", (req, res) => {
    var IDNegozio = req.query.IDNegozio;
    var sql = "SELECT * FROM negozio WHERE IDNegozio = '" + IDNegozio + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/salvaProdotto:
 *  post:
 *      description: Aggungi un nuovo Prodotto al sistema.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: body
 *         name: Dati del Prodotto
 *         description: Dati del Prodotto da salvare.
 *         schema:
 *           type: object
 *           properties:
 *              Nome:
 *                  type: string
 *                  description: Nome del Prodotto
 *                  example: Formaggio di Vacca Porolat
 *              Immagine:
 *                  type: string
 *                  description: Immagine del prodotto
 *                  example: url dell'immagine
 *              Categoria:
 *                  type: string
 *                  description: Categoria del Prodotto
 *                  example: Latte, Uova e Derivati
 *              IDNegozio:
 *                  type: int
 *                  description: ID del Negozio dove si può trovare il prodotto
 *                  example: 1
 *      responses:
 *          201:
 *              description: CREATED. Prodotto creato correttamente e salvato.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui i dati non siano validi.
 *          403:
 *              description: FORBIDDEN. Errore nel caso in cui un Utente non Amministratore provi a salvare un Prodotto.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.post("/api/salvaProdotto", (req, res) => {
    var Nome = req.body.Nome;
    var Immagine = req.body.Immagine;
    var Categoria = req.body.Categoria;
    var IDNegozio = req.body.IDNegozio;
    if(Nome == undefined || Immagine == undefined || Categoria == undefined || IDNegozio == undefined){
        res.sendStatus(400);
        return;
    }
    if(req.session.isAdmin){
        sql = "INSERT INTO prodotto (Nome, Immagine, Categoria, NegozioProvenienza) VALUES ('" + Nome + "','" + Immagine + "','" + Categoria + "','" + IDNegozio + "')";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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
        return;
    }
})

/**
 * @swagger
 * /api/eliminaProdotto:
 *  delete:
 *      description: Elimina un Prodotto dal sistema.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: query
 *         name: IDProdotto
 *         description: ID del Prodotto da eliminare.
 *      responses:
 *          204:
 *              description: NO CONTENT. Prodotto eliminato correttamente e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui l'IDProdotto non sia valido.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.delete("/api/eliminaProdotto", (req, res) => {
    var IDProdotto = req.body.IDProdotto;
    if(IDProdotto == undefined){
        res.sendStatus(400);
        return;
    }
    sql = "DELETE FROM prodotto WHERE IDProdotto = '" + IDProdotto + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.sendStatus(204);
        return;
    });  
})

/**
 * @swagger
 * /api/modificaImmagine:
 *  patch:
 *      description: Modifica l'immagine di un Prodotto.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: query
 *         name: IDProdotto
 *         type: integer
 *         description: ID del Prodotto interessato.
 *       - in: query
 *         name: NuovaImmagine
 *         type: string
 *         description: Url della nuova immagine.
 *      responses:
 *          204:
 *              description: NO CONTENT. Immagine modificata con successo e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui i dati non siano validi.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */ 
app.patch("/api/modificaImmagine", (req, res) => {
    var Immagine = req.body.Immagine;
    var IDProdotto = req.body.IDProdotto;
    if(IDProdotto == undefined || Immagine == undefined){
        res.sendStatus(400);
        return;
    }
    sql = "UPDATE prodotto SET Immagine = '" + Immagine + "' WHERE IDProdotto = '" + IDProdotto + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.sendStatus(204);
        return;
    });      
})

/**
 * @swagger
 * /api/aggiungiPrezzo:
 *  post:
 *      description: Aggiungi un prezzo allo storico prezzi di un prodotto.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: query
 *         name: IDProdotto
 *         type: integer
 *         description: ID del Prodotto interessato.
 *       - in: query
 *         name: NuovoPrezzo
 *         type: number
 *         format: float
 *         description: Prezzo da aggiungere allo storico del prodotto.
 *      responses:
 *          204:
 *              description: NO CONTENT. Prezzo inserito con successo e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui i dati non siano validi.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.post("/api/aggiungiPrezzo", (req, res) => {
    var IDProdotto = req.body.IDProdotto;
    var Prezzo = req.body.Prezzo;
    if(IDProdotto == undefined || Prezzo == undefined){
        res.sendStatus(400);
        return;
    }
    sql = "INSERT INTO storicoprezzi (Prodotto, Prezzo) VALUES ('" + IDProdotto + "','" + Prezzo + "')";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.sendStatus(204);
        return;
    });
})

/**
 * @swagger
 * /api/trovaTuttiProdotti:
 *  get:
 *      description: Ottiene tutti i Prodotti salvati nel sistema.
 *      tags: ["Prodotto"]
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Prodotti.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiProdotti", (req, res) => {
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaTuttiProdottiScontati:
 *  get:
 *      description: Ottiene tutti i Prodotti salvati nel sistema su cui vi è uno sconto.
 *      tags: ["Prodotto"]
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Prodotti con uno sconto valido associato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiProdottiScontati", (req, res) => {
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, s.Valore AS Sconto, sp.Prezzo FROM prodotto p, sconto s, storicoprezzi sp, validita_sconto_prodotto vsp, validita_sconto_categoria vsc, negozio n WHERE p.NegozioProvenienza = s.Negozio AND ((vsp.prodotto = p.IDProdotto AND vsp.Sconto = s.IDSconto) OR (vsc.CategoriaApplicabile = p.Categoria AND vsc.IDSconto = s.IDSconto)) AND p.IDProdotto = sp.Prodotto AND CURRENT_DATE() >= s.DataInizio AND CURRENT_DATE() <= s.DataFine AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaTuttiProdottiScontatiFiltroCategoria:
 *  get:
 *      description: Ottiene tutti i Prodotti salvati nel sistema su cui vi è uno sconto e con una categoria specifica.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: query
 *         name: Categoria
 *         type: string
 *         description: Categoria interessata.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Prodotti con uno sconto valido associato e che appartengono alla Categoria desiderata.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiProdottiScontatiFiltroCategoria", (req, res) => {
    var Categoria = req.query.Categoria;
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, s.Valore AS Sconto, sp.Prezzo FROM prodotto p, sconto s, storicoprezzi sp, validita_sconto_prodotto vsp, validita_sconto_categoria vsc, negozio n WHERE p.NegozioProvenienza = s.Negozio AND ((vsp.prodotto = p.IDProdotto AND vsp.Sconto = s.IDSconto) OR (vsc.CategoriaApplicabile = p.Categoria AND vsc.IDSconto = s.IDSconto)) AND p.IDProdotto = sp.Prodotto AND CURRENT_DATE() >= s.DataInizio AND CURRENT_DATE() <= s.DataFine AND p.Categoria = '" + Categoria + "' AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaProdottiFiltroNome:
 *  get:
 *      description: Ottiene tutti i Prodotti salvati nel sistema con un nome specifico.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: query
 *         name: NomeProdotto
 *         type: string
 *         description: Nome del Prodotto interessato.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Prodotti con il nome desiderato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaProdottiFiltroNome", (req, res) => {
    var Nome = req.query.Nome;
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio AND p.Nome = '" + Nome + "' GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaProdottoFiltroID:
 *  get:
 *      description: Ottiene un Prodotto salvato nel sistema con un ID specifico.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: query
 *         name: IDProdotto
 *         type: int
 *         description: ID del Prodotto interessato.
 *      responses:
 *          200:
 *              description: OK. Si otiene correttamente il Prodotto con l'ID desiderato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaProdottoFiltroID", (req, res) => {
    var IDProdotto = req.query.IDProdotto;
    var sql = "SELECT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, n.IDNegozio, s2.Prezzo FROM prodotto p, storicoprezzi s2, negozio n WHERE p.IDProdotto = s2.Prodotto AND p.IDProdotto ='" + IDProdotto + "' AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(s2.Data)";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaProdottiFiltroNegozio:
 *  get:
 *      description: Ottiene tutti i Prodotti salvati nel sistema presenti in un determinato Negozio.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: query
 *         name: IDNegozio
 *         type: int
 *         description: ID del Negozio interessato.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Prodotti presenti nel Negozio desiderato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaProdottiFiltroNegozio", (req, res) => {
    var IDNegozio = req.query.IDNegozio;
    var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio AND p.NegozioProvenienza = '" + IDNegozio + "' GROUP BY p.IDProdotto HAVING MAX(sp.Data)"
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaProdottiFiltroCategoria:
 *  get:
 *      description: Ottiene tutti i Prodotti salvati nel sistema appartenenti ad una Determinata Categoria.
 *      tags: ["Prodotto"]
 *      parameters:
 *       - in: query
 *         name: Categoria
 *         type: string
 *         description: Categoria desiderata.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutti i Prodotti appartenenti alla Categoria desiderata.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaProdottiFiltroCategoria", (req, res) => {
    var Categoria = req.query.Categoria;
    var sql = "SELECT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, s2.Prezzo FROM prodotto p, storicoprezzi s2, negozio n WHERE p.IDProdotto = s2.Prodotto AND p.Categoria = '" + Categoria + "' AND p.NegozioProvenienza = n.IDNegozio GROUP BY p.IDProdotto HAVING MAX(s2.Data)"
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

//Utente

/**
 * @swagger
 * /api/eliminaUtente:
 *  delete:
 *      description: Elimina un Prodotto dal sistema.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente da eliminare.
 *      responses:
 *          204:
 *              description: NO CONTENT. Utente eliminato correttamente e nessun ritorno dall'API.
 *          303:
 *              description: SEE OTHER. Reindirizza l'utente ad un'altra pagina.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui l'Utente non venga eliminato da se stesso o da un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.delete("/api/eliminaUtente", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        sql = "DELETE FROM utente_registrato WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, 'back');
                return;
            }
            res.sendStatus(204);
            return;
        });
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/ripristinoPassword:
 *  get:
 *      description: Ripristina la password di un utente. Si tratta di un placeholder non implementato poiché richiede Auth0
 *      tags: ["Utente"]
 */
app.get("/api/ripristinoPassword", (req, res) => {
    //Usa GMail e Auth0
    res.sendStatus(200);
})

/**
 * @swagger
 * /api/attiva2AF:
 *  patch:
 *      description: Attiva la 2AF di un Utente. Si tratta di un placeholder non implementato completamente poiché richiede Auth0
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: Email
 *         type: string
 *         description: Email dell'Utente desiderato.
 *      responses:
 *          204:
 *              description: NO CONTENT. Attivazione avvenuta con successo e nessun ritorno dall'API.
 *          403:
 *              description: FORBIDDEN. Azione eseguita da un Utente diverso dall'Utente target o da un non Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.patch("/api/attiva2AF", (req, res) => {
    //Usa auth0
    var User = req.session.user;
    if(User == req.body.Username){
        var Username = req.body.Username;
        sql = "UPDATE utente_registrato SET 2AF_attiva = '" + 1 + "' WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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
        return;
    }
})

/**
 * @swagger
 * /api/modificaPassword:
 *  patch:
 *      description: Modifica la password di un Utente. Non è stata implementata completamente poiché richiede Auth0.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: PasswordVecchia
 *         type: string
 *         description: Vecchia Password dell'Utente desiderato.
 *       - in: query
 *         name: PasswordNuova
 *         type: string
 *         description: Nuova Password dell'Utente desiderato.
 *      responses:
 *          204:
 *              description: NO CONTENT. Modifica avvenuta correttamente e nessun ritorno dall'API.
 *          303:
 *              description: SEE OTHER. Reindirizza l'utente ad un'altra pagina.
 *          400:
 *              description: BAD REQUEST. Richiesta non valida.
 *          403:
 *              description: FORBIDDEN. Azione eseguita da un Utente diverso dall'Utente target o da un non Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.patch("/api/modificaPassword", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        var PasswordVecchia = req.body.PasswordVecchia;
        var PasswordNuova = req.body.Password;
        sql = "SELECT * FROM utente_registrato WHERE Password = '" + PasswordVecchia + "' AND Username = '" + Username + "'";
        con.query(sql, function(err, results){ // Controlla se la password vecchia corrisponde con quella nel database
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
            else if(results.length > 0){
                sql = "UPDATE utente_registrato SET Password = '" + PasswordNuova + "' WHERE Username = '" + Username + "'";
                con.query(sql, function(err, results){
                    /* istanbul ignore next */
                    if(err){
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    };
                    /* istanbul ignore next */
                    if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                        res.redirect(303, 'back');
                        return;
                    }
                    res.sendStatus(204);
                    return;
                });
            }
            else{
                res.sendStatus(400);
                return;
            }
        });
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/modificaEmail:
 *  patch:
 *      description: Modifica la mail di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: EmailNuova
 *         type: string
 *         description: Nuova Mail dell'Utente desiderato.
 *      responses:
 *          204:
 *              description: NO CONTENT. Modifica avvenuta correttamente e nessun ritorno dall'API.
 *          303:
 *              description: SEE OTHER. Utente rediretto ad un'altra pagina.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui l'Email dell'Utente non venga modificata da se stesso o da un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.patch("/api/modificaEmail", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        var EmailNuova = req.body.Email;
        sql = "UPDATE utente_registrato SET Email = '" + EmailNuova + "' WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, 'back');
                return;
            }
            res.sendStatus(204);
            return;
        });
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/modificaNumeroTelefono:
 *  patch:
 *      description: Modifica il numero di telefono di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: TelefonoNuovo
 *         type: string
 *         description: Nuovo Numero di Telefono dell'Utente desiderato.
 *      responses:
 *          204:
 *              description: NO CONTENT. Modifica avvenuta correttamente e nessun ritorno dall'API.
 *          303:
 *              description: SEE OTHER. Utente rediretto ad un'altra pagina.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui il numero di telefono dell'Utente non venga modificata da se stesso o da un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.patch("/api/modificaNumeroTelefono", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        var TelefonoNuovo = req.body.Telefono;
        sql = "UPDATE utente_registrato SET Telefono = '" + TelefonoNuovo + "' WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, 'back');
                return;
            }
            res.sendStatus(204);
            return;
        });
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/modificaFotoProfilo:
 *  patch:
 *      description: Modifica la foto profilo di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: FotoProfilo
 *         type: string
 *         description: Nuova Foto Prodilo dell'Utente desiderato sotto forma di URL.
 *      responses:
 *          204:
 *              description: NO CONTENT. Modifica avvenuta correttamente e nessun ritorno dall'API.
 *          303:
 *              description: SEE OTHER. Utente rediretto ad un'altra pagina.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui la foto profilo dell'Utente non venga modificata da se stesso o da un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.patch("/api/modificaFotoProfilo", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || User == req.body.Username){
        var Username = req.body.Username;
        var FotoProfilo = req.body.FotoProfilo;
        sql = "UPDATE utente_registrato SET FotoProfilo = '" + FotoProfilo + "' WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect(303, 'back');
                return;
            }
            res.sendStatus(204);
            return;
        });
    }
    else{
        res.sendStatus(403);
    }
})

/**
 * @swagger
 * /api/aggiungiProdottoAiPreferiti:
 *  post:
 *      description: Aggiunge un Prodotto alla Lista Preferiti di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: IDProdotto
 *         type: int
 *         description: ID del Prodotto da aggiungere ai preferiti.
 *      responses:
 *          204:
 *              description: NO CONTENT. Aggiunta avvenuta correttamente e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore inviato nel caso in cui l'ID del Prodotto da aggiungere non sia valido.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui un Utente non loggato (con username null) provi a inserire un prodotto come preferito.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.post("/api/aggiungiProdottoAiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDProdotto = req.body.IDProdotto;
    if(Username == undefined){
        res.sendStatus(403);
        return;
    }
    if(IDProdotto == undefined){
        res.sendStatus(400);
        return;
    }
    var sql = "INSERT INTO prodottipreferiti (Prodotto, Utente) VALUES ('" + IDProdotto + "', '" + Username + "')";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.sendStatus(204);
        return;
    })
})

/**
 * @swagger
 * /api/rimuoviProdottoDaiPreferiti:
 *  delete:
 *      description: Rimuove un Prodotto dalla Lista Preferiti di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: IDProdotto
 *         type: int
 *         description: ID del Prodotto da rimuovere dai preferiti.
 *      responses:
 *          204:
 *              description: NO CONTENT. Rimozione avvenuta correttamente e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore inviato nel caso in cui l'ID del Prodotto da rimuovere non sia valido.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui un Utente non loggato (con username null) provi a rimuovere un prodotto dai preferiti.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.delete("/api/rimuoviProdottoDaiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDProdotto = req.body.IDProdotto;
    if(Username == undefined){
        res.sendStatus(403);
        return;
    }
    if(IDProdotto == undefined){
        res.sendStatus(400);
        return;
    }
    var sql = "DELETE FROM prodottipreferiti WHERE Prodotto = '" + IDProdotto + "' AND Utente = '" + Username + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.sendStatus(204);
        return;
    })
})

/**
 * @swagger
 * /api/aggiungiNegozioAiPreferiti:
 *  post:
 *      description: Aggiunge un Negozio alla Lista Preferiti di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: IDNegozio
 *         type: int
 *         description: ID del Negozio da aggiungere ai preferiti.
 *      responses:
 *          204:
 *              description: NO CONTENT. Aggiunta avvenuta correttamente e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore inviato nel caso in cui l'ID del Negozio da aggiungere non sia valido.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui un Utente non loggato (con username null) provi a inserire un Negozio come preferito.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.post("/api/aggiungiNegozioAiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDNegozio = req.body.IDNegozio;
    if(Username == undefined){
        res.sendStatus(403);
        return;
    }
    if(IDNegozio == undefined){
        res.sendStatus(400);
        return;
    }
    var sql = "INSERT INTO negozipreferiti (Negozio, Utente) VALUES ('" + IDNegozio + "', '" + Username + "')";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.sendStatus(204);
        return;
    })
})

/**
 * @swagger
 * /api/rimuoviNegozioDaiPreferiti:
 *  delete:
 *      description: Rimuove un Negozio dalla Lista Preferiti di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: IDNegozio
 *         type: int
 *         description: ID del Negozio da rimuovere dai preferiti.
 *      responses:
 *          204:
 *              description: NO CONTENT. Aggiunta avvenuta correttamente e nessun ritorno dall'API.
 *          400:
 *              description: BAD REQUEST. Errore inviato nel caso in cui l'ID del Negozio da rimuovere non sia valido.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui un Utente non loggato (con username null) provi a rimuovere un Negozio dai preferiti.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.delete("/api/rimuoviNegozioDaiPreferiti", (req, res) => {
    var Username = req.session.user;
    var IDNegozio = req.body.IDNegozio;
    if(Username == undefined){
        res.sendStatus(403);
        return;
    }
    if(IDNegozio == undefined){
        res.sendStatus(400);
        return;
    }
    var sql = "DELETE FROM negozipreferiti WHERE Negozio = '" + IDNegozio + "' AND Utente = '" + Username + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.sendStatus(204);
        return;
    })
})

/**
 * @swagger
 * /api/ottieniDatiUtente:
 *  get:
 *      description: Ottiene i dati di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *      responses:
 *          200:
 *              description: OK. Dati ottenuti con successo.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui i dati dell'Utente non vengano richiesti dall'Utente stesso o da un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/ottieniDatiUtente", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin || req.query.Username == User){
        var Username = req.query.Username;
        sql = "SELECT Username, FotoProfilo, 2AF_attiva AS TFA_attiva, Email, Bloccato, Telefono, Password, isAdmin FROM utente_registrato WHERE Username = '" + Username + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.json(results);
            return;
        });
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/trovaTuttiUtenti:
 *  get:
 *      description: Ottiene tutti gli Utenti salvati nel sistema.
 *      tags: ["Utente"]
 *      responses:
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui chi chiede i dati non è un Amministratore.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTuttiUtenti", (req, res) => {
    var User = req.session.user;
    if(req.session.isAdmin){
        sql = "SELECT Username, FotoProfilo, 2AF_attiva AS TFA_attiva, Email, Bloccato, Telefono, Password, isAdmin FROM utente_registrato";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.json(results);
            return;
        });
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/ottieniProdottiPreferiti:
 *  get:
 *      description: Ottiene i Prodotti preferiti di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente i Prodotti preferiti dell'Utente desiderato.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui i prodotti preferiti vengano richiesti da un utente non registrato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/ottieniProdottiPreferiti", (req, res) => {
    if(req.session.user != null){
        var user = req.session.user;
        var sql = "SELECT DISTINCT p.Nome, p.Immagine, p.Categoria, p.IDProdotto, n.Nome as Negozio, sp.Prezzo  FROM prodotto p, storicoprezzi sp, negozio n, prodottipreferiti pp WHERE p.IDProdotto = sp.Prodotto AND p.NegozioProvenienza = n.IDNegozio AND p.IDProdotto = pp.Prodotto AND pp.Utente = '" + user + "' GROUP BY p.IDProdotto HAVING MAX(sp.Data)";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.json(results);
            return;
        })
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/checkProdottoPreferito:
 *  get:
 *      description: Controlla se un Prodotto è nei preferiti di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: Prodotto
 *         type: int
 *         description: ID del Prodotto desiderato.
 *      responses:
 *          200:
 *              description: OK. Il sistema riferisci se il Prodotto è nei preferiti dell'Utente oppure no.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui chi inviata la richiesta non è un Utente loggato (con username null).
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/checkProdottoPreferito", (req, res) => {
    if(req.session.user != null){
        var Username = req.session.user;
        var Prodotto = req.query.IDProdotto;
        var sql = "SELECT * FROM prodottipreferiti WHERE Utente = '" + Username + "' AND Prodotto = '" + Prodotto + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.json(results);
            return;
        })
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/ottieniNegoziPreferiti:
 *  get:
 *      description: Ottiene i Negozi preferiti di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente i Negozi preferiti dell'Utente desiderato.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui i negozi preferiti vengano richiesti da un utente non registrato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/ottieniNegoziPreferiti", (req, res) => {
    if(req.session.user != null){
        var user = req.session.user;
        var sql = "SELECT * FROM negozio n, negozipreferiti np WHERE n.IDNegozio = np.Negozio AND np.Utente = '" + user + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(200);
            res.json(results);
            return;
        })
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/checkNegozioPreferito:
 *  get:
 *      description: Controlla se un Negozio è nei preferiti di un Utente.
 *      tags: ["Utente"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente desiderato.
 *       - in: query
 *         name: Negozio
 *         type: int
 *         description: ID del Negozio desiderato.
 *      responses:
 *          200:
 *              description: OK. Il sistema riferisci se il Negozio è nei preferiti dell'Utente oppure no.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui chi inviata la richiesta non è un Utente loggato (con username null).
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/checkNegozioPreferito", (req, res) => {
    if(req.session.user != null){
        var Username = req.session.user;
        var Negozio = req.query.IDNegozio;
        var sql = "SELECT * FROM negozipreferiti WHERE Utente = '" + Username + "' AND Negozio = '" + Negozio + "'";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
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
        res.sendStatus(403);
        return;
    }
})

//Recensione

/**
 * @swagger
 * /api/salvaRecensione:
 *  post:
 *      description: Aggungi una nuova Recensione al sistema.
 *      tags: ["Recensione"]
 *      parameters:
 *       - in: body
 *         name: Dati della Recensione
 *         description: Dati dello Recensione da salvare.
 *         schema:
 *           type: object
 *           properties:
 *              Username:
 *                  type: string
 *                  description: Username dell'Utente che fa la Recensione
 *                  example: Pippo
 *              Titolo:
 *                  type: string
 *                  description: Titolo della Recensione
 *                  example: Incredibile
 *              N_stelle:
 *                  type: integer
 *                  description: Numero di stelle della Recensione
 *                  example: 5
 *              Testo:
 *                  type: string
 *                  description: Testo della Recensione
 *                  example: Super duper bellissimo Negozio
 *              Negozio:
 *                  type: int
 *                  description: ID del Negozio a cui si riferisce la Recensione
 *                  example: 1
 *      responses:
 *          201:
 *              description: CREATED. Recensione creata correttamente e salvato.
 *          400:
 *              description: BAD REQUEST. Dati inseriti non validi.
 *          403:
 *              description: FORBIDDEN. Errore inviato nel caso in cui chi inviata la richiesta non è un Utente loggato (con username null).
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */

//Aggiungi tu i codici d'errore per questa?
app.post("/api/salvaRecensione", (req, res) => {
    if(req.session.user != null){
        var Username = req.session.user;
        var Titolo = req.body.Titolo;
        var N_stelle = req.body.Stelle;
        var Testo = req.body.Testo;
        var Negozio = req.body.IDNegozio;
        if(N_stelle < 1 || N_stelle > 5){
            res.sendStatus(400);
            return;
        }
        var sql = "INSERT INTO recensione (Titolo, Testo, N_stelle, Utente, Negozio) VALUES ('" + Titolo + "', '" + Testo + "', '" + N_stelle + "','" + Username + "','" + Negozio + "')";
        con.query(sql, function(err, results){
            /* istanbul ignore next */
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            };
            res.status(201);
            /* istanbul ignore next */
            if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                res.redirect('back');
                return;
            }
            res.json(results);
            return;
        })
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/eliminaRecensione:
 *  delete:
 *      description: Elimina una Recensione dal sistema.
 *      tags: ["Recensione"]
 *      parameters:
 *       - in: query
 *         name: Usernarme
 *         type: string
 *         description: Username dell'Utente che vuole eseguire l'azione.
 *       - in: query
 *         name: IDRecensione
 *         type: int
 *         description: ID della Recensione da eliminare.
 *      responses:
 *          204:
 *              description: NO CONTENT. Recensione eliminata correttamente e nessun ritorno dall'API.
 *          303:
 *              description: SEE OTHER. Reindirizza l'utente ad un'altra pagina.
 *          400:
 *              description: BAD REQUEST. Errore nel caso in cui i dati non siano validi.
 *          403:
 *              description: FORBIDDEN. Errore nel caso in cui un Utente non registrato provi ad eliminare un Recensione o se un Utente diverso dal creatore della Recensioni o un Amministratore provi ad eliminare la Recensione.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */ 

app.delete("/api/eliminaRecensione", (req, res) => {
    if(req.session.user != null){
        var User = req.session.user;
        if(req.session.isAdmin || User == req.body.Username){
            var IDRecensione = req.body.IDRecensione;
            if(IDRecensione == undefined){
                res.sendStatus(400);
                return;
            }
            var sql = "DELETE FROM recensione WHERE IDRecensione = '" + IDRecensione + "'";
            con.query(sql, function(err, results){
                /* istanbul ignore next */
                if(err){
                    console.log(err);
                    res.sendStatus(500);
                    return;
                };
                /* istanbul ignore next */
                if(req.headers.accept != undefined && req.headers.accept.includes("text/html")){
                    res.redirect(303, 'back');
                    return;
                }
                res.status(204);
                res.json(results);
                return;
            })
        }
        else{
            res.sendStatus(403);
            return;
        }
    }
    else{
        res.sendStatus(403);
        return;
    }
})

/**
 * @swagger
 * /api/trovaRecensioniFiltroUtente:
 *  get:
 *      description: Ottiene tutte le Recensione salvati nel sistema effettuate da un Utente specifico.
 *      tags: ["Recensione"]
 *      parameters:
 *       - in: query
 *         name: Username
 *         type: string
 *         description: Username dell'Utente interessato.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutte le Recensioni effettuate dall'Utente interessato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaRecensioniFiltroUtente", (req, res) => {
    var Username = req.query.Username;
    sql = "SELECT r.Titolo, r.Testo, r.N_stelle, r.Data_creazione, r.Utente AS Nome, r.IDRecensione, u.FotoProfilo, n.Nome, n.IDNegozio as Negozio FROM recensione r, utente_registrato u, negozio n WHERE r.Negozio = n.IDNegozio AND r.Utente = u.Username AND r.Utente = '" + Username + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/trovaRecensioniFiltroNegozio:
 *  get:
 *      description: Ottiene tutte le Recensione salvati nel sistema riferite ad un determinato Negozio.
 *      tags: ["Recensione"]
 *      parameters:
 *       - in: query
 *         name: Negozio
 *         type: integer
 *         description: ID del Negozio interessato.
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutte le Recensioni riferite al Negozio interessato.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaRecensioniFiltroNegozio", (req, res) => {
    var Negozio = req.query.IDNegozio;
    sql = "SELECT r.Titolo, r.Testo, r.N_stelle, r.Data_creazione, r.Utente AS Nome, r.IDRecensione, u.FotoProfilo, n.Nome AS Negozio, n.IDNegozio FROM recensione r, utente_registrato u, negozio n WHERE r.Negozio = n.IDNegozio AND r.Utente = u.Username AND r.Negozio = '" + Negozio + "'";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
        if(err){
            console.log(err);
            res.sendStatus(500);
            return;
        };
        res.json(results);
        return;
    });
})

/**
 * @swagger
 * /api/trovaTutteRecensioni:
 *  get:
 *      description: Ottiene tutte le Recensione salvati nel sistema.
 *      tags: ["Recensione"]
 *      responses:
 *          200:
 *              description: OK. Si ottengono correttamente tutte le Recensioni presenti nel sistema.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/trovaTutteRecensioni", (req, res) => {
    var sql = "SELECT r.Titolo, r.Testo, r.N_stelle, r.Data_creazione, r.Utente AS Nome, r.IDRecensione, u.FotoProfilo, n.Nome AS Negozio, n.IDNegozio FROM recensione r, utente_registrato u, negozio n WHERE r.Negozio = n.IDNegozio AND r.Utente = u.Username";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/**
 * @swagger
 * /api/inviaMail:
 *  get:
 *      description: Usata per inviare Mail agli Utenti. Non pienamente implementata.
 *      tags: ["GMail"]
 *      parameters:
 *       - in: body
 *         name: Dati Email
 *         description: Dati dell'EMail da inviare.
 *         schema:
 *           type: object
 *           properties:
 *              Destinatario:
 *                  type: string
 *                  description: Destinatario della Mail.
 *                  example: xyz@xyz.com
 *              Oggetto:
 *                  type: string
 *                  description: Oggetto della Mail da inviare.
 *                  example: Notifica tristezza
 *              Corpo:
 *                  type: string
 *                  description: Corpo della Mail
 *                  example: Ti avvisiamo che c'è tristezza nell'aria.
 *      responses:
 *          204:
 *              description: OK. Email correttamente inviata all'indirizzo specificato e nessun ritorno dalla API.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/inviaMail", (req, res) => {
    //GMail API
    res.sendStatus(200);
})

//Categoria

/**
 * @swagger
 * /api/categorie:
 *  get:
 *      description: Usata per ottenere tutte le Categorie.
 *      tags: ["Categoria"]
 *      responses:
 *          200:
 *              description: OK. Ottiene tutte le Categorie.
 *          500:
 *              description: SERVER ERROR. Di varia natura.
 */
app.get("/api/categorie", (req, res) => {
    sql = "SELECT * FROM categoria";
    con.query(sql, function(err, results){
        /* istanbul ignore next */
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

/* istanbul ignore next */
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