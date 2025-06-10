// Gestion des ressources - Version fusionnée
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de la page Ressources...');
    
    // Initialiser les fonctionnalités existantes
    initializeFilters();
    initializeExistingButtons();
    initializeAddResourceButton();
    
    // Nouvelles fonctionnalités
    loadCustomResources();
    showEmptySlots();
});

// ========== FONCTIONNALITÉS EXISTANTES CONSERVÉES ==========

function initializeFilters() {
    const filterButtons = document.querySelectorAll('.flex.flex-wrap.mb-8 button');
    const resourceCards = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6 > div');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Réinitialiser tous les boutons au style par défaut
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-gray-800', 'text-white');
                btn.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
            });
            
            // Appliquer le style actif au bouton cliqué
            this.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
            this.classList.add('bg-gray-800', 'text-white');
            
            // Filtrer les ressources
            const filterCategory = this.textContent.trim().toLowerCase();
            
            resourceCards.forEach(card => {
                const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
                const description = card.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (filterCategory === 'tous' || 
                    title.includes(filterCategory) || 
                    description.includes(filterCategory)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initializeExistingButtons() {
    // Les nouveaux boutons avec onclick seront gérés par les nouvelles fonctions
    // Garder la logique pour les anciens boutons de consultation (vidéos)
    const consultButtons = document.querySelectorAll('.bg-blue-500.hover\\:bg-blue-600');
    consultButtons.forEach(button => {
        // Vérifier que ce n'est pas un bouton avec onclick déjà défini
        if (!button.hasAttribute('onclick')) {
            button.addEventListener('click', function() {
                const resourceCard = this.closest('div.p-5');
                const resourceTitle = resourceCard?.querySelector('h2')?.textContent || 'Ressource';
                
                showNotification(`Ouverture de "${resourceTitle}" pour consultation...`, 'info');
            });
        }
    });
}

function initializeAddResourceButton() {
    const addResourceButton = document.querySelector('.mt-8.flex.justify-end button');
    
    if (addResourceButton && !addResourceButton.hasAttribute('onclick')) {
        addResourceButton.addEventListener('click', function() {
            showAddResourceOptions();
        });
    }
}

// ========== NOUVELLES FONCTIONNALITÉS ==========

// URLs des ressources externes
const externalResources = {
    'modeles-cv': 'https://www.modeles-de-cv.com/',
    'templates-lettres': 'https://www.modele-lettre-gratuit.com/lettres-motivation-emploi/',
    'france-travail': 'https://candidat.pole-emploi.fr/offres/recherche',
    'guide-entretien': 'https://www.pole-emploi.fr/candidat/mes-aides/preparation-entr.html',
    'linkedin-optimizer': 'https://www.linkedin.com/learning/',
    'guide-reconversion': 'https://www.pole-emploi.fr/candidat/en-formation/mes-aides-financieres/aide-individuelle-a-la-format.html'
};

// Ouvrir une ressource externe
function openExternalResource(resourceId) {
    const url = externalResources[resourceId];
    
    if (url) {
        // Comptabiliser l'accès
        incrementAccessCount(resourceId);
        
        // Notification
        showNotification(`Ouverture de la ressource dans un nouvel onglet...`, 'info');
        
        // Ouvrir dans un nouvel onglet
        window.open(url, '_blank');
    } else {
        showNotification('Ressource non disponible', 'error');
    }
}

// Afficher les options d'ajout de ressource (version améliorée du modal existant)
function showAddResourceOptions() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">Ajouter une ressource</h2>
                <button onclick="closeModal()" class="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Titre de la ressource</label>
                <input type="text" id="resourceTitle" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ex: Guide des soft skills">
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Description</label>
                <textarea id="resourceDescription" class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="3" placeholder="Brève description de la ressource"></textarea>
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Type de ressource</label>
                <select id="resourceType" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="link">Lien externe</option>
                    <option value="file">Fichier à télécharger</option>
                </select>
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">URL ou chemin du fichier</label>
                <input type="text" id="resourceUrl" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://exemple.com ou documents/fichier.pdf">
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium mb-2">Catégorie</label>
                <select id="resourceCategory" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="cv">CV</option>
                    <option value="lettres">Lettres</option>
                    <option value="entretiens">Entretiens</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="marche">Marché</option>
                    <option value="formation">Formation</option>
                </select>
            </div>
            
            <div class="mb-6">
                <label class="block text-sm font-medium mb-2">Informations fichier</label>
                <input type="text" id="resourceInfo" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ex: PDF • 20 pages">
            </div>
            
            <div class="flex justify-end space-x-3">
                <button onclick="closeModal()" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                    Annuler
                </button>
                <button onclick="saveNewResource()" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">
                    Ajouter
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fermer le modal si on clique en dehors
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Sauvegarder une nouvelle ressource
function saveNewResource() {
    const title = document.getElementById('resourceTitle').value;
    const description = document.getElementById('resourceDescription').value;
    const type = document.getElementById('resourceType').value;
    const url = document.getElementById('resourceUrl').value;
    const category = document.getElementById('resourceCategory').value;
    const info = document.getElementById('resourceInfo').value;
    
    if (!title || !description || !url) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Trouver le premier emplacement libre
    const emptySlot = findEmptySlot();
    if (!emptySlot) {
        showNotification('Aucun emplacement libre disponible', 'error');
        return;
    }
    
    // Créer la nouvelle ressource
    const newResource = {
        id: Date.now().toString(),
        title: title,
        description: description,
        type: type,
        url: url,
        category: category,
        info: info,
        dateAdded: new Date().toLocaleDateString('fr-FR')
    };
    
    // Sauvegarder dans localStorage
    saveCustomResource(emptySlot, newResource);
    
    // Afficher la nouvelle ressource
    displayCustomResource(emptySlot, newResource);
    
    // Fermer le modal
    closeModal();
    
    showNotification('Ressource ajoutée avec succès !', 'success');
}

// Trouver un emplacement libre
function findEmptySlot() {
    for (let i = 1; i <= 3; i++) {
        const slot = document.getElementById(`newResource${i}`);
        if (slot && slot.classList.contains('hidden')) {
            return `newResource${i}`;
        }
    }
    return null;
}

// Sauvegarder une ressource personnalisée
function saveCustomResource(slotId, resource) {
    let customResources = JSON.parse(localStorage.getItem('custom_resources')) || {};
    customResources[slotId] = resource;
    localStorage.setItem('custom_resources', JSON.stringify(customResources));
}

// Charger les ressources personnalisées
function loadCustomResources() {
    const customResources = JSON.parse(localStorage.getItem('custom_resources')) || {};
    
    Object.keys(customResources).forEach(slotId => {
        const resource = customResources[slotId];
        displayCustomResource(slotId, resource);
    });
}

// Afficher une ressource personnalisée
function displayCustomResource(slotId, resource) {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    
    const buttonIcon = resource.type === 'link' ? 'fas fa-external-link-alt' : 'fas fa-download';
    const buttonText = resource.type === 'link' ? 'Accéder' : 'Télécharger';
    const buttonAction = resource.type === 'link' ? 
        `openCustomLink('${resource.url}')` : 
        `downloadCustomFile('${resource.url}', '${resource.title}')`;
    
    slot.innerHTML = `
        <div class="p-5">
            <div class="flex justify-between items-start mb-2">
                <h2 class="text-lg font-bold">${resource.title}</h2>
                <button onclick="removeCustomResource('${slotId}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="text-gray-600 text-sm mb-4">${resource.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">${resource.info}</span>
                <button onclick="${buttonAction}" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center">
                    <i class="${buttonIcon} mr-1"></i> ${buttonText}
                </button>
            </div>
        </div>
    `;
    
    slot.classList.remove('hidden');
    slot.classList.remove('border-dashed');
    slot.classList.add('border-gray-200');
}

// Ouvrir un lien personnalisé
function openCustomLink(url) {
    window.open(url, '_blank');
    showNotification('Ouverture de la ressource...', 'info');
}

// Télécharger un fichier personnalisé
function downloadCustomFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    showNotification(`Téléchargement de ${filename} démarré !`, 'success');
}

// Supprimer une ressource personnalisée
function removeCustomResource(slotId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
        // Supprimer du localStorage
        let customResources = JSON.parse(localStorage.getItem('custom_resources')) || {};
        delete customResources[slotId];
        localStorage.setItem('custom_resources', JSON.stringify(customResources));
        
        // Remettre l'emplacement vide
        const slot = document.getElementById(slotId);
        slot.innerHTML = `
            <div class="p-5 text-center">
                <i class="fas fa-plus text-gray-400 text-3xl mb-3"></i>
                <p class="text-gray-500">Emplacement libre</p>
                <button onclick="editResource('${slotId}')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Ajouter ressource
                </button>
            </div>
        `;
        slot.classList.add('hidden', 'border-dashed');
        slot.classList.remove('border-gray-200');
        
        showNotification('Ressource supprimée', 'info');
        showEmptySlots();
    }
}

// Éditer une ressource (ouvre le modal d'ajout)
function editResource(slotId) {
    showAddResourceOptions();
}

// Afficher les emplacements vides
function showEmptySlots() {
    const customResources = JSON.parse(localStorage.getItem('custom_resources')) || {};
    
    for (let i = 1; i <= 3; i++) {
        const slotId = `newResource${i}`;
        const slot = document.getElementById(slotId);
        
        if (slot && !customResources[slotId]) {
            slot.classList.remove('hidden');
        }
    }
}

// Fermer le modal
function closeModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (modal) {
        modal.remove();
    }
}

// Comptabiliser les accès
function incrementAccessCount(resourceId) {
    let stats = JSON.parse(localStorage.getItem('resource_access_stats')) || {};
    stats[resourceId] = (stats[resourceId] || 0) + 1;
    localStorage.setItem('resource_access_stats', JSON.stringify(stats));
}

// Notifications améliorées
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded shadow-lg z-50 transform translate-x-full transition-all duration-300`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
