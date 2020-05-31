const ncp = require( "ncp" );
const fs = require( "fs" );
ncp.limit = 16;


const copyFiles = ( source, destination ) => {
    if ( !fs.existsSync( destination ) )
        fs.mkdirSync( destination, { recursive: true } );

    ncp(source, destination, error => {
        if ( error )
            console.log( "[copyFiles] Error occured: " + error );
        else
            console.log( "[copyFiles] Done!" );
    });
}

module.exports = copyFiles;