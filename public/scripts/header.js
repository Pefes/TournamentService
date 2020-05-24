document.getElementById( "navButton" ).addEventListener("click", () => {
    const mobileDevContainer = document.getElementsByClassName( "mobileDevContainer" )[0];
    const navList = document.querySelector( "nav ul" ).cloneNode( true );

    if ( mobileDevContainer.childNodes.length == 0 ) {
        mobileDevContainer.appendChild( navList );
        mobileDevContainer.children[0].classList.remove( "navList" );
        mobileDevContainer.children[0].classList.add( "mobileDevList" );
    }

    if ( mobileDevContainer.getBoundingClientRect().height < 5 ) {
        if ( !document.querySelector( ".newNavListElement" ) )
            addElementsToNavList( mediaQueryNavList );

        mobileDevContainer.style.height = mobileDevContainer.children[0].clientHeight + 30 + "px";
        mobileDevContainer.style.border = "1px solid white";
    }
       
    else {
        mobileDevContainer.style.height = "0";
        mobileDevContainer.style.border = "none";
    }
    
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


const addElementsToNavList = ( mediaQuery ) => {
    const mobileDevList = document.getElementsByClassName( "mobileDevList" )[0];
    const mobileDevContainer = document.getElementsByClassName( "mobileDevContainer" )[0];

    if ( mediaQuery.matches && mobileDevList ) {
        const elementList = document.querySelector( ".mobileDevContainer .navListLogoutButton" );
        const li = "<li class='newNavListElement'><a href='/login'>SIGNED UP TOURNAMENTS</a></li>" + 
                    "<li class='newNavListElement'><a href='/register'>OWNED TOURNAMENTS</a></li>";

        if ( elementList ) {
            elementList.insertAdjacentHTML( "beforebegin", li );

            if ( document.getElementsByClassName( "navShowMobileList" )[0] )
                mobileDevContainer.style.height = mobileDevContainer.children[0].clientHeight + 30 + "px";
        }
    } else {
        const navListNewElements = document.querySelectorAll( ".newNavListElement" );

        navListNewElements.forEach(element => {
            element.parentNode.removeChild( element );
        });

        if ( document.getElementsByClassName( "navShowMobileList" )[0] )
            mobileDevContainer.style.height = mobileDevContainer.children[0].clientHeight + 30 + "px";     
    }
};


const hideNavList = ( mediaQuery ) => {
    const mobileDevContainer = document.getElementsByClassName( "mobileDevContainer" )[0];

    if ( mediaQuery.matches && mobileDevContainer ) {
        mobileDevContainer.style.height = "0";
        mobileDevContainer.style.border = "none";

        if ( document.getElementsByClassName( "mobileDevList" )[0] ) {
            document.getElementsByClassName( "mobileDevList" )[0].classList.remove( "mobileDevListVisible" );
            document.querySelector( "nav" ).classList.remove( "navShowMobileList" );
        }
    }
}


const mediaQueryMobileDevContainer = window.matchMedia("(min-width: 1000px)");
mediaQueryMobileDevContainer.addListener( hideNavList );
const mediaQueryNavList = window.matchMedia( "(max-width: 750px)" );
mediaQueryNavList.addListener( addElementsToNavList );
