const db = require( "../database/databaseConnection" );


/*const shuffle = ( array ) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
 */

const checkTournamentStatus = async ( req, res, next ) => {
    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "open" }, raw: true });

        tournaments.forEach(async tournament => {
            if ( tournament.startDate - new Date() < 0 ) {
                db.Tournament.update({ status: "closed" }, { where: { id: tournament.id } });

                /*const participations = await db.Participation.findAll({ where: { tournamentId: tournament.id } });
                const indexArray = [ ...Array(tournament.maxSize - tournament.currentSize).keys() ];
                shuffle( indexArray );

                participations.forEach(( participation, index) => {
                    db.Participation.update({ ladderRank: indexArray[index] }, { where: { id: participation.id } });
                });*/
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