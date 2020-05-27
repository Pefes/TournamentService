const Sequelize = require( "sequelize" );
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
const sequelize;

if ( process.env.NODE_ENV !== "PRODUCTION" ) {
    sequelize = new Sequelize(
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
} else {
    sequelize = new Sequelize( process.env.DATABASE_URL );
}


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
    if ( process.env.NODE_ENV !== "PRODUCTION" )
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