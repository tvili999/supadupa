const bodyParser = require("body-parser");
const express = require("express");
const supadupa = require("../../src/index");
const driver = require("./driver");
const schema = require("./schema");

(async () => {
    const router = await supadupa(driver, schema);

    const app = express();
    app.use(bodyParser.json());
    app.use("/api/ez", router);

    app.listen(4000);
})().catch(console.error);
