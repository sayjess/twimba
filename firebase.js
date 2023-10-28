import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"

  const firebaseConfig = {
    apiKey: "AIzaSyDpcqazNO7BG0wRO9vkMZ2S4buaeMAmFTM",
    authDomain: "twimba-6ff84.firebaseapp.com",
    projectId: "twimba-6ff84",
    storageBucket: "twimba-6ff84.appspot.com",
  };

  export const app = initializeApp(firebaseConfig)
  export const auth = getAuth(app)
