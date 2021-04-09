setInterval(async () => {
    await checkLikeRtComent(userId)
}, 2000); 
// Toggle Rt or Delete Rt
async function ToggleRt(idTwert, profileId) {
    
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
            retwertTextElement.innerHTML = twert.retweet.length
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
            retwertTextElement.innerHTML = twert.retweet.length
        }
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
            likeTextElement.innerHTML = twert.fav.length
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
            likeTextElement.innerHTML = twert.fav.length
        }
    }
}
// Check if the count of like or of retwert or of comment have changed
async function checkLikeRtComent(id){
    twertList = await getAllUserMessages(id)
    let allLikeTextElements = document.querySelectorAll('.favContainer p')
    let allLikeElements = document.querySelectorAll('.favIcon')
    let allRtTextElements = document.querySelectorAll('.rtContainer p')
    let allRtElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < twertList.length; i++) {
        const twert = twertList[i];
        for (let j = 0; j < allLikeTextElements.length; j++) {
            const likeTextElement = allLikeTextElements[j];
            if (likeTextElement.innerHTML != twert.fav.length.toString() && allLikeElements[j].getAttribute('onclick').includes(twert._id)) {
                likeTextElement.innerHTML = twert.fav.length
            }
        }
        for (let j = 0; j < allRtTextElements.length; j++) {
            const rtTextElement = allRtTextElements[j];
            if (rtTextElement.innerHTML != twert.retweet.length.toString() && allRtElements[j].getAttribute('onclick').includes(twert._id)) {
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