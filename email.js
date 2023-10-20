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
        lowerCaseAlphabets: false, specialChars: false
    });
}

function createMailOptions(receiverEmail, otp) {
    return {};
}

function sendMailTo(receiverEmail, otp, callback) {
    transporter.sendMail(createMailOptions(receiverEmail, otp), function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        if (callback) callback(otp);
    });
}

function sendPasswordResetMail(email, callback = function () {

}) {
    sentOTP = createOTP()
    transporter.sendMail({
        from: `Tilawah <phoenixmailer3@gmail.com>`,
        to: email,
        subject: 'Password reset request for Tilawah',
        html: `
<html lang="en">
<body>
        <div style="padding: 20px; background-color: rgb(255, 255, 255); 
        display: flex; flex-direction: column; align-items: center; justify-content: center; border: thin solid black">
            <div style="color: rgb(0, 0, 0)">
<pre style="font-family: sans-serif; font-size: 14px;">
We received a request to reset the password for your <span style="font-weight: bold; font-family: Arial, sans-serif">Tilawah</span> account.
To reset your password, please use the following OTP code:
</pre>
                <div style="text-align:left;">
                    <div
                        style="border:thin solid teal;text-align:center;font-size:2em;color:teal;
                        border-radius:3px;display:inline-block;padding:3px 30px">
                        ${sentOTP}
                    </div>
                </div>
                <p style="padding-bottom: 0; color: #f36464; font-family: sans-serif; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
                <p style="font-family: sans-serif; font-size: 14px; padding-bottom: 16px">Thanks,<br>The Phoenix team.</p>
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

let registerMailBody = `
        <div style="padding: 20px; background-color: rgb(255, 255, 255); ">
            <div style="color: rgb(0, 0, 0); text-align: left;">
                <h1 style="margin: 1rem 0">Verification code</h1>
                <p>Welcome to <b>Ibadah.</b> Please use the verification code below to
                  recover your password.</p>
                <div style="text-align:left;">
                    <div
                        style="border:thin solid teal;text-align:center;font-size:2em;color:teal;
                        border-radius:3px;display:inline-block;padding:3px 30px">
                        ${sentOTP}
                    </div>
                </div>
                <p style="padding-bottom: 0">If you didn't request this, you can ignore this email.</p>
                <p style="padding-bottom: 16px">Thanks,<br>The Phoenix team.</p>
            </div>
        </div>
        `
// sendPasswordResetMail('abeshahsan2002@gmail.com', 'Abesh Ahsan')

module.exports = {createOTP, sendMailTo, sendPasswordResetMail, sentOTP};