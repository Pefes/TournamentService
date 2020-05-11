const Sequelize = require( "Sequelize" );
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

// import models
const userModel = require( "../models/user" ),
    tournamentModel = require( "../models/tournament" ),
    sponsorModel = require( "../models/sponsor" );

// create tables
const User = userModel( sequelize, Sequelize ),
    Tournament = tournamentModel( sequelize, Sequelize ),
    Sponsor = sponsorModel( sequelize, Sequelize );

// database connection
sequelize.sync({ force: false })
    .then(() => {
        console.log( "Database & tables created here!" );
    });

module.exports = {
    User: User,
    Tournament: Tournament,
    Sponsor: Sponsor
};