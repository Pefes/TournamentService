const db = require( "../database/databaseConnection" );
const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const isEmailOccupied = async ( email ) => {
    const users = await db.User.findAll({ where: { email: email }, raw: true });

    if ( users.length === 0 )
        return false;
    else
        return true;
}


const userInputValidation = async ( form ) => {
    if ( form.name.length === 0 )
        return { validated: false, errorMessage: "User's name is required!" };
    else if ( form.name.length > 100 )
        return { validated: false, errorMessage: "User's name is too long! (max 100 characters)" };

    if ( form.surname.length === 0 )
        return { validated: false, errorMessage: "User's surname is required!" };
    else if ( form.surname.length > 100 )
        return { validated: false, errorMessage: "User's surname is too long! (max 100 characters)" };

    if ( form.email.length === 0 )
        return { validated: false, errorMessage: "User's email is required!" };
    else if ( form.email.length > 100 )
        return { validated: false, errorMessage: "User's email is too long! (max 100 characters)" };
    else if ( !emailRegEx.test( form.email ) )
        return { validated: false, errorMessage: "User's email is incorrect! Should be like: \"example@gmail.com\"" };
    else if ( await isEmailOccupied( form.email ) )
        return { validated: false, errorMessage: "User's email is already occupied!" };

    if ( form.password.length === 0 )
        return { validated: false, errorMessage: "User's password is required!" };
    else if ( form.password.length > 100 )
        return { validated: false, errorMessage: "User's password is too long! (max 100 characters)" };
    else if ( form.password.length < 5 )
        return { validated: false, errorMessage: "User's password should be at least 5 characters long!" };

    return { validated: true };
};


module.exports = userInputValidation;