const seed = ( User, Tournament, Sponsor ) => {
    User.bulkCreate([{
        name: "pefes",
        surname: "pefesowsky",
        email: "w@w",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy"
    }, {
        name: "Andrzej",
        surname: "Andrzejewski",
        email: "t@t",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy"
    }, {
        name: "Adam",
        surname: "Kowalski",
        email: "r@r",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy"
    }, {
        name: "Paweł",
        surname: "Korobczyński",
        email: "e@e",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy"
    }, {
        name: "Paweł",
        surname: "Korobczyński",
        email: "pawel.korobczyński@student.put.poznan.pl",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy"
    }, {
        name: "Adam",
        surname: "Kowalski",
        email: "adam.kowalski@put.poznan.pl",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy"
    }, {
        name: "Andrzej",
        surname: "Andrzejewski",
        email: "andrzejos@gmail.com",
        password: "$2b$10$dSzC0Ksjk/LxcDR3Pf0nbuKhgkzP5iL77V4RHVA.AE19vQdWOb7Hy"
    }]);

    Tournament.bulkCreate([{
        ownerId: 1,
        name: "Tournament1",
        branch: "Branch1",
        maxSize: 4,
        currentSize: 4,
        startDate: "2020-05-13 18:36:00",
        deadlineDate: "2020-05-08 00:00:05",
        status: "closed"
    }, {
        ownerId: 2,
        name: "Tournament2",
        branch: "Branch2",
        maxSize: 23,
        currentSize: 23,
        startDate: "2021-05-08 00:00:00",
        deadlineDate: "2021-05-08 00:00:05",
    }, {
        ownerId: 3,
        name: "Tournament3",
        branch: "Branch3",
        maxSize: 24,
        currentSize: 24,
        startDate: "2021-05-09 00:00:00",
        deadlineDate: "2021-05-09 00:00:05",
    }]);

    Sponsor.bulkCreate([{
        tournamentId: 1,
        imageName: "Untitled.png",
    }, {
        tournamentId: 2,
        imageName: "11.png",
    }, {
        tournamentId: 3,
        imageName: "1.png",
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
        userId: 1
    }, {
        tournamentId: 2,
        userId: 2
    }, {
        tournamentId: 2,
        userId: 2
    }, {
        tournamentId: 3,
        userId: 1
    }, {
        tournamentId: 3,
        userId: 1
    }, {
        tournamentId: 3,
        userId: 1
    }]);

    Duel.bulkCreate([{
        tournamentId: 2,
        firstOpponent: 1,
        secondOpponent: 1,
    }, {
        tournamentId: 2,
        firstOpponent: 1,
        secondOpponent: 2,
    }, {
        tournamentId: 2,
        firstOpponent: 1,
        secondOpponent: 2,
    }, {
        tournamentId: 2,
        firstOpponent: 1,
        secondOpponent: 2,
        firstOpponentReply: 1,
    }]);
};

module.exports = seed;