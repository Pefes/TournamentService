const Sequelize = require( "Sequelize" );
const seedDb = require( "./seed" );
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
    sponsorModel = require( "../models/sponsor" ),
    participationModel = require( "../models/participation" ),
    duelModel = require( "../models/duel" );

// create tables
const User = userModel( sequelize, Sequelize ),
    Tournament = tournamentModel( sequelize, Sequelize ),
    Sponsor = sponsorModel( sequelize, Sequelize )
    Participation = participationModel( sequelize, Sequelize ),
    Duel = duelModel( sequelize, Sequelize );

// database connection
sequelize.sync({ force: true })
.then(() => {
    seedDb( User, Tournament, Sponsor, Participation, Duel );
    console.log( "Database & tables created here!" );
});


module.exports = {
    sequelize: sequelize,
    User: User,
    Tournament: Tournament,
    Sponsor: Sponsor,
    Participation: Participation,
    Duel: Duel
};