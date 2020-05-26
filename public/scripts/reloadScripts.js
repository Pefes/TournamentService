const reloadScripts = () => {
    const head = document.getElementsByTagName( "head" )[0];
    const scripts = [
        "/scripts/showTournamentSponsorsVisible.js",
        "/scripts/showTournamentsArticles.js",
        "/scripts/inputFormAnimation.js"
    ];

    scripts.forEach(script => {
        let scriptElement = document.createElement( "script" );
        scriptElement.src = script;
        head.appendChild( scriptElement );
    });
}

reloadScripts();