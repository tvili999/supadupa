module.exports = ({ configure }) =>
    configure(
        ({ dependency }) =>
            dependency("globalContext:auth", {
                dependsOn: ["globalContext:init"],
            }),
        ({ run }) =>
            run("globalContext:auth", async ({ get }) => {
                const router = await get("router");
                const schema = await get("schema");

                let auths = [];
                for (const auth of schema.auth || []) {
                    auth.config = {};
                    auth.init?.(auth.config);
                    auths.push(auth);
                    console.log(`[auth] ${auth.name} loaded`);
                }

                router.use(async (req, res, next) => {
                    for (const auth of auths) {
                        const result = await auth.handler(req, req.ctx, auth.config);
                        if (result) {
                            req.ctx.auth ||= [];
                            req.ctx.auth.push(auth.name);
                        }
                    }

                    next();
                });
            })
    );
