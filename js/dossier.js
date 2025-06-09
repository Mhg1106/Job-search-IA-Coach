// dossier.js - Gestion du dossier coaché

document.addEventListener('DOMContentLoaded', function() {
    initializeDossier();
});

function initializeDossier() {
    // Récupérer les paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const coachedName = decodeURIComponent(urlParams.get('name') || 'Coaché Inconnu');
    
    // LIGNE DE DEBUG À AJOUTER :
    alert(`URL actuelle: ${window.location.href}\nParamètre name: ${urlParams.get('name')}\nNom décodé: ${coachedName}`);
    
    // Afficher le nom du coaché
    document.getElementById('coachedName').textContent = `- ${coachedName}`;
    
    // Charger les données du coaché
    loadCoachedData(coachedName);
    loadSessionsHistory(coachedName);
    loadCoachNotes(coachedName);
    loadProgress(coachedName);
    loadDocuments(coachedName);
    loadObjectives(coachedName);
}

function loadCoachedData(coachedName) {
    // Récupérer les données depuis localStorage
    const storageKey = `coached_profile_${coachedName}`;
    const profileData = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    // Données par défaut basées sur vos coachés existants
    const defaultData = getDefaultProfileData(coachedName);
    const data = { ...defaultData, ...profileData };
    
    // Remplir les champs
    document.getElementById('fullName').textContent = data.fullName || coachedName;
    document.getElementById('targetPosition').textContent = data.targetPosition || '-';
    document.getElementById('sector').textContent = data.sector || '-';
    document.getElementById('experience').textContent = data.experience || '-';
    document.getElementById('email').textContent = data.email || '-';
    document.getElementById('phone').textContent = data.phone || '-';
    document.getElementById('location').textContent = data.location || '-';
    document.getElementById('startDate').textContent = data.startDate || '-';
}

function getDefaultProfileData(coachedName) {
    // Données par défaut basées sur vos coachés existants
    const profiles = {
        'Marie Dupont': {
            fullName: 'Marie Dupont',
            targetPosition: 'Responsable Marketing Digital',
            sector: 'Marketing Digital',
            experience: '8 ans',
            email: 'marie.dupont@email.com',
            location: 'Paris, France',
            startDate: '15/05/2025'
        },
        'Thomas Martin': {
            fullName: 'Thomas Martin',
            targetPosition: 'Lead Developer',
            sector: 'Développement Web',
            experience: '5 ans',
            email: 'thomas.martin@email.com',
            location: 'Lyon, France',
            startDate: '20/05/2025'
        },
        'Sophie Laurent': {
            fullName: 'Sophie Laurent',
            targetPosition: 'Chef de Projet Senior',
            sector: 'Gestion de Projet',
            experience: '3 ans',
            email: 'sophie.laurent@email.com',
            location: 'Toulouse, France',
            startDate: '23/05/2025'
        }
    };
    
    return profiles[coachedName] || {};
}

