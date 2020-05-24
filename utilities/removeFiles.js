const fs = require( "fs" );


const removeFiles = ( path ) => {
    fs.rmdirSync( path, { recursive: true } );
    console.log( "Removed images!" );
};


module.exports = removeFiles;