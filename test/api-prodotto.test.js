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

describe('Suite testing API prodotto', () => {

    const inputBody = {
        Nome: "Prodotto_test",
        Immagine: "/immagine_test.png",
        Categoria: "Frutta",
        IDNegozio: "1",
        IDProdotto: "",
        Prezzo: "",
    }

    const adminUser = {
        Username : "root",
        Password : "",
    }

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API POST '/api/salvaProdotto' da un utente non admin", async () => {
        const response = await testSession.post("/api/salvaProdotto").send(inputBody);
        expect(response.statusCode).toEqual(403);
    })

    it('should authenticate as admin', async () => {
        await testSession.post("/login").send(adminUser).expect(303); //Logs as admin
    })

    test("Chiamata all'API POST '/api/salvaProdotto' senza dati", async () => {
        const response = await testSession.post("/api/salvaProdotto");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API POST '/api/salvaProdotto'", async () => {
        const response = await testSession.post("/api/salvaProdotto").send(inputBody);
        expect(response.statusCode).toEqual(201);
        inputBody.IDProdotto = response.body.insertId;
    })

    test("Chiamata all'API GET '/api/trovaTuttiProdotti'", async () => {
        const response = await testSession.get("/api/trovaTuttiProdotti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiProdottiScontati'", async () => {
        const response = await testSession.get("/api/trovaTuttiProdottiScontati");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiProdottiScontatiFiltroCategoria'", async () => {
        const Categoria = inputBody.Categoria;
        const response = await testSession.get("/api/trovaTuttiProdottiScontatiFiltroCategoria?Categoria="+Categoria);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaProdottiFiltroNome'", async () => {
        const Nome = inputBody.Nome;
        const response = await testSession.get("/api/trovaProdottiFiltroNome?Nome="+Nome);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaProdottoFiltroID'", async () => {
        const IDProdotto = inputBody.IDProdotto;
        const response = await testSession.get("/api/trovaProdottoFiltroID?IDProdotto="+IDProdotto);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaProdottiFiltroNegozio'", async () => {
        const IDNegozio = inputBody.IDNegozio;
        const response = await testSession.get("/api/trovaProdottiFiltroNegozio?IDNegozio="+IDNegozio);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaProdottiFiltroCategoria'", async () => {
        const Categoria = inputBody.Categoria;
        const response = await testSession.get("/api/trovaProdottiFiltroCategoria?Categoria="+Categoria);
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API PATCH '/api/modificaImmagine' senza dati", async () => {
        const response = await testSession.post("/api/modificaImmagine?_method=PATCH");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API PATCH '/api/modificaImmagine'", async () => {
        inputBody.Immagine = "/nuova_immagine_test.png";
        const response = await testSession.post("/api/modificaImmagine?_method=PATCH").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API POST '/api/aggiungiPrezzo' senza dati", async () => {
        const response = await testSession.post("/api/aggiungiPrezzo");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API POST '/api/aggiungiPrezzo'", async () => {
        inputBody.Prezzo = "10";
        const response = await testSession.post("/api/aggiungiPrezzo").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })

    test("Chiamata all'API DELETE '/api/eliminaProdotto' senza IDProdotto", async () => {
        const response = await testSession.post("/api/eliminaProdotto?_method=DELETE");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata all'API DELETE '/api/eliminaProdotto'", async () => {
        const response = await testSession.post("/api/eliminaProdotto?_method=DELETE").send(inputBody);
        expect(response.statusCode).toEqual(204);
    })
})