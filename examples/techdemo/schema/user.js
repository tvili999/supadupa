model("User", () => {
    action("create", {
        roles: ["_"],
        filter: async function () {
            //console.log("CAPCHA was OK");
            return true;
        },
    });

    action("login", {
        roles: ["_"],
        rawHandler: async function (req, res) {
            if (this.data.password === this.row.password) {
                req.cookies.set("token", req.body.username);
                return { success: true };
            } else {
                return { success: false, error: "Bad pass you idiot" };
            }
        },
    });

    role("my", (x, ctx) => x.id === ctx.user.id);

    set({
        permissions: {
            my: "rw",
            admin: "rw",
        },
    });

    field("id", "int", {
        primaryKey: true,
        autoIncrement: true,
    });
    field("name", "string", { unique: true });
    field("password", "string", {
        permissions: { my: "w" },
        writeHook: (x) => x, // hash it
    });
    field("email", "string");
});
