// js/coachees.js - Version Finale Propre

// Écouteur principal qui lance l'application quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    
    // Données initiales (si aucune sauvegarde n'existe)
    const initialCoachees = [
        { id: 'marie-dupont', name: 'Marie Dupont', position: 'Marketing Digital', status: 'Actif', currentStep: 9 },
        { id: 'thomas-martin', name: 'Thomas Martin', position: 'Développement Web', status: 'En attente', currentStep: 4 },
        { id: 'sophie-laurent', name: 'Sophie Laurent', position: 'Chef de Projet', status: 'Actif', currentStep: 1 }
    ];

    const storageKey = 'job-coach-coachees-data'; // Notre unique clé de sauvegarde

    // ----- INITIALISATION -----
    // On charge les données ou on initialise avec les données par défaut
    let coachees = JSON.parse(localStorage.getItem(storageKey)) || initialCoachees;
    localStorage.setItem(storageKey, JSON.stringify(coachees)); // On sauvegarde l'état initial si besoin

    renderAllCoachees(); // On affiche toutes les cartes

    // ----- GESTION DES ÉVÉNEMENTS (CLICS, ETC.) -----
    // (Ajouter ici les écouteurs pour les filtres, la recherche, etc. si nécessaire)

    // ----- FONCTIONS PRINCIPALES -----

    // Fonction pour afficher TOUTES les cartes à partir des données
    function renderAllCoachees() {
        const container = document.getElementById('coachees-container');
        if (!container) {
            console.error("Le conteneur #coachees-container n'a pas été trouvé !");
            return;
        }
        container.innerHTML = ''; // On vide le conteneur avant de le remplir

        if (coachees.length === 0) {
            container.innerHTML = `<p class="text-gray-500 col-span-full text-center">Aucun coaché à afficher. Cliquez sur "Ajouter un coaché" pour commencer.</p>`;
            return;
        }

        coachees.forEach(coachee => {
            const cardHTML = createCoacheeCardHTML(coachee);
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // Fonction pour supprimer un coaché
    window.deleteCoachee = function(coacheeId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce coaché ? Cette action est irréversible.')) {
            return;
        }

        // 1. Modifier les données
        coachees = coachees.filter(c => c.id !== coacheeId);

        // 2. Sauvegarder les nouvelles données
        localStorage.setItem(storageKey, JSON.stringify(coachees));

        // 3. Mettre à jour l'affichage
        renderAllCoachees();
        
        alert('Coaché supprimé avec succès !');
    }

    // Fonction pour ouvrir/fermer le menu contextuel
    window.toggleCoacheeMenu = function(coacheeId) {
        const allMenus = document.querySelectorAll('.coachee-menu');
        allMenus.forEach(m => {
            if (m.id !== `menu-${coacheeId}`) {
                m.classList.add('hidden');
            }
        });
        const menu = document.getElementById(`menu-${coacheeId}`);
        if (menu) {
            menu.classList.toggle('hidden');
        }
    }
    
    // Mettre ici les autres fonctions globales nécessaires (editCoachee, etc.)
    window.editCoachee = function(coacheeId) { alert(`Fonctionnalité "Modifier" pour ${coacheeId} à implémenter.`); }
    window.duplicateCoachee = function(coacheeId) { alert(`Fonctionnalité "Dupliquer" pour ${coacheeId} à implémenter.`); }
    window.exportCoachee = function(coacheeId) { alert(`Fonctionnalité "Exporter" pour ${coacheeId} à implémenter.`); }
    window.startSession = function(name, step) { alert(`Démarrage session pour ${name}, étape ${step}.`); }
    window.openDossier = function(name) { alert(`Ouverture dossier pour ${name}.`); }

    // ----- FONCTIONS UTILITAIRES -----

    // Crée le code HTML pour une seule carte
    function createCoacheeCardHTML(coachee) {
        const stepName = `Étape ${coachee.currentStep}`; // Simplifié, à adapter
        const progress = coachee.currentStep * 10;
        const initials = coachee.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        return `
            <div class="coachee-card bg-white rounded-lg shadow-md overflow-hidden" data-coachee-id="${coachee.id}">
                <div class="coachee-header flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                    <div class="coachee-avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color: #3498DB;">${initials}</div>
                    <div class="coachee-status px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">${coachee.status}</div>
                    <div class="coachee-actions relative">
                        <button onclick="toggleCoacheeMenu('${coachee.id}')" class="btn-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" title="Plus d'options">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div id="menu-${coachee.id}" class="coachee-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden">
                            <button onclick="editCoachee('${coachee.id}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"><i class="fas fa-edit mr-2 text-blue-600"></i>Modifier</button>
                            <button onclick="duplicateCoachee('${coachee.id}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"><i class="fas fa-copy mr-2 text-green-600"></i>Dupliquer</button>
                            <button onclick="exportCoachee('${coachee.id}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"><i class="fas fa-download mr-2 text-purple-600"></i>Exporter</button>
                            <hr class="my-1">
                            <button onclick="deleteCoachee('${coachee.id}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600"><i class="fas fa-trash mr-2"></i>Supprimer</button>
                        </div>
                    </div>
                </div>
                <div class="coachee-body p-4">
                    <h3 class="coachee-name text-lg font-bold mb-1">${coachee.name}</h3>
                    <p class="coachee-position text-sm text-gray-600 mb-3">${coachee.position}</p>
                    <div class="progress-container h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                        <div class="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500" style="width: ${progress}%;"></div>
                    </div>
                    <p class="current-stage flex items-center text-sm text-gray-700 mb-2"><i class="fas fa-tasks mr-2 text-gray-500"></i><span>${stepName}</span></p>
                </div>
                <div class="coachee-footer flex justify-between p-4 border-t border-gray-200 bg-gray-50">
                    <button onclick="startSession('${coachee.name}', '${coachee.currentStep}')" class="btn-action flex items-center px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"><i class="fas fa-play mr-1"></i> Session</button>
                    <button onclick="openDossier('${coachee.name}')" class="btn-action flex items-center px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"><i class="fas fa-folder-open mr-1"></i> Dossier</button>
                </div>
            </div>
        `;
    }
});
