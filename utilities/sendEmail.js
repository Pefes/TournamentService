const db = require( "../database/databaseConnection" );
const nodemailer = require( "nodemailer" );


const generateRandomKey = ( count ) => {
    let randomKey = "";

    for ( let i = 0; i < count; i++ )
        randomKey += Math.random().toString(36).substr(2, 10);
    
    return randomKey;
};


const sendResetPasswordEmail = async ( userEmail ) => {
    try {
        const randomKey = generateRandomKey( 10 );
        const user = await db.User.findOne({ where: { email: userEmail }, raw: true });

        if ( user ) {
            await db.ResetPasswordKey.create({ userId: user.id, key: randomKey });
    
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
        
            let info = await transporter.sendMail({
                from: "Tournament Service " + process.env.EMAIL,
                to: userEmail,
                subject: "Reset Password",
                html: "<p>Hello <b>"+ user.name + "</b>!</p>"
                    + "<p>If you want to reset your password click the link below, if not just ignore that message.</p>"
                    + process.env.ROOTURL + "resetPassword/" + randomKey + "<br><br>"
                    + "Best Regards,<br>Tournament Service"
            });
        
            console.log( "Message sent <reset password>: %s", info.messageId );
        } else {
            console.log( "Error occured: no user with that email!" );
        }
    } catch ( error ) {
        console.log( "Error occured while sending reset password email message: " + error );
    }
}


const sendVerificationEmail = async ( userEmail, userName, userId ) => {
    try {
        const randomKey = generateRandomKey( 10 );
        db.VerificationKey.create({ userId: userId, key: randomKey });
    
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
    
        let info = await transporter.sendMail({
            from: "Tournament Service " + process.env.EMAIL,
            to: userEmail,
            subject: "Account Verification",
            html: "<p>Hello <b>"+ userName + "</b>!</p>"
                + "<p>Click the link below to activate your account:</p>"
                + process.env.ROOTURL + "verify/" + randomKey + "<br><br>"
                + "Best Regards,<br>Tournament Service"
        });
    
        console.log( "Message sent <verification>: %s", info.messageId );
    } catch ( error ) {
        console.log( "Error occured while sending verification email message: " + error );
    }
};


module.exports = {
    verification: sendVerificationEmail,
    resetPassword: sendResetPasswordEmail
};