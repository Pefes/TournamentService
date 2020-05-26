const express = require( "express" ),
    router = express.Router(),
    bcrypt = require( "bcrypt" ),
    passport = require( "passport" ),
    db = require( "../database/databaseConnection" ),
    { isLoggedIn, isNotLoggedIn, isActiveAccount } = require( "../utilities/passportUtilities" ),
    sendEmail = require( "../utilities/sendEmail" ),
    userInputValidation = require( "../utilities/userInputValidation" ),
    resetPasswordInputValidation = require( "../utilities/resetPasswordInputValidation" );



router.get("/", isLoggedIn, ( req, res ) => {
    res.render( "./index/home.ejs" );
});


router.get("/register", isNotLoggedIn, ( req, res ) => {
    res.render( "./index/register.ejs" );
});


router.post("/register", isNotLoggedIn, async ( req, res ) => {
    try {
        const validationResponse = await userInputValidation( req.body );

        if ( validationResponse.validated ) {
            const hashedPassword = await bcrypt.hash( req.body.password, 10 );
    
            const createdUser = await db.User.create({
                ...req.body,
                password: hashedPassword
            })
    
            sendEmail.verification( req.body.email, req.body.name, createdUser.id );

            req.flash( "success", "Successfully signed up! Now you need to activate your account!" );
            res.redirect( "/login" );
        } else {
            req.flash( "error", validationResponse.errorMessage );
            res.render( "./index/register.ejs", { previousForm: req.body } );
        }
    } catch ( error ) {
        console.log( "Error occured: " + error );
        req.flash( "error", "Something went wrong..." );
        res.render( "./index/register.ejs" );
    }    
});


router.get("/verify/:key", async ( req, res ) => {
    try {
        const verification = await db.VerificationKey.findOne({ where: { key: req.params.key }, raw: true });

        if ( verification ) {
            db.User.update({ active: 1 }, { where: { id: verification.userId } });
            db.VerificationKey.destroy({ where: { userId: verification.userId } });

            req.flash( "success", "Account activation done!" )
            res.render( "./index/login.ejs" );
        } else {
            res.render( "./index/errorHandler.ejs" );
        }
    } catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


router.post("/resetPassword", ( req, res ) => {
    try {
        sendEmail.resetPassword( req.body.email );
        res.redirect( "/login" );
    } catch ( error ) {
        res.redirect( "/login" );
    }
});


router.get("/resetPassword/:key", async ( req, res ) => {
    try {
        const resetPasswordKey = await db.ResetPasswordKey.findOne({ where: { key: req.params.key } });

        if ( resetPasswordKey ) {
            res.render( "./index/resetPassword.ejs", { key: req.params.key, userId: resetPasswordKey.userId } );
        } else {
            res.render( "./index/errorHandler.ejs" );
        }
    } catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


router.post("/resetPassword/:key/user/:userId", async ( req, res ) => {
    try {
        const validationResponse = resetPasswordInputValidation( req.body );

        if ( validationResponse.validated ) {
            const resetPasswordKey = await db.ResetPasswordKey.findOne({ where: { key: req.params.key } });

            if ( resetPasswordKey ) {
                const hashedPassword = await bcrypt.hash( req.body.newPassword, 10 );
                await db.User.update({ password: hashedPassword }, { where: { id: resetPasswordKey.userId } });
    
                req.flash( "success", "Successfully changed password!" );
                res.redirect( "/login" );
            } else {
                console.log( "Error occured: wrong key!" );
                res.render( "./index/errorHandler.ejs" );
            }
        } else {
            req.flash( "error", validationResponse.errorMessage );
            res.redirect( "/resetPassword/" + req.params.key );
        }
    } catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


router.get("/login", isNotLoggedIn, ( req, res ) => {
    res.render( "./index/login.ejs" );
});


router.post("/login", isNotLoggedIn, isActiveAccount, passport.authenticate("local", { 
    successRedirect: "/", 
    successFlash: true,
    failureRedirect: "/login", 
    failureFlash: true 
}));


router.delete("/logout", isLoggedIn, ( req, res ) => {
    req.logOut();
    res.redirect( "/login" );
})


module.exports = router;