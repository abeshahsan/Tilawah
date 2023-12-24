let playlistAudio = ['audio1']

$(document).ready(function () {

    let mainContainer = $(".main-container");
    let sidebar = $(".sidebar");
    let hamburger = $(".hamburger");
    let loginRegisterDiv = $(".login-register");
    let logo = $(".logo");
    let home = $(".sidebar-home");

    function loadLoginDOM() {
        $.post("/login-DOM", function (html) {
            sidebar.addClass("hidden");
            loginRegisterDiv.addClass("hidden");

            $(mainContainer).html(html);
            history.pushState("login", "", "/login");
        });
    }

    function loadHome() {
        $.post("/home", function (res) {
            $(mainContainer).html(res.html);
            if (res.loginRegister) loginRegisterDiv.removeClass("hidden");
            else loginRegisterDiv.addClass("hidden");
            $(sidebar).removeClass("hidden");
            history.pushState("home", "", "/");
        });
    }

    function loadRegisterDOM() {
        $.post("/register-DOM", function (html) {
            let sidebar = $(".sidebar");
            let loginRegisterDiv = $(".login-register");
            sidebar.addClass("hidden");
            loginRegisterDiv.addClass("hidden");

            $(mainContainer).html(html);
            history.pushState("register", "", "/register");
        });
    }

    function loadProfileDOM() {
        $.post("/profile-DOM", function (html) {
            $(mainContainer).html(html);
            history.pushState("profile", "", "/profile");
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
    $(window).on("popstate", function (event) {
        if (window.location.pathname === "/") {
            loadHome()
        } else if (window.location.pathname === "/login") {
            loadLoginDOM()
        } else if (window.location.pathname === "/register") {
            loadRegisterDOM()
        } else if (window.location.pathname === "/profile") {
            loadProfileDOM()
        }
    })

    $(logo).on("click", function (event) {
        event.preventDefault();
        loadHome();
    })


    $(home).on("click", function (event) {
        event.preventDefault();
        loadHome();
    })

    $(hamburger).on("click", function(event){
        if(sidebar.hasClass('close')){
            sidebar.removeClass('close');
        }
        else{
            sidebar.addClass('close');
        }
    })
   
})
