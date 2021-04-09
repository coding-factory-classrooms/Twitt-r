// If user watch his profil, set "edit profil" to main profil button
if (accountId == profilId) {
    const mainProfilBtn = document.querySelector('.profilMainBtn')
    mainProfilBtn.innerHTML = 'Éditer le profil'

    mainProfilBtn.addEventListener('click', () => {
        // Edit profil function
    })
}