const fs = require( "fs" );


const getAllFiles = ( directory ) => {
    return fs.readdirSync( directory );
};


module.exports = getAllFiles;