document.addEventListener('DOMContentLoaded', () => {
    let loginButton = document.querySelector('.login-button')

    loginButton.addEventListener('click', function () {
        window.location.href = '/login'
    })

    let registerButton = document.querySelector('.register-button')

    registerButton.addEventListener('click', function () {
        window.location.href = '/register'
    })


    let profileButton = document.querySelector("#profile-button")
    let profileMenu = document.querySelector(".profile-menu")

    profileButton.addEventListener('click', function (event) {
        if(profileMenu.classList.contains('hidden')) profileMenu.classList.remove('hidden')
    })

    document.addEventListener("click", function (event) {
        let eventSource = event.target
        if (!(eventSource.id === profileButton.id || eventSource.id === profileMenu.id)) {
            profileMenu.style.display = "none"
        }
    })
})