const db = require( "../databaseConnection" );


const checkIfTournamentEnded = async () => {
    const tournaments = await db.Tournament.findAll({ where: { status: "ended" }, raw: true });

    tournaments.forEach(async tournament => {
        let lastDuel = await db.Duel.findOne({ where: { tournamentId: tournament.id, stage: tournament.maxStage }, raw: true });
        db.Tournament.update({ winnerId: lastDuel.winner, status: "gotWinner" }, { where: { id: tournament.id } });
    });
};


module.exports = checkIfTournamentEnded;