model("Job", () => {
    set({
        permissions: {
            my: "rw",
            admin: "rw",
        },
        rowPermissions: {
            create: ["admin", "job_manager"],
            delete: ["admin", "my"],
        },
    });

    field("id", "int", {
        primaryKey: true,
        autoIncrement: true,
    });
    field("name", "string");
    field("owner", "User", {
        permissions: {
            admin: "rw",
            my: "r",
        },
    });

    property("ownerId", async (ctx, x) => {});

    role("my", async (x, ctx) => (await x.get("ownerId")) === ctx.user.id);
});
