// js/dossier.js - VERSION FINALE HARMONISÉE

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const coacheeName = decodeURIComponent(urlParams.get('name') || 'Coaché Inconnu');

    // 1. Charger TOUS les coachés
    const allCoachees = DataStorage.get(DataStorage.KEYS.COACHEDS);

    // 2. Trouver le coaché spécifique qui nous intéresse
    const currentCoachee = allCoachees.find(c => c.name === coacheeName);

    if (!currentCoachee) {
        document.body.innerHTML = '<h1>Erreur : Coaché non trouvé</h1>';
        return;
    }

    // 3. Lancer l'affichage avec les données du bon coaché
    displayAllCoacheeData(currentCoachee);
    setupEventListeners(currentCoachee, allCoachees);
});

function displayAllCoacheeData(coachee) {
    // Afficher le nom
    document.getElementById('coachedName').textContent = `- ${coachee.name}`;

    // Remplir la carte de profil
    document.getElementById('fullName').textContent = coachee.name || '-';
    document.getElementById('targetPosition').textContent = coachee.position || '-';
    document.getElementById('sector').textContent = coachee.sector || '-'; // Note: ces champs devront être ajoutés au formulaire de création/édition
    document.getElementById('experience').textContent = coachee.experience || '-';
    document.getElementById('email').textContent = coachee.email || '-';
    document.getElementById('phone').textContent = coachee.phone || '-';
    document.getElementById('location').textContent = coachee.location || '-';
    document.getElementById('startDate').textContent = new Date(coachee.startDate + 'T00:00:00').toLocaleDateString('fr-FR');

    // Afficher l'historique des sessions
    const sessionsHistoryContainer = document.getElementById('sessionsHistory');
    const sessions = coachee.sessions || [];
    sessionsHistoryContainer.innerHTML = '';
    if (sessions.length > 0) {
        sessions.slice(0, 5).forEach(session => { // Affiche les 5 dernières
            sessionsHistoryContainer.innerHTML += `<div class="p-2 border-bottom">${session.stepName} - ${new Date(session.date).toLocaleDateString('fr-FR')}</div>`;
        });
    } else {
        sessionsHistoryContainer.innerHTML = `<p class="text-muted">Aucune session enregistrée.</p>`;
    }

    // Charger les notes
    const notesTextArea = document.getElementById('coachNotes');
    notesTextArea.value = coachee.notes || '';
}

function setupEventListeners(currentCoachee, allCoachees) {
    const saveNotesBtn = document.querySelector('button[onclick="saveCoachNotes()"]');
    
    // Remplacer l'ancien onclick par une méthode propre
    if (saveNotesBtn) {
        saveNotesBtn.onclick = null; // Enlever l'ancien listener
        saveNotesBtn.addEventListener('click', () => {
            const newNotes = document.getElementById('coachNotes').value;
            
            // Mettre à jour l'objet du coaché
            currentCoachee.notes = newNotes;

            // Trouver l'index du coaché dans la liste globale pour le remplacer
            const coacheeIndex = allCoachees.findIndex(c => c.id === currentCoachee.id);
            if (coacheeIndex > -1) {
                allCoachees[coacheeIndex] = currentCoachee;
            }

            // Sauvegarder la liste ENTIÈRE des coachés mise à jour
            DataStorage.save(DataStorage.KEYS.COACHEDS, allCoachees);
            
            alert('Notes sauvegardées !');
        });
    }

    // Gérer le bouton "Nouvelle Session"
    const startSessionBtn = document.querySelector('button[onclick="startSession()"]');
    if(startSessionBtn) {
        startSessionBtn.onclick = null;
        startSessionBtn.addEventListener('click', () => {
             window.location.href = `session.html?coacheeId=${currentCoachee.id}`;
        });
    }
}
