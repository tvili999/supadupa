module.exports = ({ configure }) =>
    configure(
        ({ dependency }) =>
            dependency("globalContext:endpoints", {
                dependsOn: ["globalContext:roles"],
            }),
        ({ run }) =>
            run("globalContext:endpoints", async ({ get }) => {
                const router = await get("router");
                const schema = await get("schema");
                const executors = await get("requestExecutors");

                for (const model in schema.models) {
                    console.log(`[endpoint] ${model} loaded`);
                    router.post(`/${model}/:action`, async (req, res) => {
                        req.ctx.model = model;
                        req.ctx.action = req.params.action;

                        await executors.execute(req.ctx, req, res);
                    });
                }

                router.use((req, res) => {
                    res.status(404).send("Not found");
                });
            })
    );
