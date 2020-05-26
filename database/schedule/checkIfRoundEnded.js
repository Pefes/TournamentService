const db = require( "../databaseConnection" );


const checkIfRoundEnded = async () => {
    const tournaments = await db.Tournament.findAll({ where: { status: "playing" }, raw: true });

    tournaments.forEach( async tournament => {
        let duelsAll = await db.Duel.findAll({ where: { tournamentId: tournament.id, stage: tournament.currentStage }, raw: true });
        let duelsClosed = await db.Duel.findAll({ where: { tournamentId: tournament.id, status: "closed", stage: tournament.currentStage }, raw: true });

        if ( duelsClosed.length === duelsAll.length ) {
            if ( tournament.maxStage === tournament.currentStage )
                db.Tournament.update({ status: "ended" }, { where: { id: tournament.id } });
            else
                db.Tournament.update({ status: "readyForDuels", currentStage: tournament.currentStage + 1 }, { where: { id: tournament.id } });
        }    
    });
};


module.exports = checkIfRoundEnded;