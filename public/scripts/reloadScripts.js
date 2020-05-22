const reloadScripts = () => {
    const head = document.getElementsByTagName( "head" )[0];
    const script = document.createElement( "script" );
    script.src = "/scripts/showTournamentSponsorsVisible.js";
    head.appendChild( script );
}

reloadScripts();