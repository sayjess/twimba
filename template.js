function authSignInWithGoogle() {
    console.log("Sign in with Google");
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Signed in with Google");
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
  
  // FUNCTIONS - UI FUNCTIONS
  function showLoggedOutViewOnMobile() {
      viewSignInPage.classList.remove("hidden");
      viewLoggedOutPage.classList.remove("hidden");
      viewLoggedInPage.classList.add("hidden");
  }
  
  function showLoggedInView() {
      viewSignInPage.classList.add("hidden");
      viewLoggedOutPage.classList.add("hidden");
      viewLoggedInPage.classList.remove("hidden");
  }
  
  function showSignInViewOnMobile() {
      toggleSignInPage(true);
  }
  
  function showLoggedOutViewOnDesktop() {
      toggleSignInPage(false);
  }
  
  function toggleSignInPage(open) {
          if (open) {
              viewSignInPage.classList.remove("hidden");
              viewLoggedOutPage.classList.add("hidden");
              viewSignInPage.classList.remove("hidden");
          } else {
              viewSignInPage.classList.add("hidden");
              viewLoggedOutPage.classList.remove("hidden");
              viewLoggedInPage.classList.add("hidden");
          }
  }
  
  function handleSignInWithGoogle() {
      if (window.innerWidth > 600) {
          // On desktop, show logged in view when "Sign In with Google" is clicked.
          showLoggedInView();
      } else {
          // On mobile, show the sign-in view when "Sign In with Google" is clicked.
          showSignInViewOnMobile();
      }
  }