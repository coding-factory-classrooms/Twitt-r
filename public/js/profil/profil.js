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