const duel = ( sequelize, type ) => {
    return sequelize.define("duel", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tournamentId: type.INTEGER,
        firstOpponent: type.INTEGER,
        secondOpponent: type.INTEGER,
        firstOpponentReply: {
            type: type.INTEGER,
            defaultValue: null
        },
        secondOpponentReply: {
            type: type.INTEGER,
            defaultValue: null
        },
        winner: {
            type: type.INTEGER,
            defaultValue: null
        },
        status: {
            type: type.STRING,
            defaultValue: "open"
        },
        stage: type.INTEGER
    }, {
        timestamps: false
    });
};

module.exports = duel;