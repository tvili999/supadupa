module.exports = require("./_executor")({
    name: "checkActionPermissions",
    dependsOn: "init",
    executor: async function (req, res) {
        const config = this.action.config;
        if (!config.roles) return true;

        let result = false;
        for (const myRole of this.role) {
            if (config.roles.includes(myRole)) {
                result = true;
                break;
            }
        }

        if (result && config.filter) {
            const filterResult = await config.filter.call(this, req, res);
            if (filterResult === false) result = false;
        }

        if (!result) {
            res.status(404).send("Not found");
            return false;
        }
    },
});
