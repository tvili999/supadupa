module.exports = ({ configure }) =>
    configure(
        ({ dependency }) =>
            dependency("requestExecutors:checkActionPermissions", {
                dependsOn: ["requestExecutors:init"],
            }),
        ({ run }) =>
            run("requestExecutors:checkActionPermissions", async ({ get }) => {
                const executors = await get("requestExecutors");
                executors.add(async function (req, res) {
                    if (!this.action.config.roles) return true;

                    let result = false;
                    const roles = this.action.config.roles;
                    for (const myRole of this.role) {
                        if (roles.includes(myRole)) {
                            result = true;
                            break;
                        }
                    }

                    if (result && this.action.config.filter) {
                        const filterResult = await this.action.config.filter.call(this, req, res);
                        if (filterResult === false) result = false;
                    }

                    if (!result) {
                        res.status(404).send("Not found");
                        return false;
                    }
                });
            })
    );
