module.exports = ({ inject }) =>
    inject("requestExecutors", async ({ get }) => {
        const steps = [];

        return {
            add: (executor) => {
                steps.push(executor);
            },
            execute: async (ctx, ...args) => {
                for (const step of steps) {
                    const result = await step.call(ctx, ...args);
                    if (result === false) return false;
                }
                return true;
            },
        };
    });
