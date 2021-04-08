// Get user id from url
const url = window.location.search
const urlParams = new URLSearchParams(url)
const userId = urlParams.get('id')
const accountId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId

setUserData()

async function setUserData() {
    let msgCounter = 0
    const totalTwertsElements = document.querySelectorAll('.twertsCounter span')
    const descriptionElement = document.querySelector('.description')
    const followAndFollowersElements  = document.querySelectorAll('.counterFollow span')
    const twertsContainerElement = document.querySelector('.twertsContainer')
    const twertsElements = document.querySelectorAll('.twertsContainer twertCard')
    // Get user profile from id
    const user = await getUser()

    // Delete all twerts in the container
    for (let i = 0; i < twertsElements.length; i++) {
        twertsContainerElement.removeChild(twertsElements[i]);
    }

    // Set profile picture 
    const profilePictureContainer = document.querySelector('.profilImage img')
    profilePictureContainer.src = user.profilImg

    // Set the username on each span who contains the class "username"
    const usernameSpanList = document.querySelectorAll('.username')
    for (let i = 0; i < usernameSpanList.length; i++) {
        usernameSpanList[i].innerHTML = user.username
    }

    // Set the total twerts counter
    const totalTwertsCounter = await getAllUserMessagesCount(userId)
    totalTwertsElements[0].innerHTML = totalTwertsCounter
    totalTwertsElements[1].innerHTML = `Twert${totalTwertsCounter > 1 ? 's' : ''}`

    // Set the description of the profile
    const descriptionProfile = user.description
    descriptionElement.innerHTML = descriptionProfile

    // Set the count of follow and followers
    const followersCount = user.followers
    const followCount = user.follow
    followAndFollowersElements[0].innerHTML = followersCount.length + ' '
    followAndFollowersElements[1].innerHTML = ` abonné${followersCount.length > 1 ? 's' : ''}`
    followAndFollowersElements[2].innerHTML = followCount.length + ' '
    followAndFollowersElements[3].innerHTML = ` abonnement${followCount.length > 1 ? 's' : ''}`

    // Display all the twerts
    const allTwertsProfile = await getAllUserMessages(userId)
    for (let i = 0; i < allTwertsProfile.length; i++) {
        const twert = allTwertsProfile[i];
        
        const date = new Date(twert.createdAt)
        const today = new Date()
        let diffDate = dateDiff(date, today)
        if (diffDate.day > 0 ) {
            diffDate = `${diffDate.day}j`
        } else if (diffDate.hour > 0 ) {
            diffDate = `${diffDate.hour}h`
        }else if (diffDate.min > 0 ) {
            diffDate = `${diffDate.min}m`
        }else{
            diffDate = `${diffDate.sec}s`
        }

        twertsContainerElement.insertAdjacentHTML('afterbegin', `
            <div class="twertCard">
                <div class="twertUserAndBody">
                    <div class="ppTwertContainer">
                        <div class="ppTwert">
                            <img src="${user.profilImg}" alt="profilImage">
                        </div>
                    </div>
                    <div class="twertInfoContainer">
                        <div class="twertInfo">
                            <p class="username">${user.username}</p>
                            <p class="diffTime">${diffDate} </p>
                        </div>
                        <div class="twertContent">
                            <p class="body">${twert.body}</p>
                        </div>
                    </div>
                </div>
                <div class="interactContainer">
                    <div class="comentContainer">
                        <button type="button" class="comentIcon btn" onclick="commentThisTwert('${twert._id}','${accountId}')"></button>
                        <p>${twert.comments.length}</p>
                    </div>
                    <div class="rtContainer">
                        <button type="button" class="rtIcon btn" onclick="rtThisTwert('${twert._id}','${accountId}')"></button>
                        <p>${twert.retweet.length}</p>
                    </div>
                    <div class="favContainer">
                        <button type="button" class="favIcon btn" onclick="likeThisTwert('${twert._id}','${accountId}')"></button>
                        <p>${twert.fav.length}</p>
                    </div>
                </div>
            </div>
        `)
        msgCounter++
    }
    // If user has no message, display the empty message
    if (msgCounter == 0) {
        document.querySelector('.twertsContainer .emptyMsgAlert').style.display = 'block'
    }
}

async function getUser() {
    let user
    const options = {
        method: 'POST',
        body: userId
    }
    await fetch('/db/getAccount', options)
    .then(response => response.json())
    .then((data) => user = data )
    .catch(() => window.location.href = 'profilNotFound.html')
    return user
}

async function getAllUserMessagesCount(id) {
    let msgList = await getAllMessages()
    let msgCounter = 0

    for (let i = 0; i < msgList.length; i++) {
        if (msgList[i].authorId == id) {
            msgCounter++
        }
    }
    return msgCounter
}

async function getAllUserMessages(id){
    let msgList = await getAllMessages()
    let profilMsgList = []

    for (let i = 0; i < msgList.length; i++) {
        if (msgList[i].authorId == id) {
            profilMsgList.push(msgList[i])
        }
    }
    return profilMsgList
}

async function getAllMessages() {
    let messages
    await fetch('/db/getMessages')
        .then((response) => response.json())
        .then((data) => messages = data)
    return messages
}

function dateDiff(date1, date2){
    var diff = {}  
    var tmp = date2 - date1;
 
    tmp = Math.floor(tmp/1000); 
    diff.sec = tmp % 60; 
 
    tmp = Math.floor((tmp-diff.sec)/60); 
    diff.min = tmp % 60; 
 
    tmp = Math.floor((tmp-diff.min)/60); 
    diff.hour = tmp % 24;   
     
    tmp = Math.floor((tmp-diff.hour)/24);
    diff.day = tmp;
     
    return diff;
}