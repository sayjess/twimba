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
const viewCreateAccountPage = getElement('create-account-view')

const viewLoggedOutPageBtn = getElement("logout")
const signInWithGoogleBtnEls = document.querySelectorAll(".sign-in-with-google-btn")

const goToSignInPageEl = getElement("go-to-sign-in-page-btn")
const goToCreateAccountPageEl = getElement("go-to-create-account-btn")

const closeSignInOrCreatePageEls = document.querySelectorAll(".close-page")


// UI EVENT LISTENERS
const addClickListener = (element, callback) => element.addEventListener("click", callback)



// GOOGLE PROVIDER LOGIN AND LOGOUT
for (let signInWithGoogleBtnEl of signInWithGoogleBtnEls) {
    addClickListener(signInWithGoogleBtnEl, authSignInWithGoogle)
}
addClickListener(viewLoggedOutPageBtn, authSignOut)


// ------------
addClickListener(goToSignInPageEl, onEmailSignInBtnClick)
addClickListener(goToCreateAccountPageEl, onCreateAccountBtnClick)

for (let closeSignInOrCreatePageEl of closeSignInOrCreatePageEls) {
    if(closeSignInOrCreatePageEl.parentElement.id === "create-account-view"){
        addClickListener(closeSignInOrCreatePageEl, () => onCloseEmailSignInOrCreatePageClick("create-account"))
    }else {
        addClickListener(closeSignInOrCreatePageEl, () => onCloseEmailSignInOrCreatePageClick("sign-in"))
    }
}

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
        signInOrCreateAccountViewInDesktop(true, "sign-in")
    } else {
        signInOrCreateAccountViewInMobile(true, "sign-in")
    }
}

function onCreateAccountBtnClick() {
    console.log("create-account button clicked")
    if(window.innerWidth > 600) {
        signInOrCreateAccountViewInDesktop(true, "create-account")
    } else {
        signInOrCreateAccountViewInMobile(true, "create-account")
    }
}
function onCloseEmailSignInOrCreatePageClick(isCreateAccount) {
    // console.log(isCreateAccount)
    if(window.innerWidth > 600) {
        if(isCreateAccount === "create-account"){
            signInOrCreateAccountViewInDesktop(false, "create-account")
        } else {
            signInOrCreateAccountViewInDesktop(false, "sign-in")
        }
    } else {
        if(isCreateAccount === "create-account"){
            signInOrCreateAccountViewInMobile(false, "create-account")
        } else {
            signInOrCreateAccountViewInMobile(false, "sign-in")
        }
    }
}


function signInOrCreateAccountViewInDesktop(isOpen, view=null) {
    if(isOpen){
        if(view === "sign-in"){
            SignInView(true)
        } else if (view === "create-account"){
            createAccountView(true)
        }
    } else {
        if(view === "sign-in"){
            SignInView(false)
        } else if (view === "create-account"){
            createAccountView(false)
        }
    }
}

function signInOrCreateAccountViewInMobile(isOpen, view=null) {
    // console.log(view)
    if(isOpen){
        console.log(view)
        if(view === "sign-in"){
            SignInView(true)
            LogoutView(false)
        } else if (view === "create-account"){
            createAccountView(true)
            LogoutView(false)
        }
    } else {
        if(view === "sign-in"){
            SignInView(false)
            LogoutView(true)
        } else if (view === "create-account"){
            createAccountView(false)
            LogoutView(true)
        }
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

function createAccountView(isVisible) {
    if(isVisible){
        viewCreateAccountPage.classList.remove("hidden")
    } else {
        viewCreateAccountPage.classList.add("hidden")
    }
}

