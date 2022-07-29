model("Organization", () => {
    field("id", "int", {
        primaryKey: true,
        autoIncrement: true,
    });
    field("name", "string");
    field("owner", "User", {
        linkField: "ownerId",
        permissions: {},
    });

    role("my", (x, ctx) => x.ownerId === ctx.user.id);
});
