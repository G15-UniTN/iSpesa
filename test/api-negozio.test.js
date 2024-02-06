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

describe('Suite testing API negozio', () => {

    const inputBody = {
        Ubicazione : "Trento",
        Orari : "10:00-19:00",
        Nome : "NegozioTest",
        Logo : "/immagine_test.png",
        IDNegozio : "",
    }

    const adminUser = {
        Username : "root",
        Password : "",
    }

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API POST '/api/salvaNegozio' da un utente non admin", async () => {
        const response = await testSession.post("/api/salvaNegozio").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API PATCH '/api/modificaUbicazione' da un utente non admin", async () => {
        inputBody.Ubicazione = "Ubicazione_test";
        const response = await testSession.post("/api/modificaUbicazione?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API PATCH '/api/modificaOrario' da un utente non admin", async () => {
        inputBody.Orari = "Ubicazione_test";
        const response = await testSession.post("/api/modificaOrari?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API DELETE '/api/eliminaNegozio' da un utente non admin", async () => {
        const response = await testSession.post("/api/eliminaNegozio?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    it('should authenticate as admin', async () => {
        await testSession.post("/login").send(adminUser).expect(303); //Logs as admin
    })

    test("Chiamata all'API POST '/api/salvaNegozio' senza dati", async () => {
        const response = await testSession.post("/api/salvaNegozio");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API POST '/api/salvaNegozio'", async () => {
        const response = await testSession.post("/api/salvaNegozio").send(inputBody);
        expect(response.statusCode).toEqual(201);
        inputBody.IDNegozio = response.body.insertId;
    })

    test("Chiamata all'API GET '/api/trovaTuttiNegozi'", async () => {
        const response = await testSession.get("/api/trovaTuttiNegozi");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiNegoziFiltroNome'", async () => {
        const Nome = inputBody.Nome;
        const response = await testSession.get("/api/trovaTuttiNegoziFiltroNome?Nome="+Nome);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiNegoziFiltroID'", async () => {
        const IDNegozio = inputBody.IDNegozio;
        const response = await testSession.get("/api/trovaNegozioFiltroID?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiNegoziFiltroUbicazione'", async () => {
        const Ubicazione = inputBody.Ubicazione;
        const response = await testSession.get("/api/trovaTuttiNegoziFiltroUbicazione?Ubicazione="+Ubicazione);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API PATCH '/api/modificaUbicazione' senza dati", async () => {
        const response = await testSession.post("/api/modificaUbicazione?_method=PATCH");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API PATCH '/api/modificaUbicazione'", async () => {
        inputBody.Ubicazione = "Ubicazione_test";
        const response = await testSession.post("/api/modificaUbicazione?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API PATCH '/api/modificaOrario' senza dati", async () => {
        const response = await testSession.post("/api/modificaOrari?_method=PATCH");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API PATCH '/api/modificaOrario'", async () => {
        inputBody.Orari = "Ubicazione_test";
        const response = await testSession.post("/api/modificaOrari?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API DELETE '/api/eliminaNegozio' senza dati", async () => {
        const response = await testSession.post("/api/eliminaNegozio?_method=DELETE");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API DELETE '/api/eliminaNegozio'", async () => {
        const response = await testSession.post("/api/eliminaNegozio?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
})