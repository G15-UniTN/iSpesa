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

describe('Suite testing API categoria', () => {

    testSession = session("http://localhost:" + port);

    test("Chiamata all'API GET '/api/categorie'", async () => {
        const response = await testSession.get("/api/categorie");
        expect(response.statusCode).toEqual(200);
    })
})