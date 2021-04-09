// setInterval(await checkLikeRtComent(userId) , 2000)
setInterval(async () => {
    await checkLikeRtComent(userId)
}, 2000); 
// Rt the twert
async function rtThisTwert(idTwert, userId) {
    const allTwertsProfile = await getAllUserMessages(userId)
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: userId,
        })
    }
    await fetch('/db/addARetweet', options)
    allTwertsTextProfile = document.querySelectorAll('.favContainer p')
    allRetwertElements = document.querySelectorAll('.rtIcon')
    for (let i = 0; i < allRetwertElements.length; i++) {
        const retwertElement = allRetwertElements[i];
        const retwertTextElement = allLikeTextElements[i]
        onclickContain = retwertElement.getAttribute('onclick')
        for (let j = 0; j < allTwertsProfile.length; j++) {
            const twert = allTwertsProfile[j];
            if (onclickContain.includes(idTwert)) {
                retwertElement.style.backgroundImage = "url('../img/retweet-green.png')"
                retwertTextElement.innerHTML = twert.retweet.length
            }
        }
    }
}
// Like the twert
async function likeThisTwert(idTwert, userId) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            idTwert: idTwert,
            userId: userId,
        })
    }
    await fetch('/db/addALike', options)
    let allLikeTextElements = document.querySelectorAll('.favContainer p')
    let allLikeElements = document.querySelectorAll('.favIcon')
    for (let i = 0; i < allLikeElements.length; i++) {
        const likeElement = allLikeElements[i];
        const likeTextElement = allLikeTextElements[i].innerHTML;
        onclickContain = likeElement.getAttribute('onclick')
        if (onclickContain.includes(idTwert)) {
            likeElement.style.backgroundImage = "url('../img/like-red.png')"
            console.log(likeTextElement);
            likeTextElement.innerHTML = twert.fav.length
        }
    }
}

async function checkLikeRtComent(id){
    twertList = await getAllUserMessages(id)
    let allLikeElements = document.querySelectorAll('.favContainer p')
    for (let i = 0; i < twertList.length; i++) {
        const twert = twertList[i];
        for (let j = 0; j < allLikeElements.length; j++) {
            const likeTextElement = allLikeElements[j].innerHTML;
            if (likeTextElement != twert.fav.length.toString() ) {
                console.log(twert.fav.length.toString());
                likeTextElement.innerHTML = twert.fav.length
            }
        }
    }
}