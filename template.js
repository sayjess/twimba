<div class="tweet">
    <img src="${postData.profilePic}" class="profile-pic">
    <p class="handle">${postData.handle}</p>
    <p class="date-posted">${displayDate(postData.createdAt)}</p>
    <i class="fa-solid fa-ellipsis" data-dots="${postData.uid}"></i>
    <p class="tweet-text">${postData.tweetText}</p>
    <span class="tweet-detail">
        <i class="fa-regular fa-comment-dots"
            data-reply="${postData.uuid}">
        </i>
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
                 
        
