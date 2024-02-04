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

describe('Suite testing API sconto', () => {

    const inputBody = {
        Negozio : "1",
        DataFine : "1970-01-01",
        VolantinoFile : "file_test.pdf",
        IDVolantino : "",
    }

    const adminUser = {
        Username : "root",
        Password : "",
    }

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API POST '/api/salvaVolantino' da un utente non admin", async () => {
        const response = await testSession.post("/api/salvaSconto").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    it('should authenticate as admin', async () => {
        await testSession.post("/login").send(adminUser).expect(303); //Logs as admin
    })

    test("Chiamata all'API POST '/api/salvaVolantino'", async () => {
        const response = await testSession.post("/api/salvaVolantino").send(inputBody);
        expect(response.statusCode).toEqual(201);
        inputBody.IDVolantino = response.body.insertId;
    })

    test("Chiamata all'API GET '/api/trovaTuttiVolantini'", async () => {
        const response = await testSession.get("/api/trovaTuttiVolantini");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaVolantiniFiltroNegozio'", async () => {
        const IDNegozio = inputBody.Negozio;
        const response = await testSession.get("/api/trovaVolantiniFiltroNegozio?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API DELETE '/api/eliminaVolantino'", async () => {
        const response = await testSession.post("/api/eliminaVolantino?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
})