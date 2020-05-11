const express = require( "express" ),
    router = express.Router(),
    db = require( "../../database/databaseConnection" ),
    { isLoggedIn, isNotLoggedIn } = require( "../../utilities/passportUtilities" );


router.get("/tournaments", ( req, res ) => {
    res.send( "xD" );
});

router.post("/tournaments", isLoggedIn, ( req, res ) => {
    db.Tournament.create({
        ...req.body,
        ownerId: req.user.id
    }).then(tournament => {
        console.log( tournament.dataValues );
        res.redirect( "/tournaments" );
    })
});

router.get("/tournaments/new", isLoggedIn, ( req, res ) => {
    res.render( "./tournaments/new.ejs" );
});


module.exports = router;