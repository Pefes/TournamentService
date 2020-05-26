const express = require( "express" ),
    router = express.Router();


router.get("*", ( req, res ) => {
    res.render( "./index/errorHandler.ejs" );
});


module.exports = router;