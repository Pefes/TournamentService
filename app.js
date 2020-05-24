const express = require( "express" ),
    app = express(),
    bodyParser = require( "body-parser" ),
    methodOverride = require( "method-override" ),
    passport = require( "passport" ),
    initializePassport = require( "./utilities/passportConfig" ),
    flash = require( "express-flash" ),
    session = require( "express-session" ),
    checkTournamentStatus = require( "./middleware/checkTournamentStatus" ),
    createDuels = require( "./middleware/createDuels" ),
    assignParticipantsToDuels = require( "./middleware/assignParticipantsToDuels.js" ),
    checkIfRoundEnded = require( "./middleware/checkIfRoundEnded" ),
    checkDuelStatus = require( "./middleware/checkDuelStatus" ),
    checkIfTournamentEnded = require( "./middleware/checkIfTournamentEnded" ),
    localsInit = require( "./middleware/localsInit" ),
    indexRoutes = require( "./routes" ),
    tournamentRoutes = require( "./routes/tournaments/tournaments" );


// settings
initializePassport( passport );
app.set( "view engine", "ejs" );
app.use( express.static( __dirname + "/public" ) );
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
app.use( localsInit );
app.use( checkTournamentStatus );
app.use( createDuels );
app.use( assignParticipantsToDuels );
app.use( checkIfRoundEnded );
app.use( checkDuelStatus );
app.use( checkIfTournamentEnded );


//add routes
app.use( indexRoutes );
app.use( tournamentRoutes );


app.listen(3000, () => {
    console.log( "Server is running on port: 3000" );
});