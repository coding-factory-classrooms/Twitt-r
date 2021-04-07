// const data = {
//     userId: '606c930e33ef3f96a9a49326'
// }
// localStorage.setItem('twitt-r-data', JSON.stringify(data))

async function validTextArea(){
    let authorId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId
    let authorName = await getAuthorName(authorId);
    let msg = document.querySelector('#msgArea').value

    let messageData = {
        authorId: authorId,
        authorName: authorName,
        body: msg
    }

    console.log(messageData);
    let sendData={
        method: 'POST',
        body: JSON.stringify(messageData)
    }
    await fetch ('/db/sendMsg', sendData)
}

async function getAuthorName(authorId){
    let options ={
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


