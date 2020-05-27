const cron = require( "node-cron" );

const assignParticipantsToDuels = require( "./assignParticipantsToDuels" ),
    checkDuelStatus = require( "./checkDuelStatus" ),
    checkIfRoundEnded = require( "./checkIfRoundEnded" ),
    checkIfTournamentEnded = require( "./checkIfTournamentEnded" ),
    checkTournamentStatus = require( "./checkTournamentStatus" ),
    createDuels = require( "./createDuels" );

const startScheduler = () => {
    cron.schedule( "*/10 * * * * *", checkTournamentStatus ).start();
    cron.schedule( "*/10 * * * * *", createDuels ).start();
    cron.schedule( "*/10 * * * * *", assignParticipantsToDuels ).start();
    cron.schedule( "*/5 * * * * *", checkIfRoundEnded ).start();
    cron.schedule( "*/3 * * * * *", checkDuelStatus ).start();
    cron.schedule( "*/5 * * * * *", checkIfTournamentEnded ).start();
}


module.exports = startScheduler;