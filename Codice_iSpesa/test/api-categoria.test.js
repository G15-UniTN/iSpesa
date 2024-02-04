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

describe('Suite testing API categoria', () => {
    test("Chiamata all'API GET '/api/categorie'", async () => {
        const response = await request("http://localhost:" + port).get("/api/categorie");
        expect(response.statusCode).toEqual(200);
    })
})