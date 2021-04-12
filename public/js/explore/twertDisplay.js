// Get user id from url
const url = window.location.search
const urlParams = new URLSearchParams(url)
const userId = urlParams.get('id')
const twertListContainer = document.querySelector('.twertListContainer')
const accountId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId

displayAllTwerts()

async function displayAllTwerts() {
    const twertList = await getAllTwerts()

    twertList.forEach(async twert => {
        const user = await getTwertAuthor(twert.authorId)
        displayTwert(twert, user)
    })
}

function displayTwert(twert, user) {
    twertListContainer.insertAdjacentHTML('afterbegin', `
        <div class="twertCard" id="${twert._id}">
            <div class="twertUserAndBody" onclick="goToTwertPage('${twert._id}')">
                <div class="ppTwertContainer">
                    <div class="ppTwert">
                        <a href="profil.html?id=${user._id}"><img src="${user.profilImg}" alt="profilImage"></a>
                    </div>
                </div>
                <div class="twertInfoContainer">
                    <div class="twertInfo">
                        <a href="profil.html?id=${user._id}"><p class="username">${user.username}</p></a>
                        <p class="diffTime">${getDiffTime(twert.createdAt)} </p>
                    </div>
                    <div class="twertContent">
                        <p class="body">${twert.body}</p>
                    </div>
                </div>
            </div>
            <div class="interactContainer">
                <div class="comentContainer">
                    <button type="button" class="comentIcon btn" onclick="commentThisTwert('${twert._id}','${accountId}', '${user.username}', '${user._id}')"></button>
                    <p>${twert.comments.length}</p>
                </div>
                <div class="rtContainer">
                    <button type="button" class="rtIcon btn" onclick="toggleRt('${twert._id}','${accountId}')"></button>
                    <p>${twert.retweet.length}</p>
                </div>
                <div class="favContainer">
                    <button type="button" class="favIcon btn" onclick="toggleLike('${twert._id}','${accountId}')"></button>
                    <p>${twert.fav.length}</p>
                </div>
            </div>
        </div>
    `)
    let allRetwertElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < allRetwertElements.length; i++) {
        const retwertElement = allRetwertElements[i];
        onclickContain = retwertElement.getAttribute('onclick')
        if (onclickContain.includes(twert._id) && twert.retweet.includes(accountId)) {
            retwertElement.style.backgroundImage = "url('../img/retweet-green.png')"
        }
    }
    let allLikeElements = document.querySelectorAll('.favIcon')
    for (let i = 0; i < allLikeElements.length; i++) {
        const likeElement = allLikeElements[i];
        onclickContain = likeElement.getAttribute('onclick')
        if (onclickContain.includes(twert._id) && twert.fav.includes(accountId)) {
            likeElement.style.backgroundImage = "url('../img/like-red.png')"
        }
    }
}
function getDiffTime(createdAt) {
    const date = new Date(createdAt)
    const today = new Date()
    
    const diffMilli = today - date
    const diffMinutes = Math.floor((diffMilli % (1000 * 60 * 60)) / (1000 * 60))
    const diffHours = Math.floor((diffMilli % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed(0)
    const diffDays = Math.floor(((diffMilli % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) / 24).toFixed(0)

    if (diffDays > 0) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    else if (diffHours > 0) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`
    else if (diffMinutes > 0) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
    else return 'à l\'instant'
}

async function getAllTwerts() {
    let toReturn

    await fetch('/db/getMessages')
    .then(response => response.json())
    .then(twertList => toReturn = twertList)

    return toReturn
}

async function getTwertAuthor(id) {
    let toReturn

    await fetch('/db/getAccount', { method: 'POST', body: id })
    .then(response => response.json())
    .then(result => toReturn = result)

    return toReturn
}
