const showTournamentInfoSection = document.querySelectorAll( ".tournamentShowMain .tournamentInfo .tournamentInfoSection" );


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
