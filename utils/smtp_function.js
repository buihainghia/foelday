const nodemailer = require('nodemailer');

async function sendMail(userEmail, massage) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASSWORD
        }
    });

    const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container {
                        width: 100%;
                        text-align: center;
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                    }
                    .header {
                        background-color: #4CAF50;
                        color: white;
                        padding: 20px 0;
                        font-size: 28px;
                        font-weight: bold;
                    }
                    .content {
                        margin: 30px 0;
                        font-size: 20px;
                        color: #333;
                    }
                    .verification-code {
                        font-size: 28px;
                        font-weight: bold;
                        color: #4CAF50;
                        background-color: #e0f7e0;
                        padding: 10px;
                        border-radius: 5px;
                        display: inline-block;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 16px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        Foodely Verification
                    </div>
                    <div class="content">
                        <p>Dear ${userEmail},</p>
                        <p>Thank you for registering with Foodely. Please use the following OTP to complete your verification process:</p>
                        <p class="verification-code">${massage}</p>
                        <p>If you did not request this, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        &copy; 2024 Foodely. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            `

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: userEmail,
        subject: 'OTP for verification',
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;