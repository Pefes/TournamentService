const datetimeRegEx = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/;
const whiteSpaceOnly = /^\s*$/;

const isNumber = ( variable ) => { 
    return !isNaN( parseFloat( variable ) ) && !isNaN( variable - 0 ) ;
}

const areFilesValidated = ( files ) => {
    let valid = true;

    files.forEach(file => {
        if ( file.mimetype !== "image/png" && file.mimetype !== "image/jpeg" )
            valid = false;
    });

    return valid;
}


const tournamentInputValidation = ( form, formFiles ) => {
    
    if ( form.name.length === 0 )
        return { validated: false, errorMessage: "Tournament's name is required!" };
    else if ( form.name.length > 100 )
        return { validated: false, errorMessage: "Tournament's name is too long! (max 100 characters)" };
    else if ( whiteSpaceOnly.test( form.name ) )
        return { validated: false, errorMessage: "Tournament's name can't contain only white spaces!" };

    if ( form.branch.length === 0 )
        return { validated: false, errorMessage: "Tournament's branch is required!" };
    else if ( form.branch.length > 100 )
        return { validated: false, errorMessage: "Tournament's branch is too long! (max 100 characters)" };
    else if ( whiteSpaceOnly.test( form.name ) )
        return { validated: false, errorMessage: "Tournament's name can't contain only white spaces!" };

    if ( form.startDate.length === 0 )
        return { validated: false, errorMessage: "Tournament's start date is required!" };
    else if ( !datetimeRegEx.test( form.startDate ) )
        return { validated: false, errorMessage: "Tournament's start date is invalid! Must be like \"yyyy-mm-dd hh:mm\"" };
    else if ( new Date( form.startDate ) < Date.now() )
        return { validated: false, errorMessage: "You can't create tournaments from the past!" };

    if ( form.maxSize.length === 0 )
        return { validated: false, errorMessage: "Tournament's size is required!" };
    else if ( !isNumber(form.maxSize) )
        return { validated: false, errorMessage: "Tournament's size must be a number!" }
    else if ( form.maxSize > 100 )
        return { validated: false, errorMessage: "Tournament's size is too big! (max 100 participants)" };

    if ( form.deadlineDate.length === 0 )
        return { validated: false, errorMessage: "Tournament's deadline date is required!" };
    else if ( !datetimeRegEx.test( form.deadlineDate ) )
        return { validated: false, errorMessage: "Tournament's deadline date is invalid! Must be like \"yyyy-mm-dd hh:mm\"" };
    else if ( new Date( form.deadlineDate ) < Date.now() )
        return { validated: false, errorMessage: "Deadline date can't be from the past!" };

    if ( new Date( form.startDate ) < new Date( form.deadlineDate ) )
        return { validated: false, errorMessage: "Tournament's deadline date can't be later than start date!" };

    if ( !areFilesValidated( formFiles ) )
        return { validated: false, errorMessage: "Images must be in PNG or JPEG format!" };
            
    return { validated: true };
};


module.exports = tournamentInputValidation;