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
        startDate: type.STRING,
        deadlineDate: type.STRING,
        status: {
            type: type.STRING,
            defaultValue: "open"
        },
        maxStage: type.INTEGER,
        currentStage: type.INTEGER,
        winnerId: {
            type: type.INTEGER,
            defaultValue: null
        }
    }, {
        timestamps: true
    });
};

module.exports = tournament;