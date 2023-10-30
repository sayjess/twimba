const postsEl = document.getElementById("posts")

function fetchInRealtimeAndRenderPostsFromDB() {
    onSnapshot(collection(db, collectionName), (querySnapshot) => {
        clearAll(postsEl)
        
        querySnapshot.forEach((doc) => {
            renderPost(postsEl, doc.data())
        })
    })
}

/* == Functions - UI Functions == */

function renderPost(postsEl, postData) {
    postsEl.innerHTML += `
        <div class="post">
            <div class="header">
                <h3>${displayDate(postData.createdAt)}</h3>
                <img src="assets/emojis/${postData.mood}.png">
            </div>
            <p>
                ${replaceNewlinesWithBrTags(postData.body)}
            </p>
        </div>
    `
}
function clearAll(element) {
    element.innerHTML = ""
}

function renderPost(postsEl, postData) {
    feedEl.innerHTML += `
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${postData.profilePic}" class="profile-pic">
            <div>
                <div class="tweet-inner-upper">
                    <p class="handle">${postData.handle}</p>
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
                        <i class="fa-solid fa-heart ${likeIconClass}"
                        data-like="${postData.uid}"
                        ></i>
                        ${postData.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetIconClass}"
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


${repliesHtml}
            <div>
                <span class="user-reply-container">
                    <textarea class="user-reply" placeholder="Post your reply" id="reply-input"></textarea>
                    <button data disable data-reply-to-user="${postData.uid}">Reply</button>
                </span>
            </div>