const twertListContainer = document.querySelector('.twertListContainer')

displayAllTwerts()

async function displayAllTwerts() {
    const twertList = await getAllTwerts()
    twertList.forEach(twert => {
        displayTwert(twert)
    })
}

async function getAllTwerts() {
    let toReturn

    await fetch('/db/getMessages')
    .then(response => response.json())
    .then(twertList => toReturn = twertList)

    return toReturn
}
function displayTwert(twert) {
    twertListContainer.insertAdjacentHTML('afterbegin', `
        <div class="twert">
            <p>${twert.body}</p>
        </div>
    `)
}