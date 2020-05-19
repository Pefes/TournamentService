document.getElementById("navButton").addEventListener("click", () => {
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


