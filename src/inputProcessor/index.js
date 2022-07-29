module.exports = ({ configure }) =>
    configure(require("./inputProcessor"), require("./modelTypes"), require("./primitiveTypes"));
