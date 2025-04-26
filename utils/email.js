// import package
const nodemailer = require('nodemailer');

async function sendVerificationEmail(user){
    const transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    await transport.sendMail({
        from: `"Alnafeeq Support" <${process.env.EMAIL}>`,
        to:user.email,
        subject:`Verify your email.`,
        html: `<h3> Hi ${user.name},</h3>
               <p>Thanks for registering. Please verify your email by clicking the link below:</p>
               <a href="${link}">Verify Email.</a>
               <p>This link will expire in 24 hours.</p> `
    });
}

module.exports = {sendVerificationEmail,}