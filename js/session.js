// js/session.js - NOUVEAU FICHIER HARMONISÉ

document.addEventListener('DOMContentLoaded', function() {
    // --- ÉLÉMENTS DU DOM ---
    const coachedNameDisplay = document.getElementById('coachedName');
    const stepSelect = document.getElementById('currentStep');
    const openPromptBtn = document.getElementById('openPromptBtn');
    const sessionNotesTextarea = document.getElementById('sessionNotes');
    const endSessionBtn = document.getElementById('endSessionBtn');

    // --- INITIALISATION ---
    const urlParams = new URLSearchParams(window.location.search);
    const coacheeId = urlParams.get('coacheeId');
    
    let allCoachees = DataStorage.get(DataStorage.KEYS.COACHEDS);
    let currentCoachee = allCoachees.find(c => c.id === coacheeId);
    
    let allPrompts = DataStorage.get(DataStorage.KEYS.PROMPTS);

    if (!currentCoachee) {
        document.body.innerHTML = '<h1>Erreur : ID du coaché non trouvé.</h1>';
        return;
    }

    // --- FONCTIONS ---
    function initializePage() {
        coachedNameDisplay.textContent = `- ${currentCoachee.name}`;
        
        // Remplir le select des étapes/prompts
        stepSelect.innerHTML = '';
        allPrompts.forEach(prompt => {
            stepSelect.innerHTML += `<option value="${prompt.id}">${prompt.title}</option>`;
        });
        
        // Sélectionner l'étape actuelle du coaché par défaut
        stepSelect.value = currentCoachee.currentStep || allPrompts[0].id;

        setupEventListeners();
    }

    function setupEventListeners() {
        openPromptBtn.addEventListener('click', openPromptInChatGPT);
        endSessionBtn.addEventListener('click', endAndSaveSession);
    }
    
    function openPromptInChatGPT() {
        const selectedPromptId = stepSelect.value;
        const prompt = allPrompts.find(p => p.id === selectedPromptId);
        if (!prompt) {
            alert('Veuillez sélectionner un prompt valide.');
            return;
        }

        // Remplacer les placeholders comme [Nom du coaché] par la vraie valeur
        let promptContent = prompt.content.replace(/\[Nom du coaché\]/g, currentCoachee.name);
        // Vous pouvez ajouter d'autres remplacements ici (ex: [type de poste])
        
        window.open(`https://chat.openai.com/?q=${encodeURIComponent(promptContent)}`, '_blank');
    }

    function endAndSaveSession() {
        const newSession = {
            id: 'session-' + Date.now(),
            date: new Date().toISOString(),
            notes: sessionNotesTextarea.value,
            stepId: stepSelect.value,
            stepName: stepSelect.options[stepSelect.selectedIndex].text
        };
        
        // Initialiser le tableau des sessions s'il n'existe pas
        if (!currentCoachee.sessions) {
            currentCoachee.sessions = [];
        }
        
        // Ajouter la nouvelle session
        currentCoachee.sessions.push(newSession);

        // Mettre à jour l'étape actuelle du coaché
        currentCoachee.currentStep = parseInt(newSession.stepId, 10);

        // Mettre à jour le coaché dans la liste globale
        const coacheeIndex = allCoachees.findIndex(c => c.id === coacheeId);
        if (coacheeIndex > -1) {
            allCoachees[coacheeIndex] = currentCoachee;
        }

        // Sauvegarder la liste entière des coachés
        DataStorage.save(DataStorage.KEYS.COACHEDS, allCoachees);

        alert('Session terminée et sauvegardée !');
        // Rediriger vers le dossier du coaché
        window.location.href = `dossier.html?name=${encodeURIComponent(currentCoachee.name)}`;
    }

    // --- DÉMARRAGE ---
    initializePage();
});
