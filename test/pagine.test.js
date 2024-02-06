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

describe('Suite testing web pages as unregistered user', () => {

    testSession = session("http://localhost:" + port);

    test("Chiamata alla pagina '/'", async () => {
        const response = await testSession.get("/");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/login'", async () => {
        const response = await testSession.get("/login");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/password_dimenticata'", async () => {
        const response = await testSession.get("/password_dimenticata");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/signup'", async () => {
        const response = await testSession.get("/signup");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozi'", async () => {
        const response = await testSession.get("/negozi");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/sconti'", async () => {
        const response = await testSession.get("/sconti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/volantini'", async () => {
        const response = await testSession.get("/volantini");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozio'", async () => {
        const response = await testSession.get("/negozio?Negozio=1");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/prodotto'", async () => {
        const response = await testSession.get("/prodotto?IDProdotto=1");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozio' senza IDNegozio", async () => {
        const response = await testSession.get("/negozio");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata alla pagina '/prodotto' senza IDProdotto", async () => {
        const response = await testSession.get("/prodotto");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata alla pagina '/preferiti' senza login", async () => {
        const response = await testSession.get("/preferiti");
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata alla pagina '/area_personale' senza login", async () => {
        const response = await testSession.get("/area_personale");
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata alla pagina '/admin_recensioni' senza login", async () => {
        const response = await testSession.get("/admin_recensioni");
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata alla pagina '/admin_utenti' senza login", async () => {
        const response = await testSession.get("/admin_utenti");
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata alla pagina '/logout' senza login", async () => {
        const response = await testSession.get("/logout");
        expect(response.statusCode).toEqual(303);
    })
})

describe('Suite testing web pages as registered user', () => {

    const inputBody = {
        Username : "testuser",
        Password : "",
    }

    testSession = session("http://localhost:" + port);

    it('Effettuo il login', async () => {
        await testSession.post("/login").send(inputBody).expect(303); //Logs as user
    })

    test("Chiamata alla pagina '/'", async () => {
        const response = await testSession.get("/");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/login'", async () => {
        const response = await testSession.get("/login");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/password_dimenticata'", async () => {
        const response = await testSession.get("/password_dimenticata");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/signup'", async () => {
        const response = await testSession.get("/signup");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozi'", async () => {
        const response = await testSession.get("/negozi");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/sconti'", async () => {
        const response = await testSession.get("/sconti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/volantini'", async () => {
        const response = await testSession.get("/volantini");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozio'", async () => {
        const response = await testSession.get("/negozio?Negozio=1");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/prodotto'", async () => {
        const response = await testSession.get("/prodotto?IDProdotto=1");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozio' senza IDNegozio", async () => {
        const response = await testSession.get("/negozio");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata alla pagina '/prodotto' senza IDProdotto", async () => {
        const response = await testSession.get("/prodotto");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata alla pagina '/preferiti'", async () => {
        const response = await testSession.get("/preferiti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/area_personale'", async () => {
        const response = await testSession.get("/area_personale");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/admin_recensioni' senza admin", async () => {
        const response = await testSession.get("/admin_recensioni");
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata alla pagina '/admin_utenti' senza admin", async () => {
        const response = await testSession.get("/admin_utenti");
        expect(response.statusCode).toEqual(303);
    })

    test("Chiamata alla pagina '/logout'", async () => {
        const response = await testSession.get("/logout");
        expect(response.statusCode).toEqual(303);
    })
})

describe('Suite testing web pages as admin', () => {

    const inputBody = {
        Username : "root",
        Password : "",
    }

    testSession = session("http://localhost:" + port);

    it('Effettuo il login', async () => {
        await testSession.post("/login").send(inputBody).expect(303); //Logs as admin
    })

    test("Chiamata alla pagina '/'", async () => {
        const response = await testSession.get("/");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/login'", async () => {
        const response = await testSession.get("/login");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/password_dimenticata'", async () => {
        const response = await testSession.get("/password_dimenticata");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/signup'", async () => {
        const response = await testSession.get("/signup");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozi'", async () => {
        const response = await testSession.get("/negozi");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/sconti'", async () => {
        const response = await testSession.get("/sconti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/volantini'", async () => {
        const response = await testSession.get("/volantini");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozio'", async () => {
        const response = await testSession.get("/negozio?Negozio=1");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/prodotto'", async () => {
        const response = await testSession.get("/prodotto?IDProdotto=1");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/negozio' senza IDNegozio", async () => {
        const response = await testSession.get("/negozio");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata alla pagina '/prodotto' senza IDProdotto", async () => {
        const response = await testSession.get("/prodotto");
        expect(response.statusCode).toEqual(400);
    })

    test("Chiamata alla pagina '/preferiti'", async () => {
        const response = await testSession.get("/preferiti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/area_personale'", async () => {
        const response = await testSession.get("/area_personale");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/admin_recensioni'", async () => {
        const response = await testSession.get("/admin_recensioni");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/admin_utenti'", async () => {
        const response = await testSession.get("/admin_utenti");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata alla pagina '/logout'", async () => {
        const response = await testSession.get("/logout");
        expect(response.statusCode).toEqual(303);
    })
})