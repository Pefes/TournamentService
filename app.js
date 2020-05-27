if ( process.env.NODE_ENV !== "production" )
    require( "dotenv" ).config();

const express = require( "express" ),
    app = express(),
    bodyParser = require( "body-parser" ),
    methodOverride = require( "method-override" ),
    passport = require( "passport" ),
    initializePassport = require( "./utilities/passportConfig" ),
    flash = require( "express-flash" ),
    session = require( "express-session" ),
    scheduler = require( "./database/schedule/scheduler" ),
    localsInit = require( "./middleware/localsInit" ),
    removeFiles = require( "./utilities/removeFiles" ),
    indexRoutes = require( "./routes" ),
    tournamentRoutes = require( "./routes/tournaments/tournaments" ),
    wrongRoutes = require( "./routes/wrongRoutes" );


// settings
removeFiles( "public/images/tournaments" );
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
scheduler();


// custom middleware
app.use( localsInit );


//add routes
app.use( indexRoutes );
app.use( tournamentRoutes );
app.use( wrongRoutes );


app.listen(3000, () => {
    console.log( "Server is running on port: 3000" );
});