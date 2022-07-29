module.exports = ({ run }) =>
    run("globalContext:init", async ({ get }) => {
        const router = await get("router");
        router.use((req, res, next) => {
            req.ctx = {};

            next();
        });
    });
