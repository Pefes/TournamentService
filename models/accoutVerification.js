const accoutVerification = ( sequelize, type ) => {
    return sequelize.define("accoutVerification", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: type.INTEGER,
        key: type.STRING
    }, {
        timestamps: false
    });
};

module.exports = accoutVerification;