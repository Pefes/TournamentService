const db = require( "../databaseConnection" );


const checkTournamentStatus = async () => {
    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "open" }, raw: true });

        tournaments.forEach(async tournament => {
            if ( new Date(tournament.startDate) - new Date() < 0 ) {
                db.Toursnament.update({ status: "closed" }, { where: { id: tournament.id } });
            }
        });
    }
    catch ( error ) {
        console.log( "Error occured: " + error );
    }
}


module.exports = checkTournamentStatus;