const db = require( "../database/databaseConnection" );


const isTournamentOpen = async ( req, res, next ) => {
    try{
        const tournament = await db.Tournament.findOne({ where: { id: req.params.tournamentId } });

        if ( tournament.status === "open" )
            return next();
        else {
            req.flash( "error", "You can't edit tournament when it has started!" );
            res.redirect( "/tournaments/" + req.params.tournamentId );
        }
    } catch ( error ) {
        req.flash( "error", "Something went wrong..." );
        res.redirect( "/tournaments/" + req.params.tournamentId );
    }
}


module.exports = isTournamentOpen;