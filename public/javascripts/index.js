
let playlistAudioArray = [];
let unshuffledPlaylistAudioArray = [];
let playlistAudio = {};

let currentAudioIndex = 0;

let NO_LOOP = 0;
let LOOP_CURRENT_PLAYLIST = 1;
let LOOP_CURRENT_AUDIO = 2;


let SHUFFLE_OFF = 0;
let SHUFFLE_ON = 1;

let loop = NO_LOOP; 
let shuffle = SHUFFLE_OFF;

$(document).ready(function () {
    let mainContainer = $(".main-container");
    let sidebar = $(".sidebar");
    let hamburger = $(".hamburger");
    let loginRegisterDiv = $(".login-register");
    let logo = $(".logo");
    let home = $(".sidebar-home");
    let sidebarLoginButton = $(".sidebar-login-button");


    let loginButton = $('.login-button')

    loginButton.on('click', function () {
        loadLoginDOM();
    })

    sidebarLoginButton.on('click', function () {
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

    $(hamburger).on("click", function (event) {
        if (sidebar.hasClass('close')) {
            sidebar.removeClass('close');
        } else {
            sidebar.addClass('close');
        }
    })

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


    /**
     * This part is for the last playback of the user.
     */
    let divPlaylistID = $(".audio-table-current-playlist");
    let playlistID;

    if (window.location.pathname === "/" || window.location.pathname === "/home") {
        divPlaylistID.text(-1);
        playlistID = -1;
    } else {
        playlistID = window.location.pathname.split("/")[2];
        divPlaylistID.text(playlistID);
    }

    // $.post(`playlist/${playlistID}`, function (response) {
    //     playlistAudio = response.playListAudio;
    //     console.log(response.playListAudio)
    // });
});
