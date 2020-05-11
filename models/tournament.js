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
        size: type.INTEGER,
        startDate: type.DATE,
        deadlineDate: type.DATE,
    }, {
        timestamps: false
    });
};

module.exports = tournament;