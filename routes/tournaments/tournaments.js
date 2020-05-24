const express = require( "express" ),
    router = express.Router(),
    db = require( "../../database/databaseConnection" ),
    { Op } = require( "sequelize" ),
    multer = require( "multer" ),
    upload = multer({ dest: "./uploads/temp" }),
    move = require( "../../utilities/moveFiles" ),
    getAllFiles = require( "../../utilities/getAllFiles" ),
    { isLoggedIn, isNotLoggedIn } = require( "../../utilities/passportUtilities" );


// show all tournaments
router.get("/tournaments/page/:currentPage", async ( req, res ) => {
    const tournaments = await db.Tournament.findAll({ raw: true });
    const sponsors = await db.Sponsor.findAll({ raw: true });
    const maxPage = Math.ceil( tournaments.length / 10 );
    const currentPage = parseInt( req.params.currentPage, 10);
    const tournamentsWithAvatars = [];

    tournaments.forEach(tournament => {
        try {
            let avatar = getAllFiles("public/images/" + tournament.id + "/avatar/")[0];
            console.log("/images/" + tournament.id + "/avatar/" + avatar);
            tournamentsWithAvatars.push({ 
                ...tournament, 
                avatar: "/images/" + tournament.id + "/avatar/" + avatar
            });
        } catch ( error ) {
            console.log("No avatar image");
            tournamentsWithAvatars.push( tournament );
        }
    });

    res.render("./tournaments/index.ejs", { 
        tournaments: tournamentsWithAvatars, 
        sponsors: sponsors,
        maxPage: maxPage,
        currentPage: currentPage
     });
});

// show owned tournaments
router.get("/tournaments/owned/page/:currentPage", isLoggedIn, async ( req, res ) => {
    const tournaments = await db.Tournament.findAll({ where: { ownerId: req.user.id }, raw: true });
    const maxPage = Math.ceil( tournaments.length / 10 );
    const currentPage = parseInt( req.params.currentPage, 10);
    const tournamentsWithAvatars = [];

    tournaments.forEach(tournament => {
        try {
            let avatar = getAllFiles("public/images/" + tournament.id + "/avatar/")[0];
            console.log("/images/" + tournament.id + "/avatar/" + avatar);
            tournamentsWithAvatars.push({ 
                ...tournament, 
                avatar: "/images/" + tournament.id + "/avatar/" + avatar
            });
        } catch ( error ) {
            console.log("No avatar image");
            tournamentsWithAvatars.push( tournament );
        }
    });

    res.render("./tournaments/index.ejs", { 
        tournaments: tournamentsWithAvatars, 
        maxPage: maxPage,
        currentPage: currentPage
     });
});

// show signed up tournaments
router.get("/tournaments/signedUp/page/:currentPage", async ( req, res ) => {
    const participations = db.Participation.findAll({ where: { 
        [Op.or]: [
            { firstOpponent: req.user.id },
            { secondOpponent: req.user.id }
        ]
    }});


    const tournaments = await db.Tournament.findAll({ raw: true });
    const maxPage = Math.ceil( tournaments.length / 10 );
    const currentPage = parseInt( req.params.currentPage, 10);
    const tournamentsWithAvatars = [];

    tournaments.forEach(tournament => {
        try {
            let avatar = getAllFiles("public/images/" + tournament.id + "/avatar/")[0];
            console.log("/images/" + tournament.id + "/avatar/" + avatar);
            tournamentsWithAvatars.push({ 
                ...tournament, 
                avatar: "/images/" + tournament.id + "/avatar/" + avatar
            });
        } catch ( error ) {
            console.log("No avatar image");
            tournamentsWithAvatars.push( tournament );
        }
    });

    res.render("./tournaments/index.ejs", { 
        tournaments: tournamentsWithAvatars, 
        maxPage: maxPage,
        currentPage: currentPage
     });
});


// create new tournament
router.post("/tournaments", isLoggedIn, upload.any( "images" ), ( req, res ) => {
    db.Tournament.create({
        ...req.body,
        ownerId: req.user.id,
        currentSize: 0
    })
    .then(tournament => {
        req.files.forEach(( file, index ) => {
            if ( index === 0 )
                move( file.path, "public/images/" + tournament.id + "/avatar/", file.filename );
            else
                move( file.path, "public/images/" + tournament.id + "/sponsors/", file.filename );
        });

        res.redirect( "/tournaments/page/1" );
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
    const images = getAllFiles("public/images/" + tournament.id + "/sponsors/");
    const sponsors = [];
    let avatar = "";

    images.forEach(image => {
        sponsors.push( "/images/" + tournament.id + "/sponsors/" + image );
    });

    try {
        const avatarImage = getAllFiles( "public/images/" + tournament.id + "/avatar/" )[0]; 
        avatar = "/images/" + tournament.id + "/avatar/" + avatarImage;
    } catch ( error ) {
        console.log( "No avatar image" );
    }
    
    tournament.startDate = tournament.startDate.replace( "T", " " );
    tournament.deadlineDate = tournament.deadlineDate.replace( "T", " " );

    res.render( "./tournaments/show.ejs", { tournament: { ...tournament, avatar: avatar }, duels: duels, sponsors: sponsors } );
});


// sign up for tournament
router.post("/tournaments/:id/signup", isLoggedIn, async ( req, res ) => {
    const t = await db.sequelize.transaction();

    try {
        const { currentSize, status } = await db.Tournament.findOne({ where: { id: req.params.id } }, { transaction: t });
        
        if ( currentSize > 0 && status === "open" ) {
            await db.Participation.create({ tournamentId: req.params.id, userId: req.user.id, ladderRank: Math.random() }, { transaction: t });
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