module.exports = require("./_executor")({
    name: "preprocess",
    dependsOn: "checkActionPermissions",
    builder: async ({ get }) => {
        const inputProcessor = await get("inputProcessor");

        return function (req, res) {
            const result = inputProcessor.process(this.data, this.model, this);
            if (result?.success) {
                this.data = result.data;
            } else {
                res.status(400).send(result?.error || "Bad request");
                return false;
            }
        };
    },
});
