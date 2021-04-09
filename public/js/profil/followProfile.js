const profilId = urlParams.get('id')

// If user watch the profil of another person, set "follow" to main profil button
if (accountId != profilId) {
    const mainProfilBtn = document.querySelector('.profilMainBtn')



    mainProfilBtn.innerHTML = 'Suivre'

    mainProfilBtn.addEventListener('click', () => {
        // Follow profil function
        mainProfilBtn.classList.add('profilFollowed')
        mainProfilBtn.innerHTML = 'Suivis'
    })
}