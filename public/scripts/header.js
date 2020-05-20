document.getElementById( "navButton" ).addEventListener("click", () => {
    const navList = document.querySelector( "nav ul" ).cloneNode( true );
    const mobileDevContainer = document.getElementsByClassName( "mobileDevContainer" )[0];

    if ( mobileDevContainer.childNodes.length == 0 ) {
        mobileDevContainer.appendChild( navList );
        mobileDevContainer.children[0].classList.remove( "navList" );
        mobileDevContainer.children[0].classList.add( "mobileDevList" );
    }

    mobileDevContainer.classList.toggle( "mobileDevContainerVisible" );
    document.getElementsByClassName( "mobileDevList" )[0].classList.toggle( "mobileDevListVisible" );
    document.querySelector( "nav" ).classList.toggle( "navShowMobileList" );
});


if( document.getElementsByClassName( "loginPopUp" )[0] ) {
    document.getElementsByClassName( "loginPopUp" )[0].addEventListener("mouseover", () => {
        const loginPopUpInfo = document.getElementsByClassName( "loginPopUpInfo" )[0];
        const loginPopUpIcon = document.querySelector( ".loginPopUp i" );
    
        loginPopUpInfo.classList.add( "loginPopUpInfoHover" );
        loginPopUpIcon.id = "loginPopUpIconHover";
    });

    document.getElementsByClassName( "loginPopUp" )[0].addEventListener("mouseleave", () => {
        const loginPopUpInfo = document.getElementsByClassName( "loginPopUpInfo" )[0];
        const loginPopUpIcon = document.querySelector( ".loginPopUp i" );
    
        loginPopUpInfo.classList.remove( "loginPopUpInfoHover" );
        loginPopUpIcon.id = "";
    });

    const loginPopUpInfoA = document.querySelectorAll( ".loginPopUpInfo a" );

    loginPopUpInfoA.forEach(aHref => {
        aHref.addEventListener("mouseover", () => {
            aHref.children[0].id = "loginPopUpInfoIconHover";
        });
        aHref.addEventListener("mouseleave", () => {
            aHref.children[0].id = "";
        });
    });
}








