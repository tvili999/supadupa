module.exports = ({ run }) =>
    run(async ({ get }) => {
        const inputProcessor = await get("inputProcessor");

        inputProcessor.addType("string", function (input) {
            if (typeof input === "string") return { success: true, data: input };
            if (["number", "bigint", "boolean"].includes(typeof input))
                return { success: true, data: input.toString() };

            return { success: false, error: `expected string, got ${typeof input}` };
        });
        inputProcessor.addType("int", function (input) {
            if (typeof input === "number") {
                if (Number.isInteger(input)) return { success: true, data: input };
                else return { success: false, error: `expected integer` };
            }
            if (typeof input === "string") {
                if (input.includes(".")) return { success: false, error: `expected integer` };
                const int = parseInt(input);
                if (int === NaN) return { success: false, error: `expected integer` };

                return { success: true, data: int };
            }

            return { success: false, error: `expected string, got ${typeof input}` };
        });
    });
