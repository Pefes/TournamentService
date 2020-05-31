const db = require( "../databaseConnection" ),
    Sequelize = require( "sequelize" );


const checkIfRoundEnded = async () => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );

    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "playing" }, raw: true, transaction: t, lock: true });

        for ( tournament of tournaments ) {
            let duelsAll = await db.Duel.findAll({ where: { tournamentId: tournament.id, stage: tournament.currentStage }, raw: true, transaction: t, lock: true });
            let duelsClosed = await db.Duel.findAll({ where: { tournamentId: tournament.id, status: "closed", stage: tournament.currentStage }, raw: true, transaction: t, lock: true });
    
            if ( duelsClosed.length === duelsAll.length ) {
                if ( tournament.maxStage === tournament.currentStage )
                    await db.Tournament.update({ status: "ended" }, { where: { id: tournament.id }, transaction: t });
                else
                    await db.Tournament.update({ status: "readyForDuels", currentStage: tournament.currentStage + 1 }, { where: { id: tournament.id }, transaction: t });
            }    
        }

        await t.commit();
    } catch ( error ) {
        await t.rollback();
        console.log( "[checkIfRoundEnded] Error occured: " + error );
    }

    console.log( "[checkIfRoundEnded] Successfuly completed..." );
};


module.exports = checkIfRoundEnded;