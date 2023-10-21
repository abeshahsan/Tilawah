const nodemailer = require('nodemailer');

const otpGenerator = require('otp-generator');

let sentOTP;

const transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
        user: 'phoenixmailer3', pass: 'repr akwh oeyg jhno'
    },
});

function createOTP() {
    return otpGenerator.generate(6, {
        digits:true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
}


function sendPasswordResetMail(email, callback = function () {

}) {
    sentOTP = createOTP()
    transporter.sendMail({
        from: `Tilawah <phoenixmailer3@gmail.com>`,
        to: email,
        subject: 'Password reset request',
        html: `
<html lang="en">
<body>
    <div style="
        background-color: rgb(255, 255, 255);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
    ">
        <div class="main-content" style="
            align-items: center;
            border: thin solid black;
            border-radius: 20px;
            background-color: #f3eeff;
            width: 600px;
            color: #1f1f1f;
            padding: 20px 20px 20px 20px ;
            margin: 0 auto;
        ">
            <p style="
                font-family: sans-serif;
                font-size: 14px;
                width: 100%;
                overflow-wrap: break-word;
                word-wrap: break-word; /* Add this line for better compatibility */
            ">
                We received a request to reset the password for your <span style="font-weight: bold; font-family: Arial, sans-serif">Tilawah</span> account.
To reset your password, please use the following OTP code:
            </p>
            <div style="text-align:center;">
                <div style="border:2px solid teal;text-align:center;font-size:2em;color:teal;
                    border-radius:5px; margin: 0 auto; width: fit-content; height: fit-content;
                    padding: 6px 30px">
                    ${sentOTP}
                </div>
            </div>
            <p style="margin-bottom: 5px; color: #f36464; font-family: sans-serif; font-size: 14px;">If you didn't request this, or you believe this email was sent to you in error, please ignore it.</p>
            <p style="font-family: sans-serif; font-size: 14px;">Sincerely,<br>Tilawah<br>presented by <span style="font-weight: bold; font-family: Arial, sans-serif"> The Phoenix team.</span></p>
        </div>
    </div>
</body>
</html>          
        `
    }, function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent to ' + email);
            return callback(sentOTP)
        }
    });
}


function sendRegisterMail(email, callback = function () {

}) {
    sentOTP = createOTP()
    transporter.sendMail({
        from: `Tilawah <phoenixmailer3@gmail.com>`,
        to: email,
        subject: 'Email Verification',
        html: `
<html lang="en">
<body>
    <div style="
        background-color: rgb(255, 255, 255);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
    ">
        <div class="main-content" style="
            align-items: center;
            border: thin solid black;
            border-radius: 20px;
            background-color: #f3eeff;
            width: 600px;
            color: #1f1f1f;
            padding: 20px 20px 20px 20px;
            margin: 0 auto;
        ">
            <p style="
                font-family: sans-serif;
                font-size: 14px;
                width: 100%;
                overflow-wrap: break-word;
                word-wrap: break-word; /* Add this line for better compatibility */
            ">
                Thank you for registering an account with us. To get started, please verify your email address by entering the following OTP:
            </p>
            <div style="text-align:center;">
                <div style="border:2px solid teal;text-align:center;font-size:2em;color:teal;
                    border-radius:5px; margin: 0 auto; width: fit-content; height: fit-content;
                    padding: 6px 30px">
                    ${sentOTP}
                </div>
            </div>
            <p style="color: #f36464; font-family: sans-serif; font-size: 14px;">If you didn't request this registration, or you believe this email was sent to you in error, please ignore it.</p>
            <p style="font-family: sans-serif; font-size: 14px">Sincerely,<br>Tilawah<br>presented by <span style="font-weight: bold; font-family: Arial, sans-serif"> The Phoenix team.</span></p>
        </div>
    </div>
</body>
</html>
        `
    }, function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent to ' + email);
            return callback(sentOTP)
        }
    });
}


module.exports = {sendRegisterMail, sendPasswordResetMail, sentOTP};