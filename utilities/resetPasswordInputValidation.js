const resetPasswordInputValidation = ( form ) => {
    if ( form.newPassword.length === 0 )
        return { validated: false, errorMessage: "User's password is required!" };
    else if ( form.newPassword.length > 100 )
        return { validated: false, errorMessage: "User's password is too long! (max 100 characters)" };
    else if ( form.newPassword.length < 5 )
        return { validated: false, errorMessage: "User's password should be at least 5 characters long!" };
    else if ( form.newPassword !== form.newPasswordRepeat )
        return { validated: false, errorMessage: "Passwords must be the same!" };

    return { validated: true };
};


module.exports = resetPasswordInputValidation;