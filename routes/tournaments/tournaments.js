const express = require( "express" ),
    router = express.Router(),
    db = require( "../../database/databaseConnection" ),
    multer = require( "multer" ),
    upload = multer({ dest: "./uploads/images" }),
    { isLoggedIn, isNotLoggedIn } = require( "../../utilities/passportUtilities" );

// show all tournaments
router.get("/tournaments", ( req, res ) => {
    
    res.render( "./tournaments/index.ejs" );
});

// create new tournament
router.post("/tournaments", isLoggedIn, upload.any( "images" ), ( req, res ) => {
    db.Tournament.create({
        ...req.body,
        ownerId: req.user.id
    })
    .then(tournament => {
        console.log( tournament.dataValues );
        const images = [];
        req.files.forEach(image => { 
            images.push({ tournamentId: tournament.dataValues.id, imageName: image.originalname });
        });

        db.Sponsor.bulkCreate( images )
        .then(() => {
            res.redirect( "/tournaments" );    
        })
        .catch(error => {
            console.log( "Error occured: " + error );
            req.flash( "error", "Could not create new tournament!" );
            res.redirect( "/tournaments/new" );
        });
    })
    .catch(error => {
        console.log( "Error occured: " + error );
        req.flash( "error", "Could not create new tournament!" );
        res.redirect( "/tournaments/new" );
    });
});

// get form for new tournament
router.get("/tournaments/new", isLoggedIn, ( req, res ) => {
    res.render( "./tournaments/new.ejs" );
});


module.exports = router;