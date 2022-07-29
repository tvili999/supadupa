module.exports = require("./_executor")({
    name: "init",
    builder: async ({ get }) => {
        const actions = await get("actions");

        return function (req, res) {
            this.action = actions.get(this.model, this.action);
            if (!this.action) return res.status(404).send("Not found");

            this.data = req.body;
        };
    },
});
