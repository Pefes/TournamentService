const showTournamentInfoSection = document.querySelectorAll( ".tournamentShowMain .tournamentInfo .tournamentInfoSection" );
const showTournamentFirstOpponent = document.querySelectorAll( ".tournamentDuel .firstOpponent.myDuel" )[0];
const showTournamentsecondOpponent = document.querySelectorAll( ".tournamentDuel .secondOpponent.myDuel" )[0];

const postWinner = ( tournamentId, duelId, winnerId ) => {
    const form = document.createElement( "form" );
    form.method = "POST";
    form.action = "/tournaments/" + tournamentId + "/duels/" + duelId + "/pickWinner/" + winnerId;
    document.body.appendChild( form );
    form.submit();
}


if ( showTournamentInfoSection[0] ) {
    showTournamentInfoSection.forEach(section => {
        section.children[0].addEventListener("mouseover", () => {
            section.children[1].classList.add( "tournamentInfoSectionHover" );
            section.children[0].children[0].classList.add( "labelDotHover" );
        });

        section.children[0].addEventListener("mouseout", () => {
            section.children[1].classList.remove( "tournamentInfoSectionHover" );
            section.children[0].children[0].classList.remove( "labelDotHover" );
        });
    });
}


if ( showTournamentFirstOpponent ) {
    showTournamentFirstOpponent.addEventListener("click", () => {
        const pickWinnerFirstOpponentForm = document.querySelector( ".tournamentDuel .pickWinner" ).children[0];
        pickWinnerFirstOpponentForm.submit();
    });
}

if ( showTournamentsecondOpponent ) {
    showTournamentsecondOpponent.addEventListener("click", () => {
        const pickWinnerSecondOpponentForm = document.querySelector( ".tournamentDuel .pickWinner" ).children[1];
        pickWinnerSecondOpponentForm.submit();
    });
}
