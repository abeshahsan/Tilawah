function makeFormNOTResponsive(form) {
    $(form).addClass('no-events')
}

function makeFormResponsive(form) {
    $(form).removeClass('no-events')
}

$(document).ready(function () {
    let loginForm = $('.login-form')

    let alert = $('.alert')
    let alertText = $('.alert p')
    let alertClose = $('.alert .close')

    let forgotPass = $('.forgot-password')
    let forgotFormMail = $('.forgot-password-form.email')
    let forgotFormOTP = $('.forgot-password-form.otp')
    let recoverPassword = $('.forgot-password-form.recover-password')

    forgotPass.on('click', bringForgotMailForm)

    alertClose.on('click', function () {
        alert.addClass('hidden')
    })

    $(loginForm).validate({
        rules: {
            email: {
                email: true
            },
        },
        messages: {
            email: {
                required: "Please enter your email"
            },
            password: {
                required: "Please enter your password"
            }
        },
        submitHandler: function (form) {
            makeFormNOTResponsive(form);
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success === 1) {    //success
                        window.location.href = '/';
                    } else {
                        makeFormResponsive(form);
                        showAlert('Wrong email or password. Please try again')
                    }
                })
                .fail(function (message, error) {
                    console.log(message, error)
                })
            return false; // required to block normal submit since you used ajax
        },
    })

    $(forgotFormMail).validate({
        rules: {
            email: {
                email: true
            },
        },
        messages: {
            email: {
                required: "Please enter your email"
            },
        },
        submitHandler: function (form) {
            $(form).addClass('no-events')
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success === 1) {    //success
                        bringForgotOTPForm()
                    } else {
                        $(form).removeClass('no-events')
                        showAlert('No account exists with this email')
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })

    $(forgotFormOTP).validate({
        messages: {
            otp: {
                required: "Please enter the OTP"
            },
        },
        submitHandler: function (form) {
            $(form).addClass('no-events')
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success === 1) {    //success
                        bringRecoverPasswordForm()
                    } else {
                        $(form).removeClass('no-events')
                        showAlert('Wrong OTP!')
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })

    $(recoverPassword).validate({
        rules: {
            password: {
                minlength: 0
            },
            'confirm-password': {
                equalTo: '#confirm-password'
            },
        },
        messages: {
            name: {
                required: "Please enter your name"
            },
            password: {
                required: "Please enter a password",
            },
            'confirm-password': {
                required: "Please retype the password",
                equalTo: "Passwords don't match"
            },
        },
        submitHandler: function (form) {
            $(form).addClass('no-events')
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success === 1) {    //success
                        window.location.href = '/';
                    } else {
                        $(form).removeClass('no-events')
                        showAlert('Some error Occurred. Please try again')
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })

    function bringForgotMailForm() {
        loginForm.addClass('hidden')
        forgotFormMail.removeClass('hidden')
    }

    function bringForgotOTPForm() {
        forgotFormMail.addClass('hidden')
        forgotFormOTP.removeClass('hidden')
    }

    function bringRecoverPasswordForm() {
        forgotFormOTP.addClass('hidden')
        recoverPassword.removeClass('hidden')
    }

    function showAlert(text) {
        alert.removeClass('hidden')
        alertText.text(text)
    }
})
