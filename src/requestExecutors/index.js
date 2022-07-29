module.exports = ({ configure }) =>
    configure(
        require("./init"),
        require("./preprocess"),
        require("./runAction"),
        require("./sendResponse"),
        require("./checkActionPermissions")
    );
