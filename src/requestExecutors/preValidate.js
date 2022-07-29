module.exports = ({ configure }) =>
    configure(
        ({ dependency }) =>
            dependency("requestExecutors:preValidate", {
                dependsOn: ["requestExecutors:checkActionPermissions"],
            }),
        ({ run }) =>
            run("requestExecutors:preValidate", async ({ get }) => {
                const executors = await get("requestExecutors");
                executors.add(function () {
                    //                    console.log("preValidate");
                });
            })
    );
