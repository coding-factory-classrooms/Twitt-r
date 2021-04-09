setInterval(async () => {
    await checkLikeRtComent(userId, accountId)
}, 2000); 
// Toggle Rt
async function toggleRt(idTwert, profileId) {
    const twert = await getMesageById(idTwert)
    if (twert.retweet.includes(profileId)) {
        await deleteRtThisTwert(idTwert, profileId)
    } else {
        await rtThisTwert(idTwert, profileId)
    }
}
// Rt the twert
async function rtThisTwert(idTwert, profileId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: profileId,
        })
    }
    await fetch('/db/addARetweet', options)
    const twert = await getMesageById(idTwert)
    allTwertsTextProfile = document.querySelectorAll('.rtContainer p')
    allRetwertElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < allRetwertElements.length; i++) {
        const retwertElement = allRetwertElements[i];
        const retwertTextElement = allTwertsTextProfile[i]
        onclickContain = retwertElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert) && twert._id == idTwert) {
            retwertElement.style.backgroundImage = "url('../img/retweet-green.png')"
            retwertTextElement.innerHTML = twert.retweet.length + 1
        }
    }
}
// Delete a retwert of a twert
async function deleteRtThisTwert(idTwert, profileId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: profileId,
        })
    }
    await fetch('/db/deleteARetweet', options)
    const twert = await getMesageById(idTwert)
    allTwertsTextProfile = document.querySelectorAll('.rtContainer p')
    allRetwertElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < allRetwertElements.length; i++) {
        const retwertElement = allRetwertElements[i];
        const retwertTextElement = allTwertsTextProfile[i]
        onclickContain = retwertElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert) && twert._id == idTwert) {
            retwertElement.style.backgroundImage = "url('../img/retweet.png')"
            retwertTextElement.innerHTML = twert.retweet.length - 1
        }
    }
    
}
// Toggle Like
async function toggleLike(idTwert, profileId) {
    const twert = await getMesageById(idTwert)
    if (twert.fav.includes(profileId)) {
        await deleteLikeThisTwert(idTwert, profileId)
    } else {
        await likeThisTwert(idTwert, profileId)
    }
}
// Like the twert
async function likeThisTwert(idTwert, profileId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: profileId,
        })
    }
    await fetch('/db/addALike', options)
    const twert = await getMesageById(idTwert)
    let allLikeTextElements = document.querySelectorAll('.favContainer p')
    let allLikeElements = document.querySelectorAll('.favIcon')
    for (let i = 0; i < allLikeElements.length; i++) {
        const likeElement = allLikeElements[i];
        const likeTextElement = allLikeTextElements[i];
        onclickContain = likeElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert) && twert._id == idTwert) {
            likeElement.style.backgroundImage = "url('../img/like-red.png')"
            likeTextElement.innerHTML = twert.fav.length + 1
        }
    }
}
// Delete a retwert of a twert
async function deleteLikeThisTwert(idTwert, profileId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: profileId,
        })
    }
    await fetch('/db/deleteALike', options)
    const twert = await getMesageById(idTwert)
    allTwertsTextProfile = document.querySelectorAll('.favContainer p')
    allLikeElements = document.querySelectorAll('.favIcon')
    for (let i = 0; i < allLikeElements.length; i++) {
        const likeElement = allLikeElements[i];
        const likeTextElement = allTwertsTextProfile[i]
        onclickContain = likeElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert) && twert._id == idTwert) {
            likeElement.style.backgroundImage = "url('../img/like.png')"
            likeTextElement.innerHTML = twert.fav.length - 1
        }
    }
}
// Check if the count of like or of retwert or of comment have changed
async function checkLikeRtComent(id, profileId){
    const twertList = await getAllMessages()
    let allLikeTextElements = document.querySelectorAll('.favContainer p')
    let allLikeElements = document.querySelectorAll('.favIcon')
    let allRtTextElements = document.querySelectorAll('.rtContainer p')
    let allRtElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < twertList.length; i++) {
        const twert = twertList[i];
        
        for (let j = 0; j < allLikeTextElements.length; j++) {
            const likeTextElement = allLikeTextElements[j];
            const likeElement = allLikeElements[j]
            if (likeTextElement.innerHTML != twert.fav.length.toString() && likeElement.getAttribute('onclick').includes(twert._id)) {
                if (twert.fav.includes(profileId)) {
                    likeElement.style.backgroundImage = "url('../img/like-red.png')"
                } else {
                    likeElement.style.backgroundImage = "url('../img/like.png')"
                }
                likeTextElement.innerHTML = twert.fav.length
            }
        }
        for (let j = 0; j < allRtTextElements.length; j++) {
            const rtTextElement = allRtTextElements[j];
            const retwertElement = allRtElements[j]
            if (rtTextElement.innerHTML != twert.retweet.length.toString() && retwertElement.getAttribute('onclick').includes(twert._id)) {                if (twert.retweet.includes(profileId)) {
                    retwertElement.style.backgroundImage = "url('../img/retweet-green.png')"
                } else {
                    retwertElement.style.backgroundImage = "url('../img/retweet.png')"
                }
                rtTextElement.innerHTML = twert.retweet.length
            }
        }
    }
}

async function getMesageById(id) {
    let twert
    const options = {
        method: 'POST',
        body: id
    }
    await fetch('/db/getMessageById', options)
        .then(response => response.json())
        .then((data) => twert = data )
    return twert
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

async function getAllMessages() {
    let messages
    await fetch('/db/getMessages')
        .then((response) => response.json())
        .then((data) => messages = data)
    return messages
}