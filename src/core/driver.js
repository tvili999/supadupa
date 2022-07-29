module.exports = ({ inject }) =>
    inject("driver", async ({ get }) => {
        const schema = await get("schema");
        const driverBuilder = await get("driverBuilder");

        return await driverBuilder(schema);
    });
