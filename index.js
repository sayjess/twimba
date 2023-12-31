import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

import { getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    where,
    getDoc,
    orderBy,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    Timestamp,
   deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"

import { getStorage, 
        ref, 
        uploadBytes, 
        getDownloadURL
     } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js"

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
const storage = getStorage(app)

// UI ELEMENTS
const getElement = (id) => document.getElementById(id)
const viewLoggedOutPage = getElement("logged-out-view")
const viewLoggedInPage = getElement("logged-in-view")
const viewSignInPage = getElement("signing-in-view")
const viewCreateAccountPage = getElement('create-account-view')
const viewInitialUpdateProfilePage = getElement('update-profile-view')

const viewLoggedOutPageBtn = getElement("logout")
const signInWithGoogleBtnEls = document.querySelectorAll(".sign-in-with-google-btn")

const goToSignInPageEl = getElement("go-to-sign-in-page-btn")
const goToCreateAccountPageEl = getElement("go-to-create-account-btn")

const closeSignInOrCreatePageEls = document.querySelectorAll(".close-page")

const onCreateAccountBtnEl = getElement("create-account-btn")
const onSignInAccountBtnEl = getElement("sign-in-btn")


const userProfilePictureEl = getElement("profile-pic")
const userHeaderProfilePictureEl = getElement("header-pfp")
const headerMessage = getElement("header-message")

const textareaEl = getElement("tweet-input")
const postBtnEl = getElement("tweet-btn")

const feedEl = getElement("feed")

const updateProfileBtn = getElement("update-profile-btn")
const displayNameInput =getElement("username-update")
const newPhotoURLInput = getElement("imageInput")


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

addClickListener(updateProfileBtn, authUpdateProfile)

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    } else if(e.target.dataset.openReply) {
        handleOpenReply(e.target.dataset.openReply)
    } else if(e.target.dataset.replyToUser){
        handleReplyToUser(e.target.dataset.replyToUser)
    } 
})

// MAIN CODE
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Successfully signed in")
        showLoggedInView()
        showUserPictureAndName(user)
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
            initialUpdateProfileView(true)
            LoginView(false)
        })
        .catch((error) => {
            console.error(error.message) 
        })
}


async function authUpdateProfile() {
    const newDisplayName = displayNameInput.value;
    const newPhotoURL = newPhotoURLInput.files[0];

    if (!newDisplayName || !newPhotoURL) {
        console.error('New display name or photo URL is empty');
        return;
    }
    const storageRef = ref(storage, `profile-photos/${auth.currentUser.uid}`);
    try {
        const snapshot = await uploadBytes(storageRef, newPhotoURL);
        console.log('Uploaded a blob or file!');
        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, {
            displayName: newDisplayName,
            photoURL: downloadURL,
        });
        showProfilePicture(auth.currentUser);
        initialUpdateProfileView(false)
        LoginView(true)
    } catch (error) {
        console.error(error);
    }
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
            likedBy: [],
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
    if(window.innerWidth > 600) {
        signInOrCreateAccountViewInDesktop(true, "create-account")
    } else {
        signInOrCreateAccountViewInMobile(true, "create-account")
    }
}

// upload image and name upon create account
const imageInput = document.getElementById('imageInput');
const uploadedImage = document.getElementById('uploadedImage');

imageInput.addEventListener('change', (event) => {
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    const reader = new FileReader();

    reader.onload = (e) => {
      uploadedImage.src = e.target.result;
      uploadedImage.style.display = 'block';
    };

    reader.readAsDataURL(selectedFile);
  }
});

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
function showUserPictureAndName(user) {
    const photoURL = user.photoURL
    if(user.photoURL){
        userProfilePictureEl.src = photoURL
        userHeaderProfilePictureEl.src = photoURL
    } else {
        userProfilePictureEl.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png'
        
    }

    const fullName = user.displayName.split(" "); // Split the 
    const firstName = fullName[0];
    headerMessage.textContent += firstName
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
            // getLikedByCountForTweet(doc)
            renderPost(feedEl, doc)
        })
    })
}


