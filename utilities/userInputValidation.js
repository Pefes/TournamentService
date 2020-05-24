const db = require( "../database/databaseConnection" );
const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const isEmailOccupied = async ( email ) => {
    const users = db.User.findAll({ where: { email: email }, raw: true });

    if ( users.length === 0 )
        return false;
    else
        return true;
}


const userInputValidation = ( req, res, next ) => {
    if ( req.body.name.length === 0 ) {
        req.flash( "error", "User's name is required!" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    } else if ( req.body.name.length > 100 ) {
        req.flash( "error", "User's name is too long! (max 100 characters)" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    }

    if ( req.body.surname.length === 0 ) {
        req.flash( "error", "User's surname is required!" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    } else if ( req.body.surname.length > 100 ) {
        req.flash( "error", "User's surname is too long! (max 100 characters)" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    }

    if ( req.body.email.length === 0 ) {
        req.flash( "error", "User's email is required!" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    } else if ( req.body.email.length > 100 ) {
        req.flash( "error", "User's email is too long! (max 100 characters)" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    } else if ( !emailRegEx.test( req.body.email ) ) {
        req.flash( "error", "User's email is incorrect! Should be like: \"example@gmail.com\"" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    } else if ( isEmailOccupied() ) {
        req.flash( "error", "User's email is already occupied!" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    }

    if ( req.body.password.length === 0 ) {
        req.flash( "error", "User's password is required!" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    } else if ( req.body.password.length > 100 ) {
        req.flash( "error", "User's password is too long! (max 100 characters)" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    } else if ( req.body.password.length < 5 ) {
        req.flash( "error", "User's password should be at least 5 characters long!" );
        res.render( "./index/register.ejs", { previousForm: req.body } );
    }

    return next();
};


module.exports = userInputValidation;