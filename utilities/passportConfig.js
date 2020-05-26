const LocalStrategy = require( "passport-local" ).Strategy,
    bcrypt = require( "bcrypt" ),
    db = require( "../database/databaseConnection" );


const initialize = ( passport ) => {
    const authenticateUser = async ( email, password, done ) => {
        try {
            const user = await db.User.findOne({ where: { email: email } });

            if ( user == null )
                return done( null, false, { message: "No user with that email!" } );
                
            if ( await bcrypt.compare( password, user.password ) ) 
                return done( null, user, { message: "Successfully logged in!" } );
            else
                return done( null, false, { message: "Password incorrect!" } );
        }
        catch ( error ) {
            return done( error );
        }
    };

    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
    passport.serializeUser(( user, done ) => done( null, user.id ));
    passport.deserializeUser( async ( userId, done ) => {
        try {
            const user = await db.User.findOne({ where: { id: userId } });
            return done( null, user );
        }
        catch ( error ) {
            return done( error );
        }
    });
};

module.exports = initialize;