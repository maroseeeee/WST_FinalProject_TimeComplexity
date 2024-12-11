window.addEventListener('load', () => {
    const container = document.getElementById('container');

    if (window.location.pathname === '/signup') {
        container.classList.add('.sign-up form'); 
    }
});

const container = document.getElementById("container");
const signupbtn = document.getElementById("signup");
const loginbtn = document.getElementById("login");
const forgotPasswordLink = document.getElementById("forgot-password-link");
const backToLogin = document.getElementById("back-to-login");
const signUpForm = document.querySelector('.sign-up form');
const loginForm = document.querySelector('.login form');
const backButton = document.getElementById("back-button");

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");

    if (mode === "signup") {
        container.classList.add("active");
    } else {
        container.classList.remove("active"); 
    }
});

signupbtn.addEventListener("click", () => {
    container.classList.add("active");
    container.classList.remove("forgot-password-active"); 
});

loginbtn.addEventListener("click", () => {
    container.classList.remove("active");
});

backButton.addEventListener("click", () => {
    window.location.href = "home.html";
});

forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("forgot-password-active");
});

backToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.remove("forgot-password-active");
});

signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    container.classList.remove("active");
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Logging in...");

    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    if (username && password) {
        setTimeout(() => {
            window.location.href = "/sort";
        }, 500);
    } else {
        alert("Please fill in both fields.");
    }
});
