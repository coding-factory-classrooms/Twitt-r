printData()

async function printData(){
    // Get all messages
    const twertList = await getAllMessages()
    let twertCounter = 0
    // Get user id from url
    const url = window.location.search
    const urlParams = new URLSearchParams(url)
    const userId = urlParams.get('id')

    

    /* // If user has no message, display the empty message
    if (msgCounter == 0) {
        document.querySelector('.profilMsgHistory .emptyMsgAlert').style.display = 'block'
    } */
}

async function getAllMessages() {
    let twerts
    await fetch('/db/getMessages')
        .then((response) => response.json())
        .then((data) => twerts = data)
    return twerts
}