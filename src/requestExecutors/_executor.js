module.exports =
    (config) =>
    ({ configure }) => {
        const params = [];
        if (config.dependsOn)
            params.push(({ dependency }) =>
                dependency(`requestExecutors:${config.name}`, {
                    dependsOn: [`requestExecutors:${config.dependsOn}`],
                })
            );

        params.push(({ run }) =>
            run(`requestExecutors:${config.name}`, async (container) => {
                const executors = await container.get("requestExecutors");

                if (config.builder) {
                    const executor = await config.builder(container);
                    executors.add(executor);
                } else {
                    executors.add(config.executor);
                }
            })
        );

        return configure(...params);
    };