// render feed
function renderPost(postsEl, tweetDoc) {
    const postData = tweetDoc.data()
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
                <div class="reply-to-user">
                        <img src="${reply.profilePic}"          class="reply-profile-pic">
                        <div class="reply-user-data">
                            <p class="reply-handle">${reply.handle}</p>
                            <p class="reply-tweet-text">${reply.tweetText}</p>
                        </div>
                </div>`
        })
    }

    feedEl.innerHTML += `
    <div class="tweet-container">
        <img src="${postData.profilePic}" class="tweet-profile-pic">
        <div class="tweet-user-data">
            <p class="tweet-username">${postData.handle}</p>
            <p class="tweet-date-posted">${displayDate(postData.createdAt)}</p>
        </div>
        <i class="fa-solid fa-ellipsis" data-dots="${tweetDoc.id}"></i>
        <p class="tweet-text">${postData.tweetText}</p>
        <div class="tweet-icons">
            <span class="tweet-reply">
                <i class="fa-regular fa-comment-dots"
                    data-open-reply="${tweetDoc.id}">
                </i>
                    ${getCommentCountForTweet(postData.replies)}
            </span>
            <span class="tweet-heart">
                <i class="fa-solid fa-heart"    
                data-like="${tweetDoc.id}"
                ></i>
                ${getLikedByCountForTweet(postData.likedBy)}
            </span>
            <span class="tweet-retweet">
                <i class="fa-solid fa-retweet"
                data-retweet="${postData.uid}"
                ></i>
                ${postData.retweets}
            </span>
        </div>
    </div>
    <div class="replies-container hidden" id="replies-${tweetDoc.id}">
        ${repliesHtml}
        <div class="reply-to-user-container">
            <textarea class="user-reply" placeholder="Post your reply" id="reply-input-${tweetDoc.id}"></textarea>
            <button class="primary-btn reply-btn" data disable data-reply-to-user="${tweetDoc.id}">Reply</button>
        </div>
    </div>
    `
}

// display date (date when user posted a tweet)
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

// TWEET, COMMENT, RETWEET
async function handleLikeClick(docId) {
    const docRef = doc(db, collectionName, docId);
    const userId = auth.currentUser.uid;
  
    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const tweetData = docSnapshot.data();
        const likedBy = tweetData.likedBy || [];
  
        // Check if the user's ID is not already in the likedBy array
        if (!likedBy.includes(userId)) {
          await updateDoc(docRef, {
            likedBy: arrayUnion(userId)
          });
          console.log("Liked the tweet.");
        } else {
          // If the user's ID is already in the array, unlike the tweet
          await updateDoc(docRef, {
            likedBy: arrayRemove(userId)
          });
          console.log("Unliked the tweet.");
        }
      } else {
        console.log("Tweet not found.");
      }
    } catch (error) {
      console.error("Error liking/unliking the tweet:", error);
    }
  }

function handleOpenReply(docId) {
    document.getElementById(`replies-${docId}`).classList.toggle('hidden')
}

async function handleReplyToUser(docId) {
    const docRef = doc(db, collectionName, docId);
    const replyInputEl = document.getElementById(`reply-input-${docId}`)

    try {
        const docSnapshot = await getDoc(docRef);
        console.log(docSnapshot.exists() && replyInputEl.value)
        if (docSnapshot.exists() && replyInputEl.value) {
          
            const newComment = {
                handle: auth.currentUser.displayName,
                profilePic: auth.currentUser.photoURL,
                tweetText: replyInputEl.value,
            };

            await updateDoc(docRef, {
                replies: arrayUnion({
                    ...newComment,
                    createdAt: Timestamp.now(),
                })
            })
            handleOpenReply(docId)
        }
    } catch (error) {
        console.error("Error commenting on the tweet:", error);
    }
}





// Counter (like, comment, retweet)
function getLikedByCountForTweet(likedByArray) {   
    return likedByArray.length
}

function getCommentCountForTweet(repliesArray){
    return repliesArray.length
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

function initialUpdateProfileView(isVisible) {
    if(isVisible){
        viewInitialUpdateProfilePage.classList.remove("hidden")
    } else {
        viewInitialUpdateProfilePage.classList.add("hidden")
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
