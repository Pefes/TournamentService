const express = require( "express" ),
    router = express.Router(),
    db = require( "../../database/databaseConnection" ),
    multer = require( "multer" ),
    upload = multer({ dest: "./uploads/temp" }),
    move = require( "../../utilities/moveFiles" ),
    getAllFiles = require( "../../utilities/getAllFiles" ),
    removeFiles = require( "../../utilities/removeFiles" ),
    Sequelize = require( "sequelize" ),
    { isLoggedIn, isNotLoggedIn } = require( "../../utilities/passportUtilities" ),
    isTournamentOwner = require( "../../middleware/isTournamentOwner" ),
    isTournamentOpen = require( "../../middleware/isTournamentOpen" ),
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
    try {
        const validationResponse = tournamentInputValidation( req.body, req.files );

        if ( validationResponse.validated ) {
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
        
            req.flash( "success", "Tournament successfully created!" );
            res.redirect( "/tournaments/page/1" );
        } else {
            req.flash( "error", validationResponse.errorMessage );
            res.render( "./tournaments/new.ejs", { previousForm: req.body } );
        }
    } catch ( error ) {
        console.log( "Error occured: " + error );
        req.flash( "error", "Something went wrong..." );
        res.render( "./tournaments/new.ejs", { previousForm: req.body } );
    }
});


// get edit form
router.get("/tournaments/:tournamentId/edit", isLoggedIn, isTournamentOwner, isTournamentOpen, async ( req, res ) => {
    const tournament = await db.Tournament.findOne({ where: { id: req.params.tournamentId }, raw: true });

    res.render( "./tournaments/edit.ejs", { oldValues: tournament } );
});


// edit tournament
router.post("/tournaments/:tournamentId/edit", isLoggedIn, isTournamentOwner, isTournamentOpen, upload.any( "images" ), async ( req, res ) => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );

    try {
        const validationResponse = tournamentInputValidation( req.body, req.files );
        if ( validationResponse.validated ) {
            await db.Tournament.update({
                name: req.body.name,
                branch: req.body.branch,
                startDate: req.body.startDate,
                maxSize: req.body.maxSize,
                deadlineDate: req.body.deadlineDate
            }, { where: { id: req.params.tournamentId } }, { transaction: t });

            removeFiles( "public/images/tournaments/" + req.params.tournamentId + "/" );
            req.files.forEach(( file, index ) => {
                if ( index === 0 )
                    move( file.path, "public/images/tournaments/" + req.params.tournamentId + "/avatar/", file.filename );
                else
                    move( file.path, "public/images/tournaments/" + req.params.tournamentId + "/sponsors/", file.filename );
            });

            await t.commit();
            req.flash( "success", "Tournament successfully edited!" );
            res.redirect( "/tournaments/" + req.params.tournamentId );
        } else {
            await t.rollback();
            req.flash( "error", validationResponse.errorMessage );
            res.redirect( "/tournaments/" + req.params.tournamentId + "/edit" );
        }
    } catch ( error ) {
        await t.rollback();
        console.log( "Error occured: " + error );
        req.flash( "error", "Something went wrong..." );
        res.redirect( "/tournaments/" + req.params.tournamentId + "/edit" );
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
        const duelsWithNicknames = [];
        const sponsors = [];
        let avatar = "";

        try {
            for ( duel of duels ) {
                let firstOpponent = await db.User.findOne({ where: { id: duel.firstOpponent }, raw: true });
                let secondOpponent = await db.User.findOne({ where: { id: duel.secondOpponent }, raw: true });

                duelsWithNicknames.push({
                    ...duel,
                    firstOpponentSurname: firstOpponent ? firstOpponent.surname : null,
                    secondOpponentSurname: secondOpponent ? secondOpponent.surname : null
                });
            }

            if ( tournament.winnerId ) 
                tournament.winnerName = await db.User.findOne({ where: { id: tournament.winnerId }, raw: true });
        } catch ( error ) { console.log( "Error occured: " + error ); }
    
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
    
        res.render( "./tournaments/show.ejs", { tournament: { ...tournament, avatar: avatar }, duels: duelsWithNicknames, sponsors: sponsors } );
    } catch ( error ) {
        console.log( "Error occured: " + error );
        req.flash( "error", "Something went wrong..." );
        res.redirect( "/tournaments" );
    }
});


// sign up for tournament
router.post("/tournaments/:id/signup", isLoggedIn, async ( req, res ) => {
    const t = await db.sequelize.transaction( Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE );

    try {
        const { currentSize, maxSize, status } = await db.Tournament.findOne({ where: { id: req.params.id }, raw: true }, { transaction: t });
        const participationInTournament = await db.Participation.findOne({ where: { tournamentId: req.params.id, userId: req.user.id }, raw: true }, { transaction: t });

        if ( !participationInTournament ) {
            if ( currentSize < maxSize  && status === "open" ) {
                await db.Participation.create({ tournamentId: req.params.id, userId: req.user.id, ladderRank: Math.random() }, { transaction: t });
                await db.Tournament.update({ currentSize: currentSize + 1 }, { where: { id: req.params.id } });
    
                await t.commit();
                req.flash( "success", "You have successfully signed up for the tournament!" );
                res.redirect( "/tournaments/" + req.params.id );
            } else {
                req.flash( "error", "All free places are occupied!" );
                await t.rollback();
                res.redirect( "/tournaments/" + req.params.id );
            }
        } else {
            req.flash( "error", "You are already signed up!" );
            await t.rollback();
            res.redirect( "/tournaments/" + req.params.id );
        }
    }
    catch ( error ) {
        await t.rollback();
        console.log( "Error occured: " + error );
        req.flash( "error", "Something went wrong..." );
        res.redirect( "/tournaments/" + req.params.id );
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
    
        req.flash( "success", "You picked a winner!" );
        res.redirect( "/tournaments/" + req.params.tournamentId );
    } catch ( error ) {
        console.log( "Error occured: " + error );
        req.flash( "error", "Something went wrong..." );
        res.redirect( "/tournaments/" + req.params.tournamentId );
    }
});


module.exports = router;