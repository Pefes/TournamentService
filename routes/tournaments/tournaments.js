const express = require( "express" ),
    router = express.Router(),
    db = require( "../../database/databaseConnection" ),
    multer = require( "multer" ),
    upload = multer({ dest: "./uploads/images" }),
    { isLoggedIn, isNotLoggedIn } = require( "../../utilities/passportUtilities" );

// show all tournaments
router.get("/tournaments", async ( req, res ) => {
    const tournaments = await db.Tournament.findAll();
    const sponsors = await db.Sponsor.findAll();
    res.render( "./tournaments/index.ejs", { tournaments: tournaments, sponsors: sponsors } );
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

// get single tournament
router.get("/tournaments/:id", async ( req, res ) => {
    const tournament = await db.Tournament.findOne({ where: { id: req.params.id } });

    res.render( "./tournaments/show.ejs", { tournament: tournament } );
});

router.post("/tournaments/:id/signup", isLoggedIn, async ( req, res ) => {
    const t = await db.sequelize.transaction();

    try {
        const { currentSize, status } = await db.Tournament.findOne({ where: { id: req.params.id } }, { transaction: t });
        
        if ( currentSize > 0 && status === "open" ) {
            await db.Participation.create({ tournamentId: req.params.id, userId: req.user.id }, { transaction: t });
            await db.Tournament.update({ currentSize: currentSize - 1 }, { where: { id: req.params.id } });
        }

        await t.commit();
        res.redirect( "/tournaments/" + req.params.id );
    }
    catch ( error ) {
        await t.rollback();
        res.redirect( "/tournaments/" + req.params.id );
    }
});


module.exports = router;