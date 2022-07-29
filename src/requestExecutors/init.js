module.exports = ({ run }) =>
    run("requestExecutors:init", async ({ get }) => {
        const executors = await get("requestExecutors");
        const actions = await get("actions");

        executors.add(function (req) {
            this.action = actions.get(this.model, this.action);
            if (!this.action) return res.status(404).send("Not found");

            this.data = req.body;
        });
    });
