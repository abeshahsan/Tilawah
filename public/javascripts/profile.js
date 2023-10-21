$(() => {
    let fullNameText = $("#full-name")
    let editNameButton = $("#edit-name-button")
    let editName = $("#edit-name")
    let saveName = $("#save-name")
    let nameSavedLabel = $("#name-saved-label")
    let genderSelectRadio = $(".gender")
    let countrySelect = $("#country")
    let userProfileContainer = $(".user-profile-container")

    $(editNameButton).click(() => {
        enableNameEdit()
    })

    $(userProfileContainer).click(() => {
        let nameSavedLabel = $("#name-saved-label")
        let emailSavedLabel = $("#email-saved-label")
        $(nameSavedLabel).removeClass('active')
        $(emailSavedLabel).removeClass('active')
    })

    function enableNameEdit() {
        $(editName).css("display", "none")
        $(saveName).css("display", "block")
        $(fullNameText).prop("disabled", false)
        $(genderSelectRadio).prop("disabled", false)
        $(countrySelect).prop("disabled", false)
    }

    function disableNameEdit() {
        $(editName).css("display", "inline")
        $(saveName).css("display", "none")
        $(fullNameText).prop("disabled", true)
        $(nameSavedLabel).addClass('active')
        $(genderSelectRadio).prop("disabled", true)
        $(countrySelect).prop("disabled", true)
    }

    $("#edit-personal-info-form").validate({
        rules: {
            fullName: {}
        },
        messages: {
            fullName: {
                required: "Please enter your name"
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
                    if (response.success === true) {    //success
                        disableNameEdit()
                    } else {
                        alert('Something went wrong');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })


    let emailText = $("#email")
    let editEmailButton = $("#edit-email-button")
    let editEmail = $("#edit-email")
    let saveEmail = $("#save-email")
    let emailSavedLabel = $("#email-saved-label")
    let changeMailOTPForm = $("#change-email-otp-form")
    let editEmailForm = $("#edit-email-form")


    $(editEmailButton).click(() => {
        enableEmailEdit()
    })

    function enableEmailEdit() {
        $(editEmail).css("display", "none")
        $(saveEmail).css("display", "block")
        $(emailText).prop("disabled", false)
        $(emailText).val("")
    }

    function displayOTP() {
        $(changeMailOTPForm).css("display", "block")
        $(editEmailForm).css("display", "none")
    }

    function disableEmailEdit() {
        $(changeMailOTPForm).css("display", "none")
        $(editEmailForm).css("display", "block")

        $(editEmail).css("display", "inline")
        $(saveEmail).css("display", "none")

        $(emailText).prop("disabled", true)

        $(emailSavedLabel).addClass("active")
    }

    $(editEmailForm).validate({
        rules: {
            fullName: {}
        },
        messages: {
            email: {
                required: "Please enter your email"
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
                    if (response.success) {    //success
                        displayOTP()
                    } else {
                        alert('Account with this email already exists');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })


    $(changeMailOTPForm).validate({
        messages: {
            otp: {
                required: "Please enter the OTP"
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
                    if (response.success === true) {    //success
                        disableEmailEdit()
                    } else if(!response.otpMatched) {
                        alert('Wrong OTP');
                    }
                    else  {
                        alert('Something went wrong');
                    }
                });
            return false; // required to block normal submit since you used ajax
        },
    })
})