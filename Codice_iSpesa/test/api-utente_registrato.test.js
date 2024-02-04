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
        Password : "test_password",
        Email : "testemail@test.it",
        Telefono : "1234567890",
    }

    const adminUser = {
        Username : "root",
        Password : "",
    }

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API POST '/registrati' con utente non admin", async () => {
        const response = await testSession.post("/registrati").send(inputBody);
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata all'API POST '/login' con utente non admin", async () => {
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

    test("Chiamata all'API POST '/api/aggiungiProdottoAiPreferiti'", async () => {
        var IDProdotto = "2";
        const response = await testSession.post("/api/aggiungiProdottoAiPreferiti?IDProdotto="+IDProdotto);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API POST '/api/aggiungiNegozioAiPreferiti'", async () => {
        var IDNegozio = "1";
        const response = await testSession.post("/api/aggiungiNegozioAiPreferiti?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API GET '/api/ottieniProdottiPreferiti'", async () => {
        const response = await testSession.get("/api/ottieniProdottiPreferiti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/checkProdottoPreferito'", async () => {
        const IDProdotto = "2";
        const response = await testSession.get("/api/trovaScontiConProdottoFiltroNegozio?IDProdotto="+IDProdotto);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/checkNegozioPreferito'", async () => {
        const IDNegozio = "1";
        const response = await testSession.get("/api/checkNegozioPreferito?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API POST '/api/rimuoviProdottoDaiPreferiti'", async () => {
        var IDProdotto = "2";
        const response = await testSession.post("/api/rimuoviProdottoDaiPreferiti?IDProdotto="+IDProdotto);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API POST '/api/rimuoviNegozioDaiPreferiti'", async () => {
        var IDNegozio = "1";
        const response = await testSession.post("/api/rimuoviNegozioDaiPreferiti?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API GET '/api/ripristinoPassword'", async () => {
        const response = await testSession.get("/api/ripristinoPassword");
        expect(response.statusCode).toEqual(200);
    })

    var Username = inputBody.Username;
    var PasswordVecchia = inputBody.Password;
    var PasswordNuova = "password_nuova_test";
    test("Chiamata all'API PATCH '/api/modificaPassword'", async () => {
        const inputBody = {
            Username: Username,
            PasswordVecchia: PasswordVecchia,
            PasswordNuova: PasswordNuova,
        }
        const response = await testSession.post("/api/modificaPassword?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    var TelefonoNuovo = "0987654321";
    test("Chiamata all'API PATCH '/api/modificaNumeroTelefono'", async () => {
        const inputBody = {
            Username: Username,
            Telefono: TelefonoNuovo,
        }
        const response = await testSession.post("/api/modificaNumeroTelefono?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    var FotoProfiloNuova = "/nuova_foto_profilo_test.png";
    test("Chiamata all'API PATCH '/api/modificaFotoProfilo'", async () => {
        const inputBody = {
            Username: Username,
            FotoProfilo: FotoProfiloNuova,
        }
        const response = await testSession.post("/api/modificaFotoProfilo?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    var MailNuova = "mailnuova@test.it";
    test("Chiamata all'API PATCH '/api/modificaEmail'", async () => {
        const inputBody = {
            Username: Username,
            Email: MailNuova,
        }
        const response = await testSession.post("/api/modificaEmail?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API DELETE '/api/eliminaUtente'", async () => {
        const response = await testSession.post("/api/eliminaSconto?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
})