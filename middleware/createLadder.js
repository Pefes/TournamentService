const db = require( "../database/databaseConnection" );


const createLadder = async ( req, res, next ) => {
    const tournaments = await db.Tournament.findAll({ where: { status: "closed" }, raw: true });

    tournaments.forEach(async tournament => {
        //let participations = await db.Participation.findAll({ where: { tournamentId: tournament.id }, raw: true, order: [[ "ladderRank", "ASC" ]] });

        const currentSize = tournament.currentSize;
        for ( let i = currentSize; i >= 1; Math.ceil( i /= 2 )) {
            for (let j = 0; j < i; j++ ) {
                db.Duel.create({
                    tournamentId: tournament.id,
                })
            }
        }


        /*for ( let i = 0; i < participations.length; i += 2 ) {
            if ( i + 1 < participations.length ) {
                db.Duel.create({
                    tournamentId: tournament.id,
                    firstOpponent: participations[i].userId,
                    secondOpponent: participations[i + 1].userId,
                });
            }
        }

        if ( participations.length % 2 !== 0 ) {
            db.Duel.create({
                tournamentId: tournament.id,
                firstOpponent: participations[participations.length - 1].userId,
                secondOpponent: null,
                firstOpponentReply: participations[participations.length - 1].userId,
                secondOpponentReply: participations[participations.length - 1].userId,
                winner: participations[participations.length - 1].userId,
            });
        }*/

        await db.Tournament.update({ status: "createdDuels" }, { where: { id: tournament.id } });
    });

    return next();
}

module.exports = createLadder;