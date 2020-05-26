const articles = document.querySelectorAll( ".tournamentsList article" );

if ( articles[0] ) {
    articles.forEach(( article, index ) => {
        if ( index % 2 !== 0 )
            article.classList.add( "tournamentsListArticleVisibleRight" );
        else
            article.classList.add( "tournamentsListArticleVisibleLeft" );
    })
}