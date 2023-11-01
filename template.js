function authUpdateProfile() {
    const newDisplayName = displayNameInput.value;
    const newPhotoURL = newPhotoURLInput.files[0];;

    if (!newDisplayName || !newPhotoURL) {
        console.error('New display name or photo URL is empty');
        return;
    }

    updateProfile(auth.currentUser, {
        handle: newDisplayName, 
        profilePic: newPhotoURL
    })
        .then(() => {
            console.log('Profile updated!');
            initialUpdateProfileView(false)
        })
        .catch((error) => {
            console.error(error.message);
        });
}


---------

if (user && file) {
    const storageRef = storage.ref(`profile-photos/${user.uid}`);
    const uploadTask = storageRef.put(file);

    uploadTask.then((snapshot) => {
        return snapshot.ref.getDownloadURL();
    }).then((downloadURL) => {
        return user.updateProfile({
            photoURL: downloadURL
        });
    }).then(() => {
        console.log('Profile photo updated');
    }).catch((error) => {
        console.error(error);
    });
}