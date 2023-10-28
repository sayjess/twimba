// import { app, auth } from "./firebase"


// UI ELEMENTS
const viewLoggedOutPage = document.getElementById("logged-out-view")
const viewLoggedInPage = document.getElementById("logged-in-view")
const viewSignInPage = document.getElementById("signing-in-view")

const signInButtonEl = document.getElementById("sign-in-btn")
const goToSignInPageEl = document.getElementById("go-to-sign-in-page-btn")

const closeSignInPageEl = document.getElementById("close-sign-in-page")

// UI EVENT LISTENERS

goToSignInPageEl.addEventListener("click", goToSignInPage)
closeSignInPageEl.addEventListener("click", closeSignInPage)



// MAIN CODE

// FUNCTIONS

// FUNCTIONS - FIREBASE - AUTHENTICATION


// FUNCTIONS - UI FUNCTIONS

function goToSignInPage() {

    if (window.innerWidth > 600) {
        viewSignInPage.classList.remove("hidden")
    } else {
        viewLoggedOutPage.classList.add("hidden")
        viewSignInPage.classList.remove("hidden")
    }
}

function closeSignInPage() {
    if (window.innerWidth > 600) {
        viewSignInPage.classList.add("hidden")
    } else {
        viewLoggedOutPage.classList.remove("hidden")
        viewSignInPage.classList.add("hidden")
    }
}

