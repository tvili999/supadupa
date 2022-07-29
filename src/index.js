const createContainer = require("js-container");

// global.log = (...args) => console.log(...args);

module.exports = async (driver, schemaBuilder) => {
    const container = await createContainer(
        ({ inject }) => inject("driverBuilder", () => driver),
        ({ inject }) => inject("schemaBuilder", () => schemaBuilder),
        require("./core"),
        require("./globalContext"),
        require("./actions"),
        require("./requestExecutors"),
        require("./inputProcessor")
    );

    return await container.get("router");
};
