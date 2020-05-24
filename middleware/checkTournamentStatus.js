const db = require( "../database/databaseConnection" );


const checkTournamentStatus = async ( req, res, next ) => {
    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "open" }, raw: true });

        tournaments.forEach(async tournament => {
            if ( new Date(tournament.startDate) - new Date() < 0 ) {
                db.Tournament.update({ status: "closed" }, { where: { id: tournament.id } });
            }
        });
    
        return next();
    }
    catch ( error ) {
        console.log( "Error occured: " + error );

        return next();
    }
}


module.exports = checkTournamentStatus;