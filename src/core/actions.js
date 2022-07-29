module.exports = ({ inject }) =>
    inject("actions", async ({ get }) => {
        const schema = await get("schema");

        let actions = {};
        let models = {};

        for (const model in schema.models || []) {
            for (const action of schema.models[model].action || []) {
                models[model] ||= {};
                models[model][action.name] = action;
            }
        }

        return {
            add: (name, config) => {
                actions[name] = config;
            },
            get: (model, action) => {
                let { rawHandler, handler, ...config } = actions[action] || {};

                let result = { ...config };
                if (models[model]?.[action])
                    result = {
                        ...result,
                        ...models[model]?.[action],
                    };
                result.execute = (req, res) => {
                    if (rawHandler) return rawHandler(req, res);
                    return handler.call(req.ctx);
                };

                return result;
            },
        };
    });
