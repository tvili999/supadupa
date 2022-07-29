module.exports = require("./_executor")({
    name: "sendResponse",
    dependsOn: "runAction",
    executor: function (req, res) {
        res.send(this.data);
    },
});
