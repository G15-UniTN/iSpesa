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

describe('Suite testing API recensione', () => {

    const inputBody = {
        Titolo: "Titolo Test",
        Testo: "Testo test",
        Stelle: "",
        Data_creazione: "1970-01-01",
        Username: "root",
        IDNegozio: "1",
        IDRecensione: "",
    }

    const adminUser = {
        Username : "root",
        Password : "",
    }

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API POST '/api/salvaRecensione' da un utente non loggato", async () => {
        const response = await testSession.post("/api/salvaRecensione").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    it('should authenticate as admin', async () => {
        await testSession.post("/login").send(adminUser).expect(303); //Logs as admin
    })

    test("Chiamata all'API POST '/api/salvaRecensione' con recensione errata (numero di stelle = -1)", async () => {
        inputBody.Stelle = "-1";
        const response = await testSession.post("/api/salvaRecensione").send(inputBody);
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API POST '/api/salvaRecensione'", async () => {
        inputBody.Stelle = "1";
        const response = await testSession.post("/api/salvaRecensione").send(inputBody);
        expect(response.statusCode).toEqual(201);
        inputBody.IDRecensione = response.body.insertId;
    })

    test("Chiamata all'API GET '/api/trovaTutteRecensioni'", async () => {
        const response = await testSession.get("/api/trovaTutteRecensioni");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaRecensioniFiltroNegozio'", async () => {
        const IDNegozio = inputBody.IDNegozio;
        const response = await testSession.get("/api/trovaRecensioniFiltroNegozio?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaRecensioniFiltroUtente'", async () => {
        const Username = inputBody.Utente;
        const response = await testSession.get("/api/trovaNegozioFiltroID?Username="+Username);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API DELETE '/api/eliminaRecensione' senza dati", async () => {
        const response = await testSession.post("/api/eliminaRecensione?_method=DELETE");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API DELETE '/api/eliminaRecensione'", async () => {
        const response = await testSession.post("/api/eliminaRecensione?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
})