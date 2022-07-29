module.exports = ({ run }) =>
    run(async ({ get }) => {
        const inputProcessor = await get("inputProcessor");
        const schema = await get("schema");

        for (const modelName in schema.models) {
            const model = schema.models[modelName];
            const defaultPermissions = model.config?.permissions || {};

            const readPermissions = {};
            const writePermissions = {};
            for (const fieldName in model.fields) {
                const field = model.fields[fieldName];
                const permissions = field.config?.permissions || defaultPermissions;

                for (const roleName in permissions) {
                    if (permissions[roleName].includes("w")) {
                        writePermissions[fieldName] ||= [];
                        if (!writePermissions[fieldName].includes(roleName)) {
                            writePermissions[fieldName].push(roleName);
                        }
                    }
                    if (permissions[roleName].includes("r")) {
                        readPermissions[fieldName] ||= [];
                        if (!readPermissions[fieldName].includes(roleName)) {
                            readPermissions[fieldName].push(roleName);
                        }
                    }
                }
            }

            inputProcessor.addType(modelName, function (input) {
                let permissions = null;
                if (this.action.requestType === "write") permissions = writePermissions;
                if (this.action.requestType === "read") permissions = readPermissions;
                if (!permissions) return { success: true, data: input };

                let result = {};
                for (const field in input) {
                    const fieldSchema = model.fields[field];
                    const fieldPermissions = permissions[field];
                    if (!fieldPermissions) return { success: false, error: `Wrong field "${field}"` };

                    // maybe precalculate for known roles
                    for (const myRole of this.role) {
                        if (fieldPermissions.includes(myRole)) {
                            if (fieldSchema?.config?.preProcessFilter) {
                                const result = fieldSchema.config.preProcessFilter(input[field]);
                                if (!result) return { success: false, error: `Wrong field "${field}"` };
                            }

                            let value = input[field];
                            if (fieldSchema?.config?.inputPreHook) value = fieldSchema.config.inputPreHook(value);

                            value = inputProcessor.process(value, fieldSchema.type, this);
                            if (!value?.success) return value;
                            value = value.data;

                            if (fieldSchema?.config?.inputPostHook) value = fieldSchema.config.inputPostHook(value);

                            if (fieldSchema?.config?.postProcessFilter) {
                                const result = fieldSchema.config.postProcessFilter(value);
                                if (!result) return { success: false, error: `Wrong field "${field}"` };
                            }

                            result[field] = value;
                            break;
                        }
                    }
                    if (!fieldPermissions) return { success: false, error: `Wrong field "${field}"` };
                }

                return { success: true, data: result };
            });
        }
    });
