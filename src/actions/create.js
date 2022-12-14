module.exports = ({ run }) =>
    run(async ({ get }) => {
        const actions = await get("actions");
        const driver = await get("driver");

        actions.add("create", {
            requestType: "write",
            async handler() {
                this.data = await driver.database.create(this.model, this.data);

                return this.data;
            },
        });
    });