function loadSessionsHistory(coachedName) {
    // Récupérer l'historique des sessions
    const storageKey = `sessions_history_${coachedName}`;
    const sessions = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    const container = document.getElementById('sessionsHistory');
    
    if (sessions.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-calendar-times fa-3x mb-3"></i>
                <p>Aucune session enregistrée pour ce coaché</p>
                <button class="btn btn-primary" onclick="startSession()">
                    <i class="fas fa-play"></i> Démarrer la première session
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    sessions.slice(0, 5).forEach(session => {
        html += `
            <div class="session-item mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">
                            <i class="fas fa-video text-primary"></i>
                            Session ${session.step} - ${session.stepName}
                        </h6>
                        <small class="text-muted">
                            <i class="fas fa-clock"></i> ${session.date} à ${session.time}
                            <span class="ms-3">
                                <i class="fas fa-stopwatch"></i> Durée: ${session.duration || 'Non renseignée'}
                            </span>
                        </small>
                        ${session.notes ? `<p class="mt-2 mb-0">${session.notes.substring(0, 100)}...</p>` : ''}
                    </div>
                    <div class="text-end">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewSession('${session.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadCoachNotes(coachedName) {
    const storageKey = `coach_notes_${coachedName}`;
    const notes = localStorage.getItem(storageKey) || '';
    const lastUpdate = localStorage.getItem(`${storageKey}_updated`) || 'Jamais';
    
    document.getElementById('coachNotes').value = notes;
    document.getElementById('notesLastUpdate').textContent = lastUpdate;
}

function loadProgress(coachedName) {
    const storageKey = `coached_progress_${coachedName}`;
    const progress = JSON.parse(localStorage.getItem(storageKey)) || { completed: [], current: 1 };
    
    const completedSteps = progress.completed.length;
    const progressPercentage = (completedSteps / 10) * 100;
    
    document.getElementById('globalProgress').textContent = `${completedSteps}/10`;
    document.getElementById('globalProgressBar').style.width = `${progressPercentage}%`;
    
    // Mettre à jour les étapes
    updateStepsDisplay(progress);
}

function updateStepsDisplay(progress) {
    const steps = [
        'Diagnostic de départ', 'Analyse du marché', 'Plan d\'action détaillé',
        'Analyse CV', 'Recherche entreprise', 'Matching CV / Offre',
        'Lettres de motivation', 'Ciblage offres', 'Préparation entretien',
        'Bilan du coaching'
    ];
    
    const container = document.querySelector('.progress-steps');
    let html = '';
    
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = progress.completed.includes(stepNumber);
        const isCurrent = progress.current === stepNumber;
        
        const iconClass = isCompleted ? 'fas fa-circle-check text-success' : 
                         isCurrent ? 'fas fa-circle text-primary' : 'fas fa-circle text-muted';
        
        html += `
            <div class="step-item mb-2" data-step="${stepNumber}">
                <i class="${iconClass}"></i>
                <span class="${isCompleted ? 'text-success' : isCurrent ? 'text-primary' : 'text-muted'}">${step}</span>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadDocuments(coachedName) {
    const storageKey = `documents_${coachedName}`;
    const documents = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    const container = document.getElementById('documentsList');
    
    if (documents.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="fas fa-file-plus fa-2x mb-2"></i>
                <p class="mb-0">Aucun document</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    documents.forEach(doc => {
        html += `
            <div class="document-item mb-2 p-2 border rounded">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="fas fa-file-${doc.type} text-primary"></i>
                        <span class="ms-2">${doc.name}</span>
                        <small class="text-muted d-block ms-4">${doc.date}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary" onclick="downloadDocument('${doc.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadObjectives(coachedName) {
    const storageKey = `objectives_${coachedName}`;
    const objectives = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    const container = document.getElementById('objectivesList');
    
    if (objectives.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="fas fa-bullseye fa-2x mb-2"></i>
                <p class="mb-0">Aucun objectif défini</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    objectives.forEach(objective => {
        const statusClass = objective.completed ? 'text-success' : 'text-warning';
        const iconClass = objective.completed ? 'fas fa-check-circle' : 'fas fa-clock';
        
        html += `
            <div class="objective-item mb-2 p-2 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <i class="${iconClass} ${statusClass}"></i>
                        <span class="ms-2">${objective.text}</span>
                        <small class="text-muted d-block ms-4">Échéance: ${objective.deadline}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-success" onclick="toggleObjective('${objective.id}')">
                        <i class="fas fa-${objective.completed ? 'undo' : 'check'}"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Fonctions d'actions
function startSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const coachedName = urlParams.get('name');
    
    // Rediriger vers la page session avec les paramètres
    window.location.href = `session.html?name=${encodeURIComponent(coachedName)}&step=1`;
}

function editProfile() {
    // Ouvrir un modal ou rediriger vers une page d'édition
    alert('Fonctionnalité d\'édition du profil à développer');
}

function saveCoachNotes() {
    const urlParams = new URLSearchParams(window.location.search);
    const coachedName = urlParams.get('name');
    const notes = document.getElementById('coachNotes').value;
    const timestamp = new Date().toLocaleString('fr-FR');
    
    const storageKey = `coach_notes_${coachedName}`;
    localStorage.setItem(storageKey, notes);
    localStorage.setItem(`${storageKey}_updated`, timestamp);
    
    document.getElementById('notesLastUpdate').textContent = timestamp;
    
    // Feedback visuel
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Sauvegardé !';
    btn.className = 'btn btn-sm btn-success';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.className = 'btn btn-sm btn-success';
    }, 2000);
}

function uploadDocument() {
    alert('Fonctionnalité d\'upload de document à développer');
}

function addObjective() {
    const text = prompt('Nouvel objectif :');
    if (text) {
        const urlParams = new URLSearchParams(window.location.search);
        const coachedName = urlParams.get('name');
        const storageKey = `objectives_${coachedName}`;
        const objectives = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        const newObjective = {
            id: Date.now().toString(),
            text: text,
            deadline: new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('fr-FR'),
            completed: false,
            created: new Date().toLocaleDateString('fr-FR')
        };
        
        objectives.push(newObjective);
        localStorage.setItem(storageKey, JSON.stringify(objectives));
        
        loadObjectives(coachedName);
    }
}

function toggleObjective(objectiveId) {
    const urlParams = new URLSearchParams(window.location.search);
    const coachedName = urlParams.get('name');
    const storageKey = `objectives_${coachedName}`;
    const objectives = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    const objective = objectives.find(obj => obj.id === objectiveId);
    if (objective) {
        objective.completed = !objective.completed;
        localStorage.setItem(storageKey, JSON.stringify(objectives));
        loadObjectives(coachedName);
    }
}
