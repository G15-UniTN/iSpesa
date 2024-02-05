const main = require('./main.js');
const port = process.env.PORT || 8080;

main.app.listen(port, () => {
    console.log("Server is listening on port " + port);
});