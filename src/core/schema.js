module.exports = ({ inject }) =>
    inject("schema", async ({ get }) => {
        const schemaBuilder = await get("schemaBuilder");
        let schema = {};

        let context = [schema];

        const globalFunctions = {
            auth: (name, handler) => {
                const currentCtx = context[context.length - 1];
                currentCtx.auth ||= [];
                currentCtx.auth.push({ name, handler });
            },
            action: (name, config) => {
                const currentCtx = context[context.length - 1];
                currentCtx.action ||= [];
                currentCtx.action.push({ name, config });
            },
            set: (name, value) => {
                if (typeof name === "string") {
                    const currentCtx = context[context.length - 1];
                    currentCtx.config ||= {};
                    currentCtx.config = {
                        ...currentCtx.config,
                        [name]: value,
                    };
                }
                if (typeof name === "object") {
                    let obj = name;
                    for (name in obj) set(name, obj[name]);
                }
            },
            field: (name, type, config) => {
                const currentCtx = context[context.length - 1];
                currentCtx.fields ||= {};
                currentCtx.fields[name] = { type, config };
            },
            property: (name, getter) => {
                const currentCtx = context[context.length - 1];
                currentCtx.properties ||= {};
                currentCtx.properties[name] = { name, getter };
            },
            model: (name, builder) => {
                let model = {};
                schema.models ||= {};
                schema.models[name] = model;

                context.push(model);

                builder();

                context.pop();
            },
            role: (name, predicate) => {
                const currentCtx = context[context.length - 1];
                currentCtx.roles ||= [];
                currentCtx.roles.push({ name, predicate });
            },
        };

        const originalGlobalFunctions = {};
        for (const name in globalFunctions) {
            originalGlobalFunctions[name] = global[name];
            global[name] = globalFunctions[name];
        }

        await schemaBuilder();

        for (const name in originalGlobalFunctions) global[name] = originalGlobalFunctions[name];

        return schema;
    });
