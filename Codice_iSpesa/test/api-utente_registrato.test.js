const request = require('supertest');
const main = require("../main.js");
const session = require('supertest-session');
const port = process.env.PORT || 8080;

let server;
var testSession = null;

beforeAll( async () => {
    jest.setTimeout(20000)
    server = main.app.listen(port);
})

afterAll(() => {
    main.closeDB();
    server.close();
})

describe('Suite testing API utente_registrato', () => {

    const inputBody = {
        Username : "test_user",
        Password : "5423543",
        Email : "testemail@test.it",
        Telefono : "1234567890",
    }

    var Username = inputBody.Username;
    var PasswordVecchia = inputBody.Password;
    var PasswordNuova = "password_nuova_test";
    var TelefonoNuovo = "0987654321";
    var FotoProfiloNuova = "/nuova_foto_profilo_test.png";
    var MailNuova = "mailnuova@test.it";

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API POST '/registrati' con utente non admin", async () => {
        const response = await testSession.post("/registrati").send(inputBody);
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata all'API POST '/registrati' con utente già registrato", async () => {
        const response = await testSession.post("/registrati").send(inputBody);
        expect(response.statusCode).toEqual(303);
    })

    // Vari test senza login

    test("Chiamata all'API POST '/api/aggiungiNegozioAiPreferiti' senza login", async () => {
        var IDNegozio = { IDNegozio : "1"};
        const response = await testSession.post("/api/aggiungiNegozioAiPreferiti").send(IDNegozio);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API DELETE '/api/rimuoviNegozioDaiPreferiti' senza login", async () => {
        var IDNegozio = { IDNegozio : "1"};
        const response = await testSession.post("/api/rimuoviNegozioDaiPreferiti?_method=DELETE").send(IDNegozio);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API POST '/api/aggiungiProdottoAiPreferiti' senza login", async () => {
        var IDProdotto = { IDProdotto : "2"};
        const response = await testSession.post("/api/aggiungiProdottoAiPreferiti").send(IDProdotto);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API DELETE '/api/rimuoviProdottoDaiPreferiti' senza login", async () => {
        var IDProdotto = { IDProdotto : "2"};
        const response = await testSession.post("/api/rimuoviProdottoDaiPreferiti?_method=DELETE").send(IDProdotto);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API PATCH '/api/modificaPassword' senza login", async () => {
        const inputBody = {
            Username: Username,
            PasswordVecchia: PasswordVecchia,
            Password: PasswordNuova,
        }
        const response = await testSession.post("/api/modificaPassword?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API PATCH '/api/modificaNumeroTelefono' senza login", async () => {
        const inputBody = {
            Username: Username,
            Telefono: TelefonoNuovo,
        }
        const response = await testSession.post("/api/modificaNumeroTelefono?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API PATCH '/api/modificaFotoProfilo' senza login", async () => {
        const inputBody = {
            Username: Username,
            FotoProfilo: FotoProfiloNuova,
        }
        const response = await testSession.post("/api/modificaFotoProfilo?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API PATCH '/api/modificaEmail' senza login", async () => {
        const inputBody = {
            Username: Username,
            Email: MailNuova,
        }
        const response = await testSession.post("/api/modificaEmail?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API POST '/login' con utente non admin e credenziali errate", async () => {
        inputBody.Password = "password_errata";
        const response = await testSession.post("/login").send(inputBody);
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata all'API DELETE '/api/eliminaUtente' senza login", async () => {
        const response = await testSession.post("/api/eliminaUtente?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API PATCH '/api/attiva2AF' con utente estraneo", async () => {
        const inputBody = {
            Username: "utente_test_estraneo",
        }
        const response = await testSession.post("/api/attiva2AF?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API GET '/api/ottieniDatiUtente' senza login", async () => {
        const response = await testSession.get("/api/ottieniDatiUtente?Username="+inputBody.Username);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API GET '/api/ottieniProdottiPreferiti' senza login", async () => {
        const response = await testSession.get("/api/ottieniProdottiPreferiti");
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API GET '/api/ottieniNegoziPreferiti' senza login", async () => {
        const response = await testSession.get("/api/ottieniNegoziPreferiti");
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API GET '/api/checkProdottoPreferito' senza login", async () => {
        const IDProdotto = "2";
        const response = await testSession.get("/api/checkProdottoPreferito?IDProdotto="+IDProdotto);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API GET '/api/checkNegozioPreferito' senza login", async () => {
        const IDNegozio = "1";
        const response = await testSession.get("/api/checkNegozioPreferito?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API DELETE '/api/eliminaRecensione' senza login", async () => {
        const response = await testSession.post("/api/eliminaRecensione?_method=DELETE");
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API GET '/api/trovaRecensioniFiltroUtente' senza login", async () => {
        const response = await testSession.get("/api/trovaRecensioniFiltroUtente?Username="+inputBody.Username);
        expect(response.statusCode).toEqual(200);
    })

    // Test post-login

    test("Chiamata all'API POST '/login' con utente non admin", async () => {
        inputBody.Password = "5423543"
        const response = await testSession.post("/login").send(inputBody);
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata all'API GET '/api/ottieniDatiUtente'", async () => {
        const response = await testSession.get("/api/ottieniDatiUtente?Username="+inputBody.Username);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiUtenti' con utente non admin", async () => {
        const response = await testSession.get("/api/trovaTuttiUtenti");
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API POST '/api/aggiungiProdottoAiPreferiti' senza IDProdotto", async () => {
        const response = await testSession.post("/api/aggiungiProdottoAiPreferiti");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API POST '/api/aggiungiProdottoAiPreferiti'", async () => {
        var IDProdotto = { IDProdotto : "2"};
        const response = await testSession.post("/api/aggiungiProdottoAiPreferiti").send(IDProdotto);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API POST '/api/aggiungiNegozioAiPreferiti' senza IDNegozio", async () => {
        const response = await testSession.post("/api/aggiungiNegozioAiPreferiti");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API POST '/api/aggiungiNegozioAiPreferiti'", async () => {
        var IDNegozio = { IDNegozio : "1"};
        const response = await testSession.post("/api/aggiungiNegozioAiPreferiti").send(IDNegozio);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API GET '/api/ottieniProdottiPreferiti'", async () => {
        const response = await testSession.get("/api/ottieniProdottiPreferiti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/ottieniNegoziPreferiti'", async () => {
        const response = await testSession.get("/api/ottieniNegoziPreferiti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/checkProdottoPreferito'", async () => {
        const IDProdotto = "2";
        const response = await testSession.get("/api/checkProdottoPreferito?IDProdotto="+IDProdotto);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/checkNegozioPreferito'", async () => {
        const IDNegozio = "1";
        const response = await testSession.get("/api/checkNegozioPreferito?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API DELETE '/api/rimuoviProdottoDaiPreferiti' senza IDProdotto", async () => {
        const response = await testSession.post("/api/rimuoviProdottoDaiPreferiti?_method=DELETE");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API DELETE '/api/rimuoviProdottoDaiPreferiti'", async () => {
        var IDProdotto = { IDProdotto : "2"};
        const response = await testSession.post("/api/rimuoviProdottoDaiPreferiti?_method=DELETE").send(IDProdotto);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API DELETE '/api/rimuoviNegozioDaiPreferiti' senza IDNegozio", async () => {
        const response = await testSession.post("/api/rimuoviNegozioDaiPreferiti?_method=DELETE");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API DELETE '/api/rimuoviNegozioDaiPreferiti'", async () => {
        var IDNegozio = { IDNegozio : "1"};
        const response = await testSession.post("/api/rimuoviNegozioDaiPreferiti?_method=DELETE").send(IDNegozio);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API GET '/api/ripristinoPassword'", async () => {
        const response = await testSession.get("/api/ripristinoPassword");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API PATCH '/api/attiva2AF'", async () => {
        const inputBody = {
            Username: Username,
        }
        const response = await testSession.post("/api/attiva2AF?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API PATCH '/api/modificaPassword'", async () => {
        const inputBody = {
            Username: Username,
            PasswordVecchia: PasswordVecchia,
            Password: PasswordNuova,
        }
        const response = await testSession.post("/api/modificaPassword?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API PATCH '/api/modificaNumeroTelefono'", async () => {
        const inputBody = {
            Username: Username,
            Telefono: TelefonoNuovo,
        }
        const response = await testSession.post("/api/modificaNumeroTelefono?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API PATCH '/api/modificaFotoProfilo'", async () => {
        const inputBody = {
            Username: Username,
            FotoProfilo: FotoProfiloNuova,
        }
        const response = await testSession.post("/api/modificaFotoProfilo?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API PATCH '/api/modificaEmail'", async () => {
        const inputBody = {
            Username: Username,
            Email: MailNuova,
        }
        const response = await testSession.post("/api/modificaEmail?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    // Test sulle recensioni

    var IDRecensione;
    it("Creo una recensione su cui testare", async () => {
        const inputBody = {
            Titolo: "Titolo Test",
            Testo: "Testo test",
            Stelle: "5",
            Data_creazione: "1970-01-01",
            Utente: "test_user",
            IDNegozio: "1",
            IDRecensione: "",
        }
        const response = await testSession.post("/api/salvaRecensione").send(inputBody);
        expect(response.statusCode).toEqual(201);
        IDRecensione = response.body.insertId;
    })

    test("Chiamata all'API GET '/api/trovaRecensioniFiltroUtente'", async () => {
        const response = await testSession.get("/api/trovaRecensioniFiltroUtente?Username="+inputBody.Username);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API DELETE '/api/eliminaRecensione' senza IDRecensione", async () => {
        const inputBody = {
            Titolo: "Titolo Test",
            Testo: "Testo test",
            Stelle: "5",
            Data_creazione: "1970-01-01",
            Username: "test_user",
            IDNegozio: "1",
        }
        const response = await testSession.post("/api/eliminaRecensione?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API DELETE '/api/eliminaRecensione' di un altro utente", async () => {
        const inputBody = {
            Titolo: "Titolo Test",
            Testo: "Testo test",
            Stelle: "5",
            Data_creazione: "1970-01-01",
            Username: "test_user_sbagliato",
            IDNegozio: "1",
        }
        const response = await testSession.post("/api/eliminaRecensione?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API DELETE '/api/eliminaRecensione'", async () => {
        const inputBody = {
            Titolo: "Titolo Test",
            Testo: "Testo test",
            Stelle: "5",
            Data_creazione: "1970-01-01",
            Username: "test_user",
            IDNegozio: "1",
            IDRecensione: IDRecensione,
        }
        const response = await testSession.post("/api/eliminaRecensione?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API DELETE '/api/eliminaUtente'", async () => {
        const response = await testSession.post("/api/eliminaUtente?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
})