document.addEventListener('DOMContentLoaded', () => {
    let loginButton = document.querySelector('.login-button')

    loginButton.addEventListener('click', function () {
        window.location.href = '/login'
    })

    let registerButton = document.querySelector('.register-button')

    registerButton.addEventListener('click', function () {
        window.location.href = '/register'
    })
})