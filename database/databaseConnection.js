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
    participationModel = require( "../models/participation" ),
    duelModel = require( "../models/duel" ),
    verificationKey = require( "../models/verificationKey" ),
    resetPasswordKey = require( "../models/resetPasswordKey" );

// create tables
const User = userModel( sequelize, Sequelize ),
    Tournament = tournamentModel( sequelize, Sequelize ),
    Participation = participationModel( sequelize, Sequelize ),
    Duel = duelModel( sequelize, Sequelize ),
    VerificationKey = verificationKey( sequelize, Sequelize ),
    ResetPasswordKey = resetPasswordKey( sequelize, Sequelize );

// database connection
sequelize.sync({ force: true })
.then(() => {
    seedDb( User, Tournament, Participation, Duel );
    console.log( "Database & tables created here!" );
});


module.exports = {
    sequelize: sequelize,
    User: User,
    Tournament: Tournament,
    Participation: Participation,
    Duel: Duel,
    VerificationKey: VerificationKey,
    ResetPasswordKey: ResetPasswordKey
};