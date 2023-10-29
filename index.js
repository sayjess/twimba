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
const signInButtonEl = getElement("sign-in-btn")
const signInWithGoogleButtonEls = document.querySelectorAll(".sign-in-with-google-btn")
const goToSignInPageEl = getElement("go-to-sign-in-page-btn")
const closeSignInPageEl = getElement("close-sign-in-page")

// UI EVENT LISTENERS
const addClickListener = (element, callback) => element.addEventListener("click", callback)



// GOOGLE PROVIDER LOGIN AND LOGOUT
for (let signInWithGoogleButtonEl of signInWithGoogleButtonEls) {
    addClickListener(signInWithGoogleButtonEl, authSignInWithGoogle)
}
addClickListener(viewLoggedOutPageBtn, authSignOut)
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
function showLoggedInView() {
    viewLoggedOutPage.classList.add("hidden")
    viewLoggedInPage.classList.remove("hidden")
}

function showLoggedOutView() {
    viewLoggedOutPage.classList.remove("hidden")
    viewLoggedInPage.classList.add("hidden")
}

