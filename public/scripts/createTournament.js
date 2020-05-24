const selectSponsorsImages = document.getElementsByClassName( "selectSponsorsImages" )[0];
const selectAvatarImage = document.getElementsByClassName( "selectAvatarImage" )[0];
const imagesSponsors = document.getElementById( "imagesSponsors" );
const imageAvatar = document.getElementById( "imageAvatar" );


if ( selectSponsorsImages ) {
    selectSponsorsImages.addEventListener("click", () => {
        imagesSponsors.click();
    });
}

if ( selectAvatarImage ) {
    selectAvatarImage.addEventListener("click", () => {
        imageAvatar.click();
    });
}

if ( imagesSponsors ) {
    imagesSponsors.addEventListener("change", () => {
        document.getElementById( "imagesCountSponsors" ).textContent = imagesSponsors.files.length;
    });
}

if ( imageAvatar ) {
    imageAvatar.addEventListener("change", () => {
        document.getElementById( "imagesCountAvatar" ).textContent = imageAvatar.files.length;
    });
}
