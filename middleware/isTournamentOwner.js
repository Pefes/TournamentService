const db = require( "../database/databaseConnection" );


const isTournamentOwner = async ( req, res, next ) => {
    const tournament = await db.Tournament.findOne({ where: { id: req.params.tournamentId }, raw: true });

    if ( req.user.id === tournament.ownerId )
        return next();
    else
        res.render( "./index/errorHandler.ejs" );
}


module.exports = isTournamentOwner;