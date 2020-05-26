const rimraf = require( "rimraf" );


const removeFiles = ( path ) => {
    rimraf.sync( path );
    console.log( "Removed images!" );
}

module.exports = removeFiles;