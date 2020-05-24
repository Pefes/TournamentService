const express = require( "express" ),
    router = express.Router(),
    bcrypt = require( "bcrypt" ),
    passport = require( "passport" ),
    db = require( "../database/databaseConnection" ),
    { isLoggedIn, isNotLoggedIn } = require( "../utilities/passportUtilities" ),
    userInputValidation = require( "../utilities/userInputValidation" );



router.get("/", isLoggedIn, ( req, res ) => {
    res.render( "./index/home.ejs" );
});


router.get("/register", isNotLoggedIn, ( req, res ) => {
    res.render( "./index/register.ejs" );
});


router.post("/register", isNotLoggedIn, userInputValidation, async ( req, res ) => {
    try {
        const hashedPassword = await bcrypt.hash( req.body.password, 10 );

        db.User.create({
            ...req.body,
            password: hashedPassword
        })

        res.redirect( "/login" );
    }
    catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }    
});


router.get("/login", isNotLoggedIn, ( req, res ) => {
    res.render( "./index/login.ejs" );
});


router.post("/login", isNotLoggedIn, passport.authenticate("local", { 
    successRedirect: "/", 
    failureRedirect: "/login", 
    failureFlash: true 
}));


router.delete("/logout", isLoggedIn, ( req, res ) => {
    req.logOut();
    res.redirect( "/login" );
})


module.exports = router;