const discussionContainer = document.querySelector('.discussionContainer .discussion')   
const discussionInput = document.querySelector('.discussionInputContainer input')
const sendMsgBtn = document.querySelector('.discussionInputContainer button')
let interval

async function displayMessages(interlocutorId, interlocutor) {
    // Hide the empty discussion message
    document.querySelector('.emptyDiscussion').style.display = 'none'

    // Check if the discussion isn't already displayed
    if (interlocutorId != discussionDisplayed) {
        discussionDisplayed = interlocutorId
        clearInterval(interval)

        // Set the good data for input and button
        discussionInput.placeholder = `Écrire à ${interlocutor}`
        sendMsgBtn.setAttribute('onclick', `sendMsg('${interlocutorId}')`)

        // Display all messages of the discussion
        const data = {
           userId: userId,
           interlocutorId: interlocutorId 
        }
        // Get all messages between user and interlocutor
        await fetch('/db/getPrivateDiscussion', { method: 'POST', body: JSON.stringify(data) })
        .then(response => response.json())
        .then(discussion => {
            const interlocutorNameElement = document.querySelector('.discussionContainer .discussionTitle p')
            
            // Set the name of the interlocutor
            interlocutorNameElement.innerHTML = discussion.interlocutor
    
            // Reset the discussion container
            const discussionMsg = document.querySelectorAll('.discussionContainer .discussion div')
            discussionMsg.forEach(msg => {
                discussionContainer.removeChild(msg)
            })

            // Display all messages of the discussion
            discussion.messages.forEach(msg => {
                displayMsg(msg)
            })
        })
        // Each 2 seconds, check if there is a new message
        interval = setInterval(async () => {
            let AllMessages = await getAllMessagesOfDiscussion(userId, interlocutorId);
            let messagesList = document.querySelectorAll('.discussionContainer .discussion .msgContainer')

            // console.log('local  : '+messagesList.length);
            // console.log('in BDD : '+AllMessages.length);

            if (messagesList.length != AllMessages.length) {
                let diffMsg = AllMessages.length - messagesList.length

                for (let i = 1; i <= diffMsg; i++) {
                    const msg = AllMessages[AllMessages.length - i]
                    displayMsg(msg)
                }
            }  
        }, 2000)
    }
}
function displayMsg(msg) {
    discussionContainer.insertAdjacentHTML('beforeend', `
    <div class="msgContainer ${msg.author}">
        <p>${msg.body}</p>
    </div>
`)
}
async function sendMsg(interlocutorId) {
    // Get message body
    const msgBody = discussionInput.value
    if (msgBody.length > 0) {
        discussionInput.value = ''
        
        // Display the message in the discussion container
        displayMsg({ author: 'user', body: msgBody })
    
        // Save the message in the database
        const data = {
            msgBody: msgBody,
            interlocutorId: interlocutorId,
            userId: userId
        }
        await fetch('/db/saveNewMsg', { method: 'POST', body: JSON.stringify(data) })
    }
}
async function getAllMessagesOfDiscussion(userId, interlocutorId) {
    let toReturn
    const data = {
        userId: userId,
        interlocutorId: interlocutorId
    }
    await fetch('/db/getPrivateDiscussion', { method: 'POST', body: JSON.stringify(data) })
    .then(response => response.json())
    .then((discussion) => {
        toReturn = discussion.messages
    })
    return toReturn
}

// fetch('/db/createAccount', { method: 'POST', body: JSON.stringify({
//     username: 'Ougo 1',
//         email: 'ougo1@gmail.com',
//         password: 'azerty'
// }) })
// fetch('/db/createAccount', { method: 'POST', body: JSON.stringify({
//     username: 'Ougo 3',
//         email: 'ougo3@gmail.com',
//         password: 'azerty'
// }) }).then(response => console.log(response))