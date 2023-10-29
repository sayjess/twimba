import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpcqazNO7BG0wRO9vkMZ2S4buaeMAmFTM",
  authDomain: "twimba-6ff84.firebaseapp.com",
  projectId: "twimba-6ff84",
  storageBucket: "twimba-6ff84.appspot.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// UI ELEMENTS
const getElement = (id) => document.getElementById(id)
const viewLoggedOutPage = getElement("logged-out-view")
const viewLoggedInPage = getElement("logged-in-view")
const viewSignInPage = getElement("signing-in-view")

const viewLoggedOutPageBtn = getElement("logout")
const signInWithGoogleBtnEls = document.querySelectorAll(".sign-in-with-google-btn")

const goToSignInPageEl = getElement("go-to-sign-in-page-btn")
const closeSignInPageEl = getElement("close-sign-in-page")



// UI EVENT LISTENERS
const addClickListener = (element, callback) => element.addEventListener("click", callback)



// GOOGLE PROVIDER LOGIN AND LOGOUT
for (let signInWithGoogleBtnEl of signInWithGoogleBtnEls) {
    addClickListener(signInWithGoogleBtnEl, authSignInWithGoogle)
}
addClickListener(viewLoggedOutPageBtn, authSignOut)

addClickListener(goToSignInPageEl, onEmailSignInBtnClick)
addClickListener(closeSignInPageEl, onCloseEmailSignInPageClick)
// ------------


// MAIN CODE
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Successfully signed in")
        showLoggedInView();
    } else {
        showLoggedOutView()
    }
})

// FUNCTIONS

// FUNCTIONS - FIREBASE - AUTHENTICATION

// GOOGLE PROVIDER
function authSignInWithGoogle() {
    console.log("Signing in in with Google");
    signInWithPopup(auth, provider)
      .then((result) => {
        
      })
      .catch((error) => {
        console.error(error.message);
      })
}

function authSignOut() {
    signOut(auth)
        .then(() => {
            console.log("logging out")
        }).catch((error) => {
            console.error(error.message)
        })
}

// FUNCTIONS - UI FUNCTIONS
// LOGGED IN AND LOGGED OUT VIEW
function showLoggedInView() {
    LoginView(true)
    LogoutView(false)
}

function showLoggedOutView() {
    LogoutView(true)
    LoginView(false)
}


// SIGN IN POP UP/PAGE VIEW
function onEmailSignInBtnClick() {
    if(window.innerWidth > 600) {
        signInViewInDesktop(true)
    } else {
        signInViewInMobile(true)
    }
}
function onCloseEmailSignInPageClick() {
    if(window.innerWidth > 600) {
        signInViewInDesktop(false)
    } else {
        signInViewInMobile(false)
    }
}


function signInViewInDesktop(isOpen) {
    if(isOpen){
        SignInView(true)
    } else {
        SignInView(false)
    }
}

function signInViewInMobile(isOpen) {
    if(isOpen){
        SignInView(true)
        LogoutView(false)
    }else {
        SignInView(false)
        LogoutView(true)
    }
}

// VIEW
function LogoutView(isVisible) {
    if(isVisible){
        viewLoggedOutPage.classList.remove("hidden")
    } else {
        viewLoggedOutPage.classList.add("hidden")
    }
}

function LoginView(isVisible) {
    if(isVisible){
        viewLoggedInPage.classList.remove("hidden")
    } else {
        viewLoggedInPage.classList.add("hidden")
    }

}

function SignInView(isVisible) {
    if(isVisible){
        viewSignInPage.classList.remove("hidden")
    } else {
        viewSignInPage.classList.add("hidden")
    }
}

