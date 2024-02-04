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

describe('Suite testing API negozi', () => {

    const inputBody = {
        Valore: "10",
        Negozio: "1",
        DataInizio: "1970-01-01",
        DataFine: "1980-01-01",
        IDSconto: "",
    }

    const adminUser = {
        username : "root",
        password : "",
    }

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API POST '/api/salvaSconto' da un utente non admin", async () => {
        const response = await testSession.post("/api/salvaSconto").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    it('should authenticate as admin', async () => {
        await testSession.post("/login").send(adminUser).expect(200); //Logs as admin
    })

    test("Chiamata all'API POST '/api/salvaSconto'", async () => {
        const response = await testSession.post("/api/salvaSconto").send(inputBody);
        expect(response.statusCode).toEqual(201);
        inputBody.IDSconto = response.body.insertId;
    })

    test("Chiamata all'API GET '/api/trovaTuttiSconti'", async () => {
        const response = await testSession.get("/api/trovaTuttiSconti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiSconti'", async () => {
        const response = await testSession.get("/api/trovaTuttiSconti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiScontiConProdotto'", async () => {
        const response = await testSession.get("/api/trovaTuttiScontiConProdotto");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiScontiConCategoria'", async () => {
        const response = await testSession.get("/api/trovaTuttiScontiConProdotto");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiScontiConProdottoFiltroNegozio'", async () => {
        const IDNegozio = "1";
        const response = await testSession.get("/api/trovaTuttiScontiConProdottoFiltroNegozio?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiScontiConCategoriaFiltroNegozio'", async () => {
        const IDNegozio = "1";
        const response = await testSession.get("/api/trovaTuttiScontiConCategoriaFiltroNegozio?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API DELETE '/api/eliminaSconto'", async () => {
        const response = await testSession.post("/api/eliminaSconto?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
})