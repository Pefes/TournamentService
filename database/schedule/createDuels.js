const db = require( "../databaseConnection" );


const createDuels = async () => {
    const tournaments = await db.Tournament.findAll({ where: { status: "closed" }, raw: true });

    tournaments.forEach(async tournament => {
        const currentSize = tournament.currentSize;
        let stage = 0;
        for ( let i = Math.ceil( currentSize / 2 ); i >= 1; i /= 2) {
            i = Math.ceil( i );
            stage += 1;

            for (let j = 0; j < i; j++ ) {
                db.Duel.create({
                    tournamentId: tournament.id,
                    stage: stage
                })
            }
        }

        await db.Tournament.update({ status: "readyForDuels", maxStage: stage, currentStage: 1 }, { where: { id: tournament.id } });
    });
}

module.exports = createDuels;