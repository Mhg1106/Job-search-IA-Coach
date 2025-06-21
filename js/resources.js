// js/resources.js - VERSION FINALE HARMONISÉE

document.addEventListener('DOMContentLoaded', function() {

    // --- ÉLÉMENTS DU DOM ---
    const resourcesContainer = document.getElementById('resources-container');
    const filterContainer = document.getElementById('filter-container');
    const addResourceBtn = document.getElementById('add-resource-btn');
    
    // Éléments du Modal
    const modal = document.getElementById('resource-modal');
    const form = document.getElementById('resource-form');
    const modalTitle = document.getElementById('modal-title');
    const resourceIdInput = document.getElementById('resource-id');
    const resourceTitleInput = document.getElementById('resource-title');
    const resourceDescInput = document.getElementById('resource-description');
    const resourceUrlInput = document.getElementById('resource-url');
    const resourceCategoryInput = document.getElementById('resource-category');
    
    if (!resourcesContainer || !modal || !form) {
        console.error("Éléments HTML critiques non trouvés. Le script ne peut s'exécuter.");
        return;
    }
    
    // --- DONNÉES PAR DÉFAUT ---
    const defaultResources = [
        { id: 'default-1', title: 'Modèles de CV', description: 'Templates professionnels gratuits pour différents secteurs.', url: 'https://www.modeles-de-cv.com/', category: 'cv', isCustom: false },
        { id: 'default-2', title: 'Templates de Lettres', description: 'Modèles de lettres de motivation gratuits.', url: 'https://www.modele-lettre-gratuit.com/lettres-motivation-emploi/', category: 'lettres', isCustom: false },
        { id: 'default-3', title: 'Offres France Travail', description: 'Recherche d\'offres d\'emploi officielles.', url: 'https://candidat.pole-emploi.fr/offres/recherche', category: 'marche', isCustom: false },
        { id: 'default-4', title: 'Guide d\'entretien avancé', description: 'Techniques pour maîtriser tous les types d\'entretiens.', url: 'https://www.pole-emploi.fr/candidat/mes-aides/preparation-entr.html', category: 'entretiens', isCustom: false },
        { id: 'default-5', title: 'LinkedIn Optimizer', description: 'Optimiser son profil LinkedIn et élargir son réseau.', url: 'https://www.linkedin.com/learning/', category: 'linkedin', isCustom: false },
        { id: 'default-6', title: 'Guide de Reconversion', description: 'Méthodologie pour réussir une transition professionnelle.', url: 'https://www.pole-emploi.fr/candidat/en-formation/mes-aides-financieres/aide-individuelle-a-la-format.html', category: 'formation', isCustom: false },
    ];

    // --- INITIALISATION ---
    function initializeApp() {
        let resources = DataStorage.get(DataStorage.KEYS.RESOURCES);
        if (resources.length === 0) {
            resources = defaultResources;
            DataStorage.save(DataStorage.KEYS.RESOURCES, resources);
        }
        renderResources(resources);
        setupEventListeners();
    }

    // --- GESTION DE L'AFFICHAGE ---
    function renderResources(resources, filter = 'all') {
        resourcesContainer.innerHTML = '';
        const filteredResources = resources.filter(r => filter === 'all' || r.category === filter);

        if (filteredResources.length === 0) {
            resourcesContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">Aucune ressource dans cette catégorie.</p>`;
            return;
        }
        filteredResources.forEach(resource => {
            resourcesContainer.insertAdjacentHTML('beforeend', createResourceCardHTML(resource));
        });
    }

    function createResourceCardHTML(resource) {
        // Les ressources par défaut ne peuvent pas être supprimées ou modifiées
        const editButton = resource.isCustom ? `<button data-action="edit" class="text-gray-500 hover:text-blue-600 p-2 rounded-full"><i class="fas fa-edit"></i></button>` : '';
        const deleteButton = resource.isCustom ? `<button data-action="delete" class="text-gray-500 hover:text-red-600 p-2 rounded-full"><i class="fas fa-trash"></i></button>` : '';

        return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col" data-id="${resource.id}">
                <div class="p-5 flex-grow">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${resource.title}</h3>
                    <p class="text-sm text-gray-600 mb-4 h-12">${resource.description}</p>
                    <span class="text-xs text-indigo-600 bg-indigo-100 font-semibold px-2 py-1 rounded-full">${resource.category}</span>
                </div>
                <div class="p-3 bg-gray-50 border-t flex justify-end gap-2">
                    ${editButton}
                    ${deleteButton}
                    <a href="${resource.url}" target="_blank" class="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center">
                        <i class="fas fa-external-link-alt mr-2"></i>Accéder
                    </a>
                </div>
            </div>`;
    }
    
    // --- GESTION DES ÉVÉNEMENTS ---
    function setupEventListeners() {
        addResourceBtn.addEventListener('click', openModalForAdd);
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
        form.addEventListener('submit', handleFormSubmit);

        filterContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button.filter-btn');
            if (!button) return;

            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            button.classList.add('bg-blue-500', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
            
            const resources = DataStorage.get(DataStorage.KEYS.RESOURCES);
            renderResources(resources, button.dataset.filter);
        });

        resourcesContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) return;

            const resourceId = button.closest('[data-id]').dataset.id;
            const action = button.dataset.action;

            if (action === 'edit') openModalForEdit(resourceId);
            if (action === 'delete') deleteResource(resourceId);
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        let resources = DataStorage.get(DataStorage.KEYS.RESOURCES);
        const resourceData = {
            title: resourceTitleInput.value,
            description: resourceDescInput.value,
            url: resourceUrlInput.value,
            category: resourceCategoryInput.value,
        };

        if (resourceIdInput.value) { // Mode Édition
            resources = resources.map(r => r.id === resourceIdInput.value ? { ...r, ...resourceData } : r);
        } else { // Mode Ajout
            resources.push({
                ...resourceData,
                id: 'custom-' + Date.now(),
                isCustom: true // Marquer comme ressource personnalisée
            });
        }
        DataStorage.save(DataStorage.KEYS.RESOURCES, resources);
        renderResources(resources, 'all'); // Revenir au filtre "Tous"
        // Mettre à jour le style du bouton de filtre
        document.querySelector('.filter-btn.bg-blue-500').classList.remove('bg-blue-500', 'text-white');
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('bg-blue-500', 'text-white');
        closeModal();
    }
    
    // --- ACTIONS (MODALE, CRUD) ---
    function openModalForAdd() {
        form.reset();
        resourceIdInput.value = '';
        modalTitle.innerText = 'Ajouter une ressource';
        modal.classList.remove('hidden');
    }

    function openModalForEdit(resourceId) {
        const resources = DataStorage.get(DataStorage.KEYS.RESOURCES);
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        modalTitle.innerText = 'Modifier la ressource';
        resourceIdInput.value = resource.id;
        resourceTitleInput.value = resource.title;
        resourceDescInput.value = resource.description;
        resourceUrlInput.value = resource.url;
        resourceCategoryInput.value = resource.category;
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function deleteResource(resourceId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) return;
        let resources = DataStorage.get(DataStorage.KEYS.RESOURCES);
        resources = resources.filter(r => r.id !== resourceId);
        DataStorage.save(DataStorage.KEYS.RESOURCES, resources);
        renderResources(resources); // Rafraîchir l'affichage
    }

    // --- DÉMARRAGE ---
    initializeApp();
});
