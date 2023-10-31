import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

import { getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    orderBy,
    doc,
    updateDoc,
   deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDpcqazNO7BG0wRO9vkMZ2S4buaeMAmFTM",
  authDomain: "twimba-6ff84.firebaseapp.com",
  projectId: "twimba-6ff84",
  storageBucket: "twimba-6ff84.appspot.com",
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)

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

const onCreateAccountBtnEl = getElement("create-account-btn")
const onSignInAccountBtnEl = getElement("sign-in-btn")


const userProfilePictureEl = getElement("profile-pic")
const textareaEl = getElement("tweet-input")
const postBtnEl = getElement("tweet-btn")

const feedEl = getElement("feed")


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

addClickListener(onCreateAccountBtnEl, authCreateAccountWithEmail)
addClickListener(onSignInAccountBtnEl, authSignInWithEmail)

addClickListener(postBtnEl, postButtonPressed)

// MAIN CODE
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Successfully signed in")
        showLoggedInView()
        showProfilePicture(userProfilePictureEl, user)
        fetchInRealtimeAndRenderPostsFromDB()
    } else {
        showLoggedOutView()
    }
})

// GLOBAL VARIABLE
const collectionName = "posts"

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

// create account using email and password
function authCreateAccountWithEmail() {
    const email = document.getElementById("create-email")
    const password = document.getElementById("create-password")

    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            clearAuthFields([email, password])
        })
        .catch((error) => {
            console.error(error.message) 
        })
}

// sign in using email and password
function authSignInWithEmail() {
    const email = document.getElementById("sign-in-email")
    const password = document.getElementById("sign-in-password")
    
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            clearAuthFields([email, password])
        })
        .catch((error) => {
            console.error(error.message)
        })
}

// CLOUD FIRESTORE
async function addPostToDB(postBody, auth) {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            uid: auth.uid,
            handle: auth.displayName,
            profilePic: auth.photoURL ? auth.photoURL : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
            tweetText: postBody,
            likes: 0,
            retweets: 0,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            createdAt: serverTimestamp()
        })
    } catch (error) {
        console.error(error.message)
    }
}


// FUNCTIONS - UI FUNCTIONS
// LOGGED IN AND LOGGED OUT VIEW
function showLoggedInView() {
    LoginView(true)
    LogoutView(false)
    createAccountView(false)
    SignInView(false)
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
    if(isOpen){

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

// USER PROFILE PICTURE DISPLAY
function showProfilePicture(imgElement, user) {
    const photoURL = user.photoURL
    
    if (photoURL) {
        imgElement.src = photoURL
    } else {
        imgElement.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
    }
}

// TWEET BUTTON PRESS
function postButtonPressed() {
    const postBody = textareaEl.value
    const user = auth.currentUser
    console.log(postBody)
    if (postBody) {
        addPostToDB(postBody, user)
        clearInputField(textareaEl)
    }
}



//DISPLAY POSTS IN FEED 
function fetchInRealtimeAndRenderPostsFromDB() {
    // display feed in descending order
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"))
    onSnapshot(q, (querySnapshot) => {
        clearAll(feedEl)
        querySnapshot.forEach((doc) => {
            renderPost(feedEl, doc.data())
        })
    })
}

function renderPost(postsEl, postData) {
    let likeIconClass = ''
        
    if (postData.isLiked){
        likeIconClass = 'liked'
    }
    
    let retweetIconClass = ''
    
    if (postData.isRetweeted){
        retweetIconClass = 'retweeted'
    }
    
    let repliesHtml = ''

    if(postData.replies.length > 0){
        postData.replies.forEach(function(reply){
            repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
`
        })
    }

    feedEl.innerHTML += `
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${postData.profilePic}" class="profile-pic">
            <div>
                <div class="tweet-inner-upper">
                <div class="tweet-inner-data">
                    <p class="handle">${postData.handle}</p>
                    <p class="date-posted">${displayDate(postData.createdAt)}</p>
                </div>
                    <div class="delete" id="delete-${postData.uuid}" data-delete='${postData.uid}'>
                        <i class="fa-regular fa-trash-can" data-delete='${postData.uid}'></i>
                        <span data-delete='${postData.uid}'>Delete</span>
                    </div>
                    <i class="fa-solid fa-ellipsis" data-dots="${postData.uid}"></i>
                </div>
                <p class="tweet-text">${postData.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${postData.uuid}"
                        ></i>
                        ${postData.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart"
                        data-like="${postData.uid}"
                        ></i>
                        ${postData.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet"
                        data-retweet="${postData.uid}"
                        ></i>
                        ${postData.retweets}
                    </span>
                </div>   
            </div>            
        </div>
        <div class="hidden" id="replies-${postData.uuid}">
            ${repliesHtml}
            <div>
                <span class="user-reply-container">
                    <textarea class="user-reply" placeholder="Post your reply" id="reply-input"></textarea>
                    <button data disable data-reply-to-user="${postData.uid}">Reply</button>
                </span>
            </div>
        </div>   
    </div>
    `
}

// display date
function displayDate(firebaseDate) {
    if (!firebaseDate) {
        return ""
    }

    const date = firebaseDate.toDate()
    const currentDate = new Date()

    const timeDiff = Math.abs(Math.floor((currentDate - date) / 1000)) // Time difference in seconds
    const secondsInMinute = 60
    const secondsInHour = secondsInMinute * 60
    const secondsInDay = secondsInHour * 24
    const secondsInWeek = secondsInDay * 7
    const secondsInYear = secondsInDay * 365

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const day = date.getDate()
    const year = date.getFullYear()
    const month = monthNames[date.getMonth()]

    if (timeDiff < secondsInMinute) {
        return `${timeDiff}s`
    } else if (timeDiff < secondsInHour) {
        const minutes = Math.floor(timeDiff / secondsInMinute)
        return `${minutes}m`
    } else if (timeDiff < secondsInDay) {
        const hours = Math.floor(timeDiff / secondsInHour)
        return `${hours}h`
    } else if (timeDiff < secondsInWeek) {
        if (timeDiff < secondsInDay * 2) {
            return "1d"
        } else {
            const days = Math.floor(timeDiff / secondsInDay)
            return `${days}d`
        }
    } else if (timeDiff < secondsInYear) {
        return `${day} ${month}`
    } else {
        return `${day} ${month} ${year}`
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

// CLEAR INPUT FIELDS
function clearAuthFields(fields) {
	fields.forEach(field => {
        clearInputField(field)
    })
}

function clearInputField(field) {
	field.value = ""
}

function clearAll(element) {
    element.innerHTML = ""
}
