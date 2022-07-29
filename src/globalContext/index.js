module.exports = ({ configure }) =>
    configure(require("./init"), require("./auths"), require("./roles"), require("./endpoints"));
