// const data = {
//     userId: '606c930e33ef3f96a9a49326'
// }
// localStorage.setItem('twitt-r-data', JSON.stringify(data))

const twertListContainer = document.querySelector('.twertListContainer')
const accountId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId

displayTimeLine()

// Set the profil img and the link to the profil page
setProfilImgAndLink()

// Set the textarea listener
const textarea = document.querySelector('.createNewTwertInputContainer textarea')
textarea.addEventListener('input', () => {
    document.querySelector('.createNewTwertInputContainer span').innerHTML = textarea.value.length + '/255'
})

async function displayTimeLine() {
    // Get twerts ans retwerts of all followed profil of the user
    const twertList = await getTwertList()
    const twerts = await getAllTwerts()

    ReactDOM.render(<TwertList twertList = {twertList} />, twertListContainer)
}
async function getTwertList() {
    let twertList = []
    const twerts = await fetch('/db/getFollowedProfilsActivity', { method: 'POST', body: accountId }).then(response => response.json())

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
async function setProfilImgAndLink() {
    // Set the profil img
    const user = await getTwertAuthor(accountId)
    document.querySelector('.profilImgContainer img').src = user.profilImg 

    // Set the profil link
    document.querySelector('.profilImgContainer a').setAttribute('href', `profil.html?id=${accountId}`)
}
function setImgPreview(event) {
    const img = event.target.files[0]
    const reader = new FileReader()
    
    reader.addEventListener('load', () => {
        document.querySelector('.createNewTwertInputContainer img').src = reader.result
    })
    reader.readAsDataURL(img)
}
async function validTextArea(){
    let authorId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId
    let authorName = await getAuthorName(authorId);
    let msg = document.querySelector('#msgArea').value
    let img = document.querySelector('.fileInput').files[0]

    // const reader = new FileReader()
    // reader.addEventListener('load', async () => { 
    //     let messageData = {
    //         authorId: authorId,
    //         authorName: authorName,
    //         body: msg,
    //         bodyImg: {
    //             data: reader.result,
    //             contentType: img.type
    //         }
    //     }
    
    //     let sendData = {
    //         method: 'POST',
    //         body: JSON.stringify(messageData)
    //     }
    //     await fetch ('/db/sendMsg', sendData).then(() => document.getElementById('msgArea').value = '')
    
    // })
    //reader.readAsDataURL(img)

    if (msg.length > 0) {
        let messageData = {
            authorId: authorId,
            authorName: authorName,
            body: msg
        }
    
        let sendData = {
            method: 'POST',
            body: JSON.stringify(messageData)
        }
        await fetch ('/db/sendMsg', sendData).then(() => {
            document.getElementById('msgArea').value = ''
            document.querySelector('.createNewTwertInputContainer img').src = ''
        })
    }
}
async function getAuthorName(authorId){
    let options = {
        method: 'POST',
        body: authorId
    }
    let x;
    await fetch ('/db/getAuthorName', options)
    .then(response=>response.text())
    .then(username=>{
        x=username;
    })
    return x
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


