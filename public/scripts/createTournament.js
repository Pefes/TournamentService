const createTournamentSelectImages = document.getElementsByClassName( "createTournamentSelectImages" )[0];
const imagesInput = document.getElementById( "images" );


if ( createTournamentSelectImages ) {
    createTournamentSelectImages.addEventListener("click", () => {
        imagesInput.click();
    });
}

if ( imagesInput ) {
    imagesInput.addEventListener("change", () => {
        document.getElementById( "imagesCount" ).textContent = imagesInput.files.length;
    });
}
