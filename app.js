const express = require( "express" ),
    app = express(),
    bodyParser = require( "body-parser" ),
    methodOverride = require( "method-override" ),
    passport = require( "passport" ),
    initializePassport = require( "./utilities/passportConfig" ),
    flash = require( "express-flash" ),
    session = require( "express-session" ),
    checkTournamentStatus = require( "./middleware/checkTournamentStatus" ),
    createLadder = require( "./middleware/createLadder" ),
    indexRoutes = require( "./routes" ),
    tournamentRoutes = require( "./routes/tournaments/tournaments" );


// settings
initializePassport( passport );
app.set( "view engine", "ejs" );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( methodOverride( "_method" ) );
app.use( flash() );
app.use( session({
    secret: "Really good tournament app",
    resave: false,
    saveUninitialized: false
}) );
app.use( passport.initialize() );
app.use( passport.session() );


// custom middleware
app.use( checkTournamentStatus );
app.use( createLadder );


//add routes
app.use( indexRoutes );
app.use( tournamentRoutes );


app.listen(3000, () => {
    console.log( "Server is running on port: 3000" );
});