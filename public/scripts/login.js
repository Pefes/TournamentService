const forgotPasswordButton = document.querySelector( ".forgotPassword p" );

if ( forgotPasswordButton ) {
    forgotPasswordButton.addEventListener("click", () => {
        const forgotPasswordBackground = document.getElementsByClassName( "forgotPasswordBackground" )[0];
        const forgotPasswordDialog = document.getElementsByClassName( "forgotPasswordDialog" )[0];

        if ( forgotPasswordBackground && forgotPasswordDialog ) {
            forgotPasswordBackground.classList.add( "forgotPasswordBackgroundVisible" );
            forgotPasswordDialog.classList.add( "forgotPasswordDialogVisible" );
        }
    });
}


const forgotPasswordBackground = document.getElementsByClassName( "forgotPasswordBackground" )[0];

if ( forgotPasswordBackground ) {
    forgotPasswordBackground.addEventListener("click", () => {
        const forgotPasswordDialog = document.getElementsByClassName( "forgotPasswordDialog" )[0];

        if ( forgotPasswordDialog ) {
            forgotPasswordBackground.classList.remove( "forgotPasswordBackgroundVisible" );

            forgotPasswordDialog.classList.remove( "forgotPasswordDialogVisible" );
        }
    });
}