const db = require( "../databaseConnection" ),
    Sequelize = require( "sequelize" );


const checkTournamentStatus = async () => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );

    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "open" }, raw: true, transaction: t, lock: true });

        for ( tournament of tournaments ) {
            if ( new Date(tournament.startDate) - new Date() < 0 ) {
                if ( tournament.currentSize >= 2 )
                    await db.Tournament.update({ status: "closed" }, { where: { id: tournament.id }, transaction: t });
                else
                    await db.Tournament.update({ status: "cancelled" }, { where: { id: tournament.id }, transaction: t });
            }
        }

        await t.commit();
    }
    catch ( error ) {
        await t.rollback();
        console.log( "[checkTournamentStatus] Error occured: " + error );
    }

    console.log( "[checkTournamentStatus] Successfuly completed..." );
}


module.exports = checkTournamentStatus;