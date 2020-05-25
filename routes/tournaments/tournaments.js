const express = require( "express" ),
    router = express.Router(),
    db = require( "../../database/databaseConnection" ),
    multer = require( "multer" ),
    upload = multer({ dest: "./uploads/temp" }),
    move = require( "../../utilities/moveFiles" ),
    getAllFiles = require( "../../utilities/getAllFiles" ),
    { isLoggedIn, isNotLoggedIn } = require( "../../utilities/passportUtilities" ),
    tournamentInputValidation = require( "../../utilities/tournamentInputValidation" );



// show all tournaments
router.get("/tournaments/page/:currentPage", async ( req, res ) => {
    try {
        const tournaments = await db.Tournament.findAll({ raw: true });
        const tournamentsPage = await db.Tournament.findAll({ 
            order: [[ "createdAt", "DESC" ]],
            limit: 10,
            offset: req.params.currentPage * 10 - 10,
            raw: true 
        });

        const maxPage = Math.ceil( tournaments.length / 10 );
        const currentPage = parseInt( req.params.currentPage, 10);
        const tournamentsPageWithAvatars = [];
    
        tournamentsPage.forEach(tournament => {
            try {
                let avatar = getAllFiles( "public/images/tournaments/" + tournament.id + "/avatar/" )[0];
                tournamentsPageWithAvatars.push({ 
                    ...tournament, 
                    avatar: "/images/tournaments/" + tournament.id + "/avatar/" + avatar
                });
            } catch ( error ) {
                tournamentsPageWithAvatars.push( tournament );
            }
        });
    
        res.render("./tournaments/index.ejs", { 
            tournaments: tournamentsPageWithAvatars, 
            maxPage: maxPage,
            currentPage: currentPage
        });
    } catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


// show owned tournaments
router.get("/tournaments/owned/page/:currentPage", isLoggedIn, async ( req, res ) => {
    try {
        const tournaments = await db.Tournament.findAll({ where: { ownerId: req.user.id }, raw: true });
        const maxPage = Math.ceil( tournaments.length / 10 );
        const currentPage = parseInt( req.params.currentPage, 10);
        const tournamentsWithAvatars = [];
    
        tournaments.forEach(tournament => {
            try {
                let avatar = getAllFiles( "public/images/tournaments/" + tournament.id + "/avatar/" )[0];
                tournamentsWithAvatars.push({ 
                    ...tournament, 
                    avatar: "/images/tournaments/" + tournament.id + "/avatar/" + avatar
                });
            } catch ( error ) {
                tournamentsWithAvatars.push( tournament );
            }
        });
    
        res.render("./tournaments/index.ejs", { 
            tournaments: tournamentsWithAvatars, 
            maxPage: maxPage,
            currentPage: currentPage
        });
    } catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


// show signed up tournaments
router.get("/tournaments/signedUp/page/:currentPage", async ( req, res ) => {
    try {
        const participations = await db.Participation.findAll({ where: { userId: req.user.id }, raw: true });
        const tournaments = [];
    
        for ( participation of participations ) {
            let tournament = await db.Tournament.findOne({ where: { id: participation.tournamentId }, raw: true });
            tournaments.push( tournament );
        }
    
        const maxPage = Math.ceil( tournaments.length / 10 );
        const currentPage = parseInt( req.params.currentPage, 10);
        const tournamentsWithAvatars = [];
    
        tournaments.forEach(tournament => {
            try {
                let avatar = getAllFiles( "public/images/tournaments/" + tournament.id + "/avatar/" )[0];
                tournamentsWithAvatars.push({ 
                    ...tournament, 
                    avatar: "/images/tournaments/" + tournament.id + "/avatar/" + avatar
                });
            } catch ( error ) {
                tournamentsWithAvatars.push( tournament );
            }
        });
    
        res.render("./tournaments/index.ejs", { 
            tournaments: tournamentsWithAvatars, 
            maxPage: maxPage,
            currentPage: currentPage
         });
    } catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


// create new tournament
router.post("/tournaments", isLoggedIn, upload.any( "images" ), async ( req, res ) => {
    const validationResponse = tournamentInputValidation( req.body, req.files );

    if ( validationResponse.validated ) {
        try {
            const tournament = await db.Tournament.create({
                ...req.body,
                ownerId: req.user.id,
                currentSize: 0
            })
           
            req.files.forEach(( file, index ) => {
                if ( index === 0 )
                    move( file.path, "public/images/tournaments/" + tournament.id + "/avatar/", file.filename );
                else
                    move( file.path, "public/images/tournaments/" + tournament.id + "/sponsors/", file.filename );
            });
        
            res.redirect( "/tournaments/page/1" );
        } catch ( error ) {
            console.log( "Error occured: " + error );
            res.render( "./index/errorHandler.ejs" );
        }
    } else {
        req.flash( "error", validationResponse.errorMessage );
        res.render( "./tournaments/new.ejs", { previousForm: req.body } );
    }
});


// get form for new tournament
router.get("/tournaments/new", isLoggedIn, ( req, res ) => {
    res.render( "./tournaments/new.ejs" );
});


// get single tournament
router.get("/tournaments/:id", async ( req, res ) => {
    try {
        const tournament = await db.Tournament.findOne({ where: { id: req.params.id }, raw: true });
        const duels = await db.Duel.findAll({ where: { tournamentId: tournament.id }, raw: true });
        const sponsors = [];
        let avatar = "";
    
        try {
            const images = getAllFiles( "public/images/tournaments/" + tournament.id + "/sponsors/" );
            images.forEach(image => {
                sponsors.push( "/images/tournaments/" + tournament.id + "/sponsors/" + image );
            });
        } catch ( error ) {  }

        try {
            const avatarImage = getAllFiles( "public/images/tournaments/" + tournament.id + "/avatar/" )[0]; 
            avatar = "/images/tournaments/" + tournament.id + "/avatar/" + avatarImage;
        } catch ( error ) {  }
        
        tournament.startDate = tournament.startDate.replace( "T", " " );
        tournament.deadlineDate = tournament.deadlineDate.replace( "T", " " );
    
        res.render( "./tournaments/show.ejs", { tournament: { ...tournament, avatar: avatar }, duels: duels, sponsors: sponsors } );
    } catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


// sign up for tournament
router.post("/tournaments/:id/signup", isLoggedIn, async ( req, res ) => {
    try {
        const t = await db.sequelize.transaction();
        const { currentSize, maxSize, status } = await db.Tournament.findOne({ where: { id: req.params.id }, raw: true }, { transaction: t });
        
        if ( currentSize < maxSize  && status === "open" ) {
            await db.Participation.create({ tournamentId: req.params.id, userId: req.user.id, ladderRank: Math.random() }, { transaction: t });
            await db.Tournament.update({ currentSize: currentSize + 1 }, { where: { id: req.params.id } });
        }

        await t.commit();
        res.redirect( "/tournaments/" + req.params.id );
    }
    catch ( error ) {
        await t.rollback();
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


// pick a winner in duel in tournament
router.post("/tournaments/:tournamentId/duels/:duelId/pickWinner/:winnerId", isLoggedIn, async ( req, res ) => {
    try {
        const duel = await db.Duel.findOne({ where: { id: req.params.duelId, tournamentId: req.params.tournamentId }, raw: true });

        if ( duel.firstOpponent === req.user.id ) 
            await db.Duel.update({ firstOpponentReply: req.params.winnerId }, { where: { id: duel.id } });
        else 
            await db.Duel.update({ secondOpponentReply: req.params.winnerId }, { where: { id: duel.id } });
    
        res.redirect( "/tournaments/" + req.params.tournamentId );
    } catch ( error ) {
        console.log( "Error occured: " + error );
        res.render( "./index/errorHandler.ejs" );
    }
});


module.exports = router;