const isNumber = ( variable ) => { 
    return !isNaN( parseFloat( variable ) ) && !isNaN( variable - 0 ) ;
}


const tournamentInputValidation = ( req, res, next ) => {
    if ( req.body.name ) {
        req.flash( "error", "Tournament's name is required!" );
        res.render( "./tournaments/new.ejs" );
    } else if ( req.body.name.length > 100 ) {
        req.flash( "error", "Tournament's name is too long! (max 100 characters)" );
        res.render( "./tournaments/new.ejs" );
    }

    if ( req.body.branch ) {
        req.flash( "error", "Tournament's branch is required!" );
        res.render( "./tournaments/new.ejs" );
    } else if ( req.body.branch.length > 100 ) {
        req.flash( "error", "Tournament's branch is too long! (max 100 characters)" );
        res.render( "./tournaments/new.ejs" );
    }

    if ( req.body.size ) {
        req.flash( "error", "Tournament's size is required!" );
        res.render( "./tournaments/new.ejs" );
    } else if ( req.body.size.length > 100 ) {
        req.flash( "error", "Tournament's name is too long! (max 100 characters)" );
        res.render( "./tournaments/new.ejs" );
    }

    return next();    
};


module.exports = tournamentInputValidation;