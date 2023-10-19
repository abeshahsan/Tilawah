document.addEventListener('DOMContentLoaded', function (event) {

    let alert = document.querySelector('.alert')
    let alertText = document.querySelector('.alert p')
    let alertClose = document.querySelector('.alert .close')
    document.querySelector('.forgot-password');

    let registerEmail = document.querySelector('.register.email')
    let registerOTP = document.querySelector('.register.otp')
    let registerPassword = document.querySelector('.register.password')


    alertClose.addEventListener('click', function () {
        alert.classList.add('hidden')
    })

    $(registerEmail).validate({
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
                    if (response.success === 1) {    //success
                        bringOTPForm()
                    } else {
                        showAlert('An account with this email already exists!')
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })

    $(registerOTP).validate({
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
                    if (response.success === 1) {    //success
                        bringPasswordForm()
                    } else {
                        showAlert('Wrong OTP!')
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })

    $(registerPassword).validate({
        rules: {
            name: {
                minlength: 0
            },
            'confirm-password': {
                equalTo: '#register-password'
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
                        showAlert('Some error Occurred. Please try again')
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })

    function bringOTPForm() {
        registerEmail.classList.add('hidden')
        registerOTP.classList.remove('hidden')
    }

    function bringPasswordForm() {
        registerOTP.classList.add('hidden')
        registerPassword.classList.remove('hidden')
    }

    function showAlert(text) {
        alert.classList.remove('hidden')
        alertText.textContent = text
    }
})
