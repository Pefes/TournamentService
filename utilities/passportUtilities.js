const isLoggedIn = ( req, res, next ) => {
    if ( req.isAuthenticated() )
        return next();
    else
        res.redirect( "/login" );
};

const isNotLoggedIn = ( req, res, next ) => {
    if ( req.isAuthenticated() )
        res.redirect( "/" );
    else
        next();
};

module.exports = {
    isLoggedIn: isLoggedIn,
    isNotLoggedIn: isNotLoggedIn
};
