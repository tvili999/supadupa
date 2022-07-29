module.exports = ({ configure }) =>
    configure(
        ({ dependency }) =>
            dependency("requestExecutors:runAction", {
                dependsOn: ["requestExecutors:preValidate"],
            }),
        ({ run }) =>
            run("requestExecutors:runAction", async ({ get }) => {
                const executors = await get("requestExecutors");

                executors.add(async function (req, res) {
                    this.data = await this.action.execute(req, res);
                });
            })
    );
