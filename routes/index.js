const express = require( "express" ),
    router = express.Router(),
    bcrypt = require( "bcrypt" ),
    passport = require( "passport" ),
    db = require( "../database/databaseConnection" ),
    { isLoggedIn, isNotLoggedIn } = require( "../utilities/passportUtilities" );


router.get("/", isLoggedIn, ( req, res ) => {
    res.render( "./index/home.ejs" );
});

router.get("/register", isNotLoggedIn, ( req, res ) => {
    res.render( "./index/register.ejs" );
});

router.post("/register", isNotLoggedIn, async ( req, res ) => {
    try {
        const hashedPassword = await bcrypt.hash( req.body.password, 10 );

        db.User.create({
            ...req.body,
            password: hashedPassword
        })
        .then(user => {
            console.log( user.dataValues );
        });

        res.redirect( "/login" );
    }
    catch {
        res.redirect( "/register" );
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