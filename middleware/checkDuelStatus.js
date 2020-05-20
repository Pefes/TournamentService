const db = require( "../database/databaseConnection" );
const { Op } = require( "sequelize" );


const checkDuelStatus = async ( req, res, next ) => {
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
        }
        else {
            db.Duel.update({
                firstOpponentReply: null,
                secondOpponentReply: null
            }, { where: { id: duel.id } });
        }
    });

    return next();
};


module.exports = checkDuelStatus;