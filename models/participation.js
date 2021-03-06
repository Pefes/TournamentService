const participation = ( sequelize, type ) => {
    return sequelize.define("participation", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tournamentId: type.INTEGER,
        userId: type.INTEGER,
        ladderRank: type.FLOAT,
        status: {
            type: type.STRING,
            defaultValue: "in"
        }
    }, {
        timestamps: false
    });
};

module.exports = participation;