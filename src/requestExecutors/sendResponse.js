module.exports = ({ configure }) =>
    configure(
        ({ dependency }) =>
            dependency("requestExecutors:sendResponse", {
                dependsOn: ["requestExecutors:runAction"],
            }),
        ({ run }) =>
            run("requestExecutors:sendResponse", async ({ get }) => {
                const executors = await get("requestExecutors");

                executors.add(function (req, res) {
                    res.send(this.data);
                });
            })
    );
