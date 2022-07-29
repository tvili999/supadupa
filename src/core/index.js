module.exports = (container) =>
    container.configure(
        require("./router"),
        require("./schema"),
        require("./actions"),
        require("./requestExecutors"),
        require("./driver")
    );
