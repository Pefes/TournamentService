const resetPasswordKey = ( sequelize, type ) => {
    return sequelize.define("resetPasswordKey", {
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

module.exports = resetPasswordKey;