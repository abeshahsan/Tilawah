document.addEventListener('DOMContentLoaded', function (event) {
    let loginForm = document.querySelector('.login-form')

    let alert = document.querySelector('.alert')
    let alertText = document.querySelector('.alert p')
    let alertClose = document.querySelector('.alert .close')

    let forgotPass = document.querySelector('.forgot-password')
    let forgotFormMail = document.querySelector('.forgot-password-form.email')
    let forgotFormOTP = document.querySelector('.forgot-password-form.otp')
    let recoverPassword = document.querySelector('.forgot-password-form.recover-password')

    forgotPass.addEventListener('click', bringForgotMailForm)

    alertClose.addEventListener('click', function () {
        alert.classList.add('hidden')
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
            form.classList.add('no-events')
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
                        form.classList.remove('no-events')
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
            form.classList.add('no-events')
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
                        form.classList.remove('no-events')
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
            form.classList.add('no-events')
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
                        form.classList.remove('no-events')
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
            form.classList.add('no-events')
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
                        form.classList.remove('no-events')
                        showAlert('Some error Occurred. Please try again')
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })

    function bringForgotMailForm() {
        loginForm.classList.add('hidden')
        forgotFormMail.classList.remove('hidden')
    }

    function bringForgotOTPForm() {
        forgotFormMail.classList.add('hidden')
        forgotFormOTP.classList.remove('hidden')
    }

    function bringRecoverPasswordForm() {
        forgotFormOTP.classList.add('hidden')
        recoverPassword.classList.remove('hidden')
    }

    function showAlert(text) {
        alert.classList.remove('hidden')
        alertText.textContent = text
    }
})