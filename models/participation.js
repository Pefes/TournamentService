const participation = ( sequelize, type ) => {
    return sequelize.define("participation", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tournamentId: type.INTEGER,
        userId: type.INTEGER,
        ladderRank: type.INTEGER
    }, {
        timestamps: false
    });
};

module.exports = participation;