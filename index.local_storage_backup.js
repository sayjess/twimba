import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleOpenReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } else if(e.target.dataset.dots){
        handleThreeDotsClick(e.target.dataset.dots)
    } else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    } 
    else if(e.target.dataset.replyToUser){
        handleReplyToUser(e.target.dataset.replyToUser)
    } 
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleOpenReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleThreeDotsClick(dots){
    document.getElementById(`delete-${dots}`).style.display = 'block'
}

function handleDeleteClick(del){
    for (let i = 0; i < tweetsData.length; i++) {
        if (tweetsData[i].uuid === del) {
            tweetsData.splice(i, 1); // Remove the matching element
            i--; // Decrement the index to account for the removed element
        }
    }
    render()

}

function handleReplyToUser(replyId){
    const replyInputEl = document.getElementById("reply-input")
    console.log('reply handler')
    if(replyInputEl.value){
        tweetsData[0].replies.push(
            {
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: replyInputEl.value,
            }
        )
    }
    render()
    document.getElementById(`replies-${replyId}`).style.display = "block"
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
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
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="tweet-inner-upper">
                <p class="handle">${tweet.handle}</p>
                <div class="delete" id="delete-${tweet.uuid}" data-delete='${tweet.uuid}'>
                    <i class="fa-regular fa-trash-can" data-delete='${tweet.uuid}'></i>
                    <span data-delete='${tweet.uuid}'>Delete</span>
                </div>
                <i class="fa-solid fa-ellipsis" data-dots="${tweet.uuid}"></i>
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div>
            <span class="user-reply-container">
                <textarea class="user-reply" placeholder="Post your reply" id="reply-input"></textarea>
                <button data disable data-reply-to-user="${tweet.uuid}">Reply</button>
            </span>
        </div>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

