module.exports = ({ configure }) =>
    configure(
        ({ dependency }) =>
            dependency("globalContext:roles", {
                dependsOn: ["globalContext:auth"],
            }),
        ({ run }) =>
            run("globalContext:roles", async ({ get }) => {
                const router = await get("router");
                const schema = await get("schema");

                let roles = [];
                for (const role of schema.roles || []) {
                    if (role.name === "_") throw `Invalid role name "_" in schema`;
                    role.config = {};
                    role.init?.(role.config);
                    roles.push(role);
                    console.log(`[role] ${role.name} loaded`);
                }

                router.use(async (req, res, next) => {
                    req.ctx.role ||= [];
                    for (const role of roles) {
                        const result = await role.predicate(req, req.ctx, role.config);
                        if (result) req.ctx.role.push(role.name);
                    }
                    if (req.ctx.role.length === 0) {
                        req.ctx.role.push("_");
                    }

                    next();
                });
            })
    );
