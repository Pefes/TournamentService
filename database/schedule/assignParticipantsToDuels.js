const db = require( "../databaseConnection" ),
    Sequelize = require( "sequelize" );


const getRandomIndex = ( min, max ) => {
    return Math.floor( Math.random() * ( max - min ) + min );
};


const assignParticipantsToDuels = async () => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );

    try {
        const tournaments = await db.Tournament.findAll({ where: { status: "readyForDuels" }, transaction: t, lock: true });

        for ( tournament of tournaments ) {
            let duels = await db.Duel.findAll({ 
                where: { tournamentId: tournament.id, stage: tournament.currentStage }, 
                raw: true, transaction: t });
            let participations = await db.Participation.findAll({ 
                where: { tournamentId: tournament.id, status: "in" }, 
                raw: true, 
                transaction: t,
                order: [[ "ladderRank", "ASC" ]] });
    
            let isOdd = participations.length % 2 === 1;
            let firstOpponent;
            let secondOpponent;
    
            if ( isOdd && participations.length > 0) {
                let randomIndex = getRandomIndex( 0, duels.length );
    
                for ( let [index, duel] of duels.entries() ) {
                    if ( index === randomIndex ) {
                        firstOpponent = participations.pop();
                        await db.Duel.update({
                            firstOpponent: firstOpponent.userId,
                            secondOpponent: null,
                            winner: firstOpponent.userId,
                            firstOpponentReply: firstOpponent.userId,
                            secondOpponentReply: firstOpponent.userId,
                            status: "closed"
                        }, { where: { id: duel.id }, transaction: t });
    
                    } else {
                        firstOpponent = participations.pop();
                        secondOpponent = participations.pop();
    
                        await db.Duel.update({
                            firstOpponent: firstOpponent.userId,
                            secondOpponent: secondOpponent.userId,
                        }, { where: { id: duel.id }, transaction: t });
                    }
                }
            } else if ( participations.length > 0 ) {
                for ( duel of duels ) {
                    firstOpponent = participations.pop();
                    secondOpponent = participations.pop();
    
                    await db.Duel.update({
                        firstOpponent: firstOpponent.userId,
                        secondOpponent: secondOpponent.userId
                    }, { where: { id: duel.id }, transaction: t });
                }
            }
    
            await db.Tournament.update({ status: "playing" }, { where: { id: tournament.id }, transaction: t });
        }

        await t.commit();
    } catch ( error ) {
        await t.rollback();
        console.log( "[assignParticipantsToDuels] Error occured: " + error );
    }

    console.log( "[assignParticipantsToDuels] Successfuly completed..." );
};


module.exports = assignParticipantsToDuels;