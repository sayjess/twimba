function onEmailSignInBtnsClick(isSignInPageViewOpen) {
    if(window.innerWidth > 600) {
        if(isSignInPageViewOpen){
            showSignInViewInDesktop()
        } else {
            goBackToLoginViewFromSignInViewInDesktop()
        }
    } else {
        if(isSignInPageViewOpen){
            showSignInViewInMobile()
        } else {
            goBackToLoginViewFromSignInViewInMobile()
        }
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

function onCloseEmailSignInPageClick() {
    if(window.innerWidth > 600) {
        goBackToLoginViewFromSignInViewInDesktop()
    } else {
        goBackToLoginViewFromSignInViewInMobile()
    }
}

