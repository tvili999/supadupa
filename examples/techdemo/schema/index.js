module.exports = () => {
    auth("jwt", async (req, ctx) => {
        if (req.headers.authorization) ctx.username = req.headers.authorization.substr("Bearer ".length);

        return !!ctx.username;
    });

    role("auth", (req, ctx) => ctx.username);
    role("admin", (req, ctx) => ctx.username?.startsWith("A"));

    set({
        permissions: {
            admin: "rw",
            my: "rw",
            ours: "r",
        },
        includeRule: (field) => ["int", "string"].includes(field.type),
    });

    require("./job");
    require("./organization");
    require("./user");
};
