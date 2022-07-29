module.exports = ({ inject }) =>
    inject("inputProcessor", async ({ get }) => {
        let casts = {};

        return {
            addType: (name, cast) => {
                casts[name] = cast;
            },
            process: (input, type, ctx) => {
                const cast = casts[type];
                if (!cast) return { success: false, error: "Unknown type" };

                try {
                    return cast.call(ctx, input);
                } catch {
                    return { success: false };
                }
            },
        };
    });
