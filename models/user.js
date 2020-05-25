const user = ( sequelize, type ) => {
    return sequelize.define("user", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        surname: type.STRING,
        email: type.STRING,
        password: type.STRING,
        active: {
            type: type.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: false
    });
};

module.exports = user;