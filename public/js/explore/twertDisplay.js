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
                        <p class="diffTime">${getDiffTime(twert.createdAt)} </p>
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

async function rtThisTwert(idTwert, userId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: userId,
        })
    }
    await fetch('/db/addARetweet', options)
}
async function likeThisTwert(idTwert, userId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: userId,
        })
    }
    await fetch('/db/addALike', options)
}