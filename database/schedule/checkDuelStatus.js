const db = require( "../databaseConnection" );
const { Op } = require( "sequelize" );


const checkDuelStatus = async () => {
    const duels = await db.Duel.findAll({ where: { 
        status: "open", 
        firstOpponentReply: { [Op.ne]: null },
        secondOpponentReply: { [Op.ne]: null }
    }});

    duels.forEach(duel => {
        if ( duel.firstOpponentReply === duel.secondOpponentReply ) {
            db.Duel.update({
                winner: duel.secondOpponentReply,
                status: "closed"
            }, { where: { id: duel.id } });

            if ( duel.firstOpponent === duel.firstOpponentReply )
                db.Participation.update({ status: "out" }, { where: { userId: duel.secondOpponent } });
            else
                db.Participation.update({ status: "out" }, { where: { userId: duel.firstOpponent } });
        }
        else {
            db.Duel.update({
                firstOpponentReply: null,
                secondOpponentReply: null
            }, { where: { id: duel.id } });
        }
    });
};


module.exports = checkDuelStatus;