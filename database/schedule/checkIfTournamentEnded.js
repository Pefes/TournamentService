const db = require( "../databaseConnection" ),
    Sequelize = require( "sequelize" );


const checkIfTournamentEnded = async () => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );

    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "ended" }, raw: true, transaction: t });

        for ( tournament of tournaments ) {
            let lastDuel = await db.Duel.findOne({ where: { tournamentId: tournament.id, stage: tournament.maxStage }, raw: true, transaction: t });
            await db.Tournament.update({ winnerId: lastDuel.winner, status: "gotWinner" }, { where: { id: tournament.id }, transaction: t });
        }

        await t.commit();
    } catch ( error ) {
        await t.rollback();
        console.log( "Error occured: " + error );
    }
};


module.exports = checkIfTournamentEnded;