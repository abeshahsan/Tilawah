document.addEventListener('DOMContentLoaded', function (event) {
    let loginForm = document.querySelector('.login-form')

    let alert = document.querySelector('.alert')
    let alertText = document.querySelector('.alert p')
    let alertClose = document.querySelector('.alert .close')

    let forgotPass = document.querySelector('.forgot-password')
    let forgotFormMail = document.querySelector('.forgot-password-form.email')
    let forgotFormOTP = document.querySelector('.forgot-password-form.otp')

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
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success === 0) {    //success
                        window.location.href = '/';
                    } else {
                        alert.classList.remove('hidden')
                    }
                });
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
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success === 0) {    //success
                        bringForgotOTPForm()
                    } else {
                        alert.classList.remove('hidden')
                        alertText.textContent = 'No account exists with this email'
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
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize(),
                dataType: 'json'
            })
                .done(function (response) {
                    if (response.success === 0) {    //success
                        window.location.href = '/';
                    } else {
                        alert.classList.remove('hidden')
                        alertText.textContent = 'Wrong OTP!'
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
})