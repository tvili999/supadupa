module.exports = require("./_executor")({
    name: "runAction",
    dependsOn: "preprocess",
    executor: async function (req, res) {
        this.data = await this.action.execute(req, res);
    },
});
