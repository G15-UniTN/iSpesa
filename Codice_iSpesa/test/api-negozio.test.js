const request = require('supertest');
const main = require("../main.js");
const port = process.env.PORT || 8080;

let server;

beforeAll( async () => {
    jest.setTimeout(20000)
    server = main.app.listen(port);
})

afterAll(() => {
    main.closeDB();
    server.close();
})

describe('Suite testing API negozi', () => {
    test("Chiamata all'API GET '/api/trovaTuttiNegozi'", async () => {
        const response = await request("http://localhost:" + port).get("/api/trovaTuttiNegozi");
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiNegoziFiltroNome'", async () => {
        const Nome = "EuroSpin"
        const response = (await request("http://localhost:" + port).get("/api/trovaTuttiNegoziFiltroNome?Nome="+Nome));
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiNegoziFiltroID'", async () => {
        const IDNegozio = "EuroSpin"
        const response = (await request("http://localhost:" + port).get("/api/trovaNegozioFiltroID?IDNegozio="+IDNegozio));
        expect(response.statusCode).toEqual(200);
    })

    test("Chiamata all'API GET '/api/trovaTuttiNegoziFiltroUbicazione'", async () => {
        const Ubicazione = "EuroSpin"
        const response = (await request("http://localhost:" + port).get("/api/trovaTuttiNegoziFiltroUbicazione?Ubicazione="+Ubicazione));
        expect(response.statusCode).toEqual(200);
    })
})