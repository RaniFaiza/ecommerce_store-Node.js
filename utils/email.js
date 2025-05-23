// import package
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// ************************* Send verification email *************************
async function sendVerificationEmail(user){

        const token = await jwt.sign({id:user._id},process.env.EMAIL_SECRET_KEY, {expiresIn: '1d'});
        const link = `${process.env.BASE_URL}/api/v1/auth/verify-email/?token=${token}`
        
        // create transporter
        const transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Send Email
        await transport.sendMail({
            from: `"Alnafeeq Support" <${process.env.EMAIL}>`,
            to:user.email,
            subject:`Verify your email.`,
            html: `<h3> Hi ${user.name},</h3>
                <p>Thanks for registering. Please verify your email by clicking the link below:</p>
                <a href="${link}">Verify Email.</a>
                <p>This link will expire in 24 hours.</p> `
        });
        console.log(`Verification email sent to ${user.email}`);
}

module.exports = {sendVerificationEmail,}