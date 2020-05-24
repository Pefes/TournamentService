const tournamentInputValidation = ( req, res, next ) => {
    if ( req.body.name.length === 0 ) {
        req.flash( "error", "Tournament's name is required!" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    } else if ( req.body.name.length > 100 ) {
        req.flash( "error", "Tournament's name is too long! (max 100 characters)" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    }
};


module.exports = tournamentInputValidation;