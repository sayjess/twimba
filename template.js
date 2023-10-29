// function onEmailSignInBtnsClick(isSignInPageViewOpen) {
//     if(window.innerWidth > 600) {
//         if(isSignInPageViewOpen){
//             showSignInViewInDesktop()
//         } else {
//             goBackToLoginViewFromSignInViewInDesktop()
//         }
//     } else {
//         if(isSignInPageViewOpen){
//             showSignInViewInMobile()
//         } else {
//             goBackToLoginViewFromSignInViewInMobile()
//         }
//     }
// }

// function signInViewInDesktop(isOpen) {
//     if(isOpen){
//         SignInView(true)
//     } else {
//         SignInView(false)
//     }
// }

// function signInViewInMobile(isOpen) {
//     if(isOpen){
//         SignInView(true)
//         LogoutView(false)
//     }else {
//         SignInView(false)
//         LogoutView(true)
//     }
// }

// function onCloseEmailSignInPageClick() {
//     if(window.innerWidth > 600) {
//         goBackToLoginViewFromSignInViewInDesktop()
//     } else {
//         goBackToLoginViewFromSignInViewInMobile()
//     }
// }

function onEmailSignInBtnClick() {
    if(window.innerWidth > 600) {
        signInViewInDesktop(true)
    } else {
        signInViewInMobile(true)
    }
}

function onCreateAccountBtnClick() {
    if(window.innerWidth > 600) {
        signInViewInDesktop(true)
    } else {
        signInViewInMobile(true)
    }
}

function signInOrCreateViewInDesktop(isOpen, view=null) {
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

function signInOrCreateViewInMobile(isOpen, view=null) {
    if(isOpen){
        SignInView(true)
        LogoutView(false)
    }else {
        SignInView(false)
        LogoutView(true)
    }

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



