const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:8080/api/auth/verify/${token}`

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your account',
        html: `
            <h2>Email Verification</h2>
            <p>Click below to verify your account:</p>
            <a href="${verificationLink}">Verify Account</a>
        `
    })
}

module.exports = sendVerificationEmail