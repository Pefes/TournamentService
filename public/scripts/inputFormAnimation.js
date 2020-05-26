const inputForms = document.getElementsByClassName( "inputForm" );

if ( inputForms[0] ) {
    for ( let i = 0; i < inputForms.length; i++ ) {
        inputForms[i].classList.add( "inputFormVisible" );
    }
}