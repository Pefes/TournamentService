const db = require( "../database/databaseConnection" );


const isLoggedIn = ( req, res, next ) => {
    if ( req.isAuthenticated() )
        return next();
    else
        req.flash( "error", "First, you need to log in!" )
        res.redirect( "/login" );
};

const isNotLoggedIn = ( req, res, next ) => {
    if ( req.isAuthenticated() ) {
        req.flash( "error", "You are already logged in!" )
        res.redirect( "/tournaments/page/1" );
    }
    else
        next();
};

const isActiveAccount = async ( req, res, next ) => {
    const user = await db.User.findOne({ where: { email: req.body.email } });

    if ( !user )
        return next();
    else if ( user.active === 1 ) 
        return next();
    else {
        req.flash( "error", "Account is not activated!" );
        res.render( "./index/login.ejs" );
    }
}

module.exports = {
    isLoggedIn: isLoggedIn,
    isNotLoggedIn: isNotLoggedIn,
    isActiveAccount: isActiveAccount
};
