const Sequelize = require( "Sequelize" );
const userModel = require( "../models/user" );
const tournamentModel = require( "../models/tournament" );
const { DATABASE_NAME, 
    USERNAME, 
    PASSWORD, 
    HOST, 
    DIALECT,
    MAX,
    MIN,
    ACQUIRE,
    IDLE } = require( "./databaseConfig" );


//set config
const sequelize = new Sequelize(
    DATABASE_NAME, 
    USERNAME, 
    PASSWORD, 
    {
        host: HOST,
        dialect: DIALECT,
        logging: false,
        pool: {
            max: MAX,
            min: MIN,
            acquire: ACQUIRE,
            idle: IDLE
    }
});

//create tables
const User = userModel( sequelize, Sequelize );
const Tournament = tournamentModel( sequelize, Sequelize );

// database connection
sequelize.sync({ force: false })
    .then(() => {
        console.log( "Database & tables created here!" );
    });

module.exports = {
    User: User,
    Tournament: Tournament
};