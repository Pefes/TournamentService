const copyFiles = require( "../utilities/copyFiles" );


const seed = ( User, Tournament, Participation, Duel ) => {
    User.bulkCreate([{
        name: "Player1",
        surname: "Player1",
        email: "w@w",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy",
        active: 1
    }, {
        name: "Player2",
        surname: "Player2",
        email: "e@e",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy",
        active: 1
    }, {
        name: "Player3",
        surname: "Player3",
        email: "r@r",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy",
        active: 1
    }, {
        name: "Player4",
        surname: "Player4",
        email: "t@t",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy",
        active: 1
    }, {
        name: "Player5",
        surname: "Player5",
        email: "a@a",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy",
        active: 1
    }, {
        name: "Player6",
        surname: "Player6",
        email: "s@s",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy",
        active: 1
    }, {
        name: "Player7",
        surname: "Player7",
        email: "d@d",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy",
        active: 1
    }]);

    Tournament.bulkCreate([{
        ownerId: 1,
        name: "Tournament1",
        branch: "Branch1",
        maxSize: 4,
        currentSize: 4,
        startDate: "2020-05-13T18:36",
        deadlineDate: "2020-05-08T00:00",
        status: "closed"
    }, {
        ownerId: 2,
        name: "Tournament2",
        branch: "Branch2",
        maxSize: 3,
        currentSize: 3,
        startDate: "2019-05-08T00:00",
        deadlineDate: "2019-05-08T00:00",
        status: "closed"
    }, {
        ownerId: 3,
        name: "Tournament3",
        branch: "Branch3",
        maxSize: 7,
        currentSize: 7,
        startDate: "2019-05-09T00:00",
        deadlineDate: "2019-05-09T00:00",
        status: "closed"
    }]);

    Participation.bulkCreate([{
        tournamentId: 1,
        userId: 1,
        ladderRank: 1
    }, {
        tournamentId: 1,
        userId: 2,
        ladderRank: 2
    }, {
        tournamentId: 1,
        userId: 3,
        ladderRank: 3
    }, {
        tournamentId: 1,
        userId: 4,
        ladderRank: 4
    }, {
        tournamentId: 2,
        userId: 1,
        ladderRank: 1
    }, {
        tournamentId: 2,
        userId: 2,
        ladderRank: 1
    }, {
        tournamentId: 2,
        userId: 3,
        ladderRank: 1
    }, {
        tournamentId: 3,
        userId: 1,
        ladderRank: 1
    }, {
        tournamentId: 3,
        userId: 2,
        ladderRank: 2
    }, {
        tournamentId: 3,
        userId: 3,
        ladderRank: 3
    }, {
        tournamentId: 3,
        userId: 4,
        ladderRank: 4
    }, {
        tournamentId: 3,
        userId: 5,
        ladderRank: 5
    }, {
        tournamentId: 3,
        userId: 6,
        ladderRank: 6
    }, {
        tournamentId: 3,
        userId: 7,
        ladderRank: 7
    }]);

    for ( let i = 1; i < 4; i++ ) {
        copyFiles( "uploads/seed/" + i, "public/images/tournaments/" + i );
    }
};

module.exports = seed;