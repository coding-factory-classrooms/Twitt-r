const twertListContainer = document.querySelector('.twertListContainer')
const accountId =  JSON.parse(localStorage.getItem('twitt-r-data')).userId

displayAllTwerts()

async function displayAllTwerts() {
    const twertList = await getTwertList()
    const twerts = await getAllTwerts()

    ReactDOM.render(<TwertList twertList = {twertList} />, twertListContainer)
}
async function displayTwert(twert, user) {
    const twertList = document.querySelector('.twertList')
    ReactDOM.render(<Twert twert = {twert} user = {user} accountId = {accountId} />, twertList)
}
async function getTwertList() {
    let twertList = []
    const twerts = await getAllTwerts()

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