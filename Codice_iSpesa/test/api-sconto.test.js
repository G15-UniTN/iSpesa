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
        Valore: "10",
        Negozio: "1",
        DataInizio: "1970-01-01",
        DataFine: "1980-01-01",
        IDSconto: "",
    }

    const adminUser = {
        Username : "root",
        Password : "",
    }

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API POST '/api/salvaSconto' da un utente non admin", async () => {
        const response = await testSession.post("/api/salvaSconto").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API DELETE '/api/eliminaSconto' da un utente non admin", async () => {
        const response = await testSession.post("/api/eliminaSconto?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API POST '/api/associaScontoProdotto' da un utente non admin", async () => {
        const inputBody = {
            IDSconto: "1",
            IDProdotto: "2",
        }
        const response = await testSession.post("/api/associaScontoProdotto").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    test("Chiamata all'API POST '/api/associaScontoCategoria' da un utente non admin", async () => {
        const inputBody = {
            IDSconto: "1",
            Categoria: "Frutta",
        }
        const response = await testSession.post("/api/associaScontoCategoria").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    it('should authenticate as admin', async () => {
        await testSession.post("/login").send(adminUser).expect(303); //Logs as admin
    })

    test("Chiamata all'API POST '/api/salvaSconto' senza dati", async () => {
        const response = await testSession.post("/api/salvaSconto");
        expect(response.statusCode).toEqual(400);
    })

    var IDSconto;
    test("Chiamata all'API POST '/api/salvaSconto'", async () => {
        const response = await testSession.post("/api/salvaSconto").send(inputBody);
        expect(response.statusCode).toEqual(201);
        inputBody.IDSconto = response.body.insertId;
        IDSconto = inputBody.IDSconto;
    })

    test("Chiamata all'API POST '/api/associaScontoProdotto' senza dati", async () => {
        const response = await testSession.post("/api/associaScontoProdotto");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API POST '/api/associaScontoProdotto'", async () => {
        const inputBody = {
            IDSconto: IDSconto,
            IDProdotto: "2",
        }
        const response = await testSession.post("/api/associaScontoProdotto").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API POST '/api/associaScontoCategoria' senza dati", async () => {
        const response = await testSession.post("/api/associaScontoCategoria");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API POST '/api/associaScontoCategoria'", async () => {
        const inputBody = {
            IDSconto: IDSconto,
            Categoria: "Frutta",
        }
        const response = await testSession.post("/api/associaScontoCategoria").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API GET '/api/trovaTuttiSconti'", async () => {
        const response = await testSession.get("/api/trovaTuttiSconti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaScontiConProdotto'", async () => {
        const response = await testSession.get("/api/trovaScontiConProdotto");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaScontiConCategoria'", async () => {
        const response = await testSession.get("/api/trovaScontiConCategoria");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaScontiConProdottoFiltroNegozio'", async () => {
        const IDNegozio = "1";
        const response = await testSession.get("/api/trovaScontiConProdottoFiltroNegozio?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaScontiConCategoriaFiltroNegozio'", async () => {
        const IDNegozio = "1";
        const response = await testSession.get("/api/trovaScontiConCategoriaFiltroNegozio?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API DELETE '/api/eliminaSconto' senza dati", async () => {
        const response = await testSession.post("/api/eliminaSconto?_method=DELETE");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API DELETE '/api/eliminaSconto'", async () => {
        const response = await testSession.post("/api/eliminaSconto?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
})


