const db = require( "../database/databaseConnection" );


const getRandomIndex = ( min, max ) => {
    return Math.floor( Math.random() * ( max - min ) + min );
};


const assignParticipantsToDuels = async ( req, res, next ) => {
    const tournaments = await db.Tournament.findAll({ where: { status: "readyForDuels" } });

    tournaments.forEach(async tournament => {
        let duels = await db.Duel.findAll({ 
            where: { tournamentId: tournament.id, stage: tournament.currentStage }, 
            raw: true });
        let participations = await db.Participation.findAll({ 
            where: { tournamentId: tournament.id, status: "in" }, 
            raw: true, 
            order: [[ "ladderRank", "ASC" ]] });

        const isOdd = participations.length % 2 === 1;
        let firstOpponent;
        let secondOpponent;

        if ( isOdd && participations.length > 0) {
            const randomIndex = getRandomIndex( 0, participations.length );

            duels.forEach(( duel, index ) => {
                if ( index === randomIndex ) {
                    firstOpponent = participations.pop();
                    db.Duel.update({
                        firstOpponent: firstOpponent.userId,
                        secondOpponent: null,
                        winner: firstOpponent.userId,
                        firstOpponentReply: firstOpponent.userId,
                        secondOpponentReply: firstOpponent.userId,
                        status: "closed"
                    }, { where: { id: duel.id } });

                } else {
                    firstOpponent = participations.pop();
                    secondOpponent = participations.pop();

                    db.Duel.update({
                        firstOpponent: firstOpponent.userId,
                        secondOpponent: secondOpponent.userId,
                    }, { where: { id: duel.id } });
                }
            });
        } else if ( participations.length > 0 ) {
            duels.forEach(duel => {
                firstOpponent = participations.pop();
                secondOpponent = participations.pop();

                db.Duel.update({
                    firstOpponent: firstOpponent.userId,
                    secondOpponent: secondOpponent.userId
                }, { where: { id: duel.id } })
            });
        }

        db.Tournament.update({ status: "playing" }, { where: { id: tournament.id } });
    });
    
    next();
};


module.exports = assignParticipantsToDuels;