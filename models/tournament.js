const tournament = ( sequelize, type ) => {
    return sequelize.define("tournament", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ownerId: type.INTEGER,
        name: type.STRING,
        branch: type.STRING,
        maxSize: type.INTEGER,
        currentSize: type.INTEGER,
        startDate: type.DATE,
        deadlineDate: type.DATE,
        status: {
            type: type.STRING,
            defaultValue: "open"
        }
    }, {
        timestamps: false
    });
};

module.exports = tournament;