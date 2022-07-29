module.exports = ({ configure }) =>
    configure(
        require("./init"),
        require("./preValidate"),
        require("./runAction"),
        require("./sendResponse"),
        require("./checkActionPermissions")
    );
