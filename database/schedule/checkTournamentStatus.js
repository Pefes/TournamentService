const db = require( "../databaseConnection" ),
    Sequelize = require( "sequelize" );


const checkTournamentStatus = async () => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );

    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "open" }, raw: true, transaction: t });

        for ( tournament of tournaments ) {
            if ( new Date(tournament.startDate) - new Date() < 0 ) {
                await db.Tournament.update({ status: "closed" }, { where: { id: tournament.id }, transaction: t });
            }
        }

        await t.commit();
    }
    catch ( error ) {
        await t.rollback();
        console.log( "Error occured: " + error );
    }
}


module.exports = checkTournamentStatus;