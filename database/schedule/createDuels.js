const db = require( "../databaseConnection" ),
    Sequelize = require( "sequelize" );


const createDuels = async () => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );
    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "closed" }, raw: true, transaction: t, lock: true });

        for ( tournament of tournaments ) {
            const currentSize = tournament.currentSize;
            let stage = 0;

            for ( let i = Math.ceil( currentSize / 2 ); i >= 1; i /= 2) {
                if ( i > 1 )
                    i = Math.ceil( i );
                stage += 1;
    
                for (let j = 0; j < i; j++ ) {
                    await db.Duel.create({
                        tournamentId: tournament.id,
                        stage: stage
                    }, { transaction: t });
                }
            }
    
            await db.Tournament.update({ status: "readyForDuels", maxStage: stage, currentStage: 1 }, { where: { id: tournament.id }, transaction: t });
        }

        await t.commit();
    } catch ( error ) {
        await t.rollback();
        console.log( "[createDuels] Error occured: " + error );
    }

    console.log( "[createDuels] Successfuly completed..." );
}

module.exports = createDuels;