const express = require( "express" ),
    router = express.Router(),
    db = require( "../../database/databaseConnection" ),
    multer = require( "multer" ),
    upload = multer({ dest: "./uploads/images" }),
    { isLoggedIn, isNotLoggedIn } = require( "../../utilities/passportUtilities" );


// show all tournaments
router.get("/tournaments/page/:currentPage", async ( req, res ) => {
    const tournaments = await db.Tournament.findAll();
    const sponsors = await db.Sponsor.findAll();
    const maxPage = Math.ceil( tournaments.length / 10 );
    const currentPage = parseInt( req.params.currentPage, 10);

    res.render("./tournaments/index.ejs", { 
        tournaments: tournaments, 
        sponsors: sponsors,
        maxPage: maxPage,
        currentPage: currentPage
     });
});


// create new tournament
router.post("/tournaments", isLoggedIn, upload.any( "images" ), ( req, res ) => {
    db.Tournament.create({
        ...req.body,
        ownerId: req.user.id,
        currentSize: req.body.maxSize
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
    const duels = await db.Duel.findAll({ where: { tournamentId: tournament.id } });
    const sponsors = [
        "/images/sponsors/1.png",
        "/images/sponsors/1.png",
        "/images/sponsors/1.png",
        "/images/sponsors/1.png",
        "/images/sponsors/11.png",
        "/images/sponsors/1.png",
        "/images/sponsors/1.png",
        "/images/sponsors/1.png",
        "/images/sponsors/Untitled.png"
    ];

    res.render( "./tournaments/show.ejs", { tournament: tournament, duels: duels, sponsors: sponsors } );
});


// sign up for tournament
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


// pick a winner in duel in tournament
router.post("/tournaments/:tournamentId/duels/:duelId/pickWinner/:winnerId", isLoggedIn, async ( req, res ) => {
    const duel = await db.Duel.findOne({ where: { id: req.params.duelId, tournamentId: req.params.tournamentId } });

    if ( duel.firstOpponent === req.user.id ) 
        await db.Duel.update({ firstOpponentReply: req.params.winnerId }, { where: { id: duel.id } });
    else 
        await db.Duel.update({ secondOpponentReply: req.params.winnerId }, { where: { id: duel.id } });

    res.redirect( "/tournaments/" + req.params.tournamentId );
});


module.exports = router;