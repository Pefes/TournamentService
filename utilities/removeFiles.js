const rimraf = require( "rimraf" );


const removeFiles = ( path ) => {
    rimraf.sync( path );
    console.log( "[removeFiles] Removed images!" );
}

module.exports = removeFiles;