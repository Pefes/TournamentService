const sponsor = ( sequelize, type ) => {
    return sequelize.define("sponsor", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tournamentId: type.INTEGER,
        imageName: type.STRING
    }, {
        timestamps: false
    });
};

module.exports = sponsor;