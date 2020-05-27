const db = require( "../databaseConnection" );
const { Op } = require( "sequelize" );
const Sequelize = require( "sequelize" );


const checkDuelStatus = async () => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );

    try {
        const duels = await db.Duel.findAll({ where: { 
            status: "open", 
            firstOpponentReply: { [Op.ne]: null },
            secondOpponentReply: { [Op.ne]: null }
        }, transaction: t, raw: true });
    
        for ( duel of duels ) {
            if ( duel.firstOpponentReply === duel.secondOpponentReply ) {
                await db.Duel.update({
                    winner: duel.secondOpponentReply,
                    status: "closed"
                }, { where: { id: duel.id }, transaction: t });
    
                if ( duel.firstOpponent === duel.firstOpponentReply )
                    await db.Participation.update({ status: "out" }, { where: { userId: duel.secondOpponent }, transaction: t });
                else
                    await db.Participation.update({ status: "out" }, { where: { userId: duel.firstOpponent }, transaction: t });
            }
            else {
                await db.Duel.update({
                    firstOpponentReply: null,
                    secondOpponentReply: null
                }, { where: { id: duel.id }, transaction: t });
            }
        }

        await t.commit();
    } catch ( error ) {
        await t.rollback();
        console.log( "[checkDuelStatus] Error occured: " + error );
    }
};


module.exports = checkDuelStatus;