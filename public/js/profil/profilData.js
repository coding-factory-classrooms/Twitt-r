const userId = urlParams.get('id')
const totalTwertsElements = document.querySelectorAll('.twertsCounter span')
const descriptionElement = document.querySelector('.description')
const followAndFollowersElements  = document.querySelectorAll('.counterFollow span')
const twertsContainerElement = document.querySelector('.twertsContainer')

setUserData()

async function setUserData() {  

    // Get user profile from id
    let user = await getUser(userId)

    // Set background profile picture 
    const backgroundProfilContainer = document.querySelector('.backgroundImage img')
    backgroundProfilContainer.src = user.backgroundProfilImg

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
    
    $('.twertsOfProfilBtn').click()
}
// Display all the message for this profile
async function displayTwertProfile() {
    $('.twertsOfProfilBtn').css({"color": "rgb(29, 161, 242)" , "border-bottom": "2px solid rgb(29, 161, 242)"})
    $('.twertsLikeOfProfilBtn').css({"color": "rgb(136, 153, 166)" , "border-bottom": "0"})
    
    // Delete all twerts in the container
    ReactDOM.unmountComponentAtNode(twertsContainerElement)

    // Display all the twerts
    const twertList = await getTwerProfiltList()
    const user = await getUser(userId)

    ReactDOM.render(<TwertList twertList = {twertList} />, twertsContainerElement)
}
// Display all the message that the profile liked
async function displayLikedTwertProfile() {
    $('.twertsOfProfilBtn').css({"color": "rgb(136, 153, 166)" , "border-bottom": "0"})
    $('.twertsLikeOfProfilBtn').css({"color": "rgb(29, 161, 242)" , "border-bottom": "2px solid rgb(29, 161, 242)"})

    // Delete all twerts in the container
    ReactDOM.unmountComponentAtNode(twertsContainerElement)

    // Display all the twerts
    const twertList = await getTwertLikedProfilList()
    const user = await getUser(userId)
    
    ReactDOM.render(<TwertList twertList = {twertList} />, twertsContainerElement)
}
async function getTwerProfiltList() {
    let twertList = []
    const twerts = await getAllUserMessages(userId)

    twerts.forEach(async twert => {
        const user = await getTwertAuthor(twert.authorId)
        const obj = {
            twert: twert,
            user: user
        }
        twertList.push(obj)
    })
    return twertList
}
async function getTwertLikedProfilList() {
    let twertList = []
    const twerts = await getAllMessages()

    twerts.forEach(async twert => {
        twert.fav.forEach(async fav => {
            if (fav == userId) {
                const user = await getTwertAuthor(twert.authorId)
                const obj = {
                    twert: twert,
                    user: user
                }
                twertList.push(obj)
            }
        })
    })
    return twertList
}
async function getUser(authorId) {
    let user
    const options = {
        method: 'POST',
        body: authorId
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
async function getTwertAuthor(id) {
    let toReturn

    await fetch('/db/getAccount', { method: 'POST', body: id })
    .then(response => response.json())
    .then(result => toReturn = result)

    return toReturn
}