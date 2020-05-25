const db = require( "../database/databaseConnection" );
const nodemailer = require( "nodemailer" );


const generateRandomKey = ( count ) => {
    let randomKey = "";

    for ( let i = 0; i < count; i++ )
        randomKey += Math.random().toString(36).substr(2, 10);
    
    return randomKey;
};


const sendVerificationEmail = async ( userEmail, userName, userId ) => {
    try {
        const randomKey = generateRandomKey( 10 );
        db.AccountVerification.create({ userId: userId, key: randomKey });
    
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
                + process.env.ROOTURL + randomKey + "<br><br>"
                + "Best Regards,<br>Tournament Service"
        });
    
        console.log( "Message sent: %s", info.messageId );
    } catch ( error ) {
        console.log( "Error occured while sending email message..." );
    }
};


module.exports = sendVerificationEmail;