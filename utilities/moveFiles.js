const fs = require( "fs" );


const move = ( oldPath, newDirectory, filename ) => {
    if ( !fs.existsSync( newDirectory ) )
        fs.mkdirSync( newDirectory, { recursive: true } );

    fs.rename(oldPath, newDirectory + filename, error => {
        if ( error )
            console.log( "Error while moving files: " + error );
    });
}


module.exports = move;