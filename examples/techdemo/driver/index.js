module.exports = () => {
    return {
        database: {
            create: (model, data) => {
                console.log("[create] ", model, data);
            },
        },
    };
};
