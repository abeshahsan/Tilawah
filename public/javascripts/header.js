$(document).ready(function () {

    let mainContainer = $(".main-container");

    function loadLoginDOM() {
        $.post("/login-partial", function (html) {
            let sidebar = $(".sidebar");
            let loginRegisterDiv = $(".login-register");
            sidebar.addClass("hidden");
            loginRegisterDiv.addClass("hidden");

            $(mainContainer).html(html);
            history.pushState(null, null, "/login");
        });
    }

    function loadRegisterDOM() {
        $.post("/register-partial", function (html) {
            let sidebar = $(".sidebar");
            let loginRegisterDiv = $(".login-register");
            sidebar.addClass("hidden");
            loginRegisterDiv.addClass("hidden");

            $(mainContainer).html(html);
            history.pushState(null, null, "/register");
        });
    }

    function loadProfileDOM() {
        $.post("/profile-partial", function (html) {
            $(mainContainer).html(html);
            history.pushState(null, null, "/profile");
        });
    }

    function hideProfileMenu() {
        $(".profile-menu").addClass("hidden");
    }

    let loginButton = $('.login-button')

    loginButton.on('click', function () {
        loadLoginDOM();
    })

    let registerButton = $('.register-button')

    registerButton.on('click', function () {
        loadRegisterDOM();
    })

    let profileButton = $(".profile-button")
    let profileMenu = $(".profile-menu")

    let profileHyperLink = $("#profile-hyperlink");

    $(profileHyperLink).on("click", function (event) {
        event.preventDefault();
        loadProfileDOM();
        hideProfileMenu();
    })

    profileButton.on('click', function () {
        if (profileMenu.hasClass('hidden')) {
            profileMenu.removeClass('hidden')
        } else profileMenu.addClass('hidden')
    })
})
