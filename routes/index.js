const express = require( "express" ),
    router = express.Router(),
    bcrypt = require( "bcrypt" ),
    passport = require( "passport" ),
    db = require( "../database/databaseConnection" ),
    { isLoggedIn, isNotLoggedIn, isActiveAccount } = require( "../utilities/passportUtilities" ),
    sendVerificationEmail = require( "../utilities/sendVerificationEmail" ),
    userInputValidation = require( "../utilities/userInputValidation" );



router.get("/", isLoggedIn, ( req, res ) => {
    res.render( "./index/home.ejs" );
});


router.get("/register", isNotLoggedIn, ( req, res ) => {
    res.render( "./index/register.ejs" );
});


router.post("/register", isNotLoggedIn, async ( req, res ) => {
    const validationResponse = await userInputValidation( req.body );

    if ( validationResponse.validated ) {
        try {
            const hashedPassword = await bcrypt.hash( req.body.password, 10 );
    
            const createdUser = await db.User.create({
                ...req.body,
                password: hashedPassword
            })
    
            sendVerificationEmail( req.body.email, req.body.name, createdUser.id );
            res.redirect( "/login" );
        }
        catch ( error ) {
            console.log( "Error occured: " + error );
            res.render( "./index/errorHandler.ejs" );
        }    
    } else {
        req.flash( "error", validationResponse.errorMessage );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    }
});


router.get("/verify/:key", async ( req, res ) => {
    const verification = await db.AccountVerification.findOne({ where: { key: req.params.key }, raw: true });

    if ( verification ) {
        db.User.update({ active: 1 }, { where: { id: verification.userId } });
        res.render( "./index/login.ejs" );
    } else {
        res.render( "./index/errorHandler.ejs" );
    }
});


router.get("/login", isNotLoggedIn, ( req, res ) => {
    res.render( "./index/login.ejs" );
});


router.post("/login", isNotLoggedIn, isActiveAccount, passport.authenticate("local", { 
    successRedirect: "/", 
    failureRedirect: "/login", 
    failureFlash: true 
}));


router.delete("/logout", isLoggedIn, ( req, res ) => {
    req.logOut();
    res.redirect( "/login" );
})


module.exports = router;