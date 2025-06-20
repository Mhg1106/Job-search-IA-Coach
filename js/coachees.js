// js/coachees.js - VERSION FINALE HARMONISÉE

document.addEventListener('DOMContentLoaded', function() {

    // --- ÉLÉMENTS DU DOM ---
    const coacheesContainer = document.getElementById('coachees-container');
    const modal = document.getElementById('coachee-modal');
    const form = document.getElementById('coachee-form');
    const modalTitle = document.getElementById('modal-title');
    const coacheeIdInput = document.getElementById('coachee-id');
    const coacheeNameInput = document.getElementById('coachee-name');
    const coacheePositionInput = document.getElementById('coachee-position');
    const coacheeStartDateInput = document.getElementById('coachee-start-date');

    if (!coacheesContainer || !modal || !form) {
        console.error("Éléments HTML critiques non trouvés. Le script ne peut s'exécuter.");
        return;
    }

    // --- DONNÉES DE DÉPART ---
    const initialCoachees = [
        { id: 'coachee-1', name: 'Marie Dupont', position: 'Marketing Digital', status: 'Actif', currentStep: 9, startDate: '2024-05-15' },
        { id: 'coachee-2', name: 'Thomas Martin', position: 'Développement Web', status: 'En attente', currentStep: 4, startDate: '2024-06-01' },
        { id: 'coachee-3', name: 'Sophie Laurent', position: 'Chef de Projet', status: 'Actif', currentStep: 1, startDate: '2024-06-20' }
    ];

    // --- FONCTION D'INITIALISATION ---
    function initializeApp() {
        // On utilise maintenant le module centralisé DataStorage
        let coachees = DataStorage.get(DataStorage.KEYS.COACHEDS);

        if (coachees.length === 0) {
            coachees = initialCoachees;
            DataStorage.save(DataStorage.KEYS.COACHEDS, coachees);
        }
        renderAllCoachees(coachees);
        setupEventListeners();
    }

    // --- GESTION DE L'AFFICHAGE ---
    function renderAllCoachees(coachees) {
        coacheesContainer.innerHTML = '';
        if (coachees.length === 0) {
            coacheesContainer.innerHTML = `<p class="text-gray-500 col-span-full text-center">Aucun coaché pour le moment.</p>`;
            return;
        }
        coachees.forEach(coachee => {
            coacheesContainer.insertAdjacentHTML('beforeend', createCoacheeCardHTML(coachee));
        });
    }

    function createCoacheeCardHTML(coachee) {
        const initials = (coachee.name || '').split(' ').map(n => n[0]).join('').toUpperCase();
        const progress = (coachee.currentStep || 1) * 10;
        const formattedDate = new Date(coachee.startDate + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

        return `
            <div class="coachee-card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:transform-gpu hover:-translate-y-1" data-id="${coachee.id}">
                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style="background-color: #3b82f6;">${initials}</div>
                        <div class="ml-4 min-w-0">
                            <h3 class="text-lg font-bold text-gray-900 truncate">${coachee.name}</h3>
                            <p class="text-sm text-gray-600 truncate">${coachee.position}</p>
                        </div>
                    </div>
                </div>
                <div class="p-4 flex-grow">
                    <p class="text-xs text-gray-500">Début: ${formattedDate}</p>
                    <p class="text-sm text-gray-500 mt-2">Progression</p>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="p-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                    <button data-action="edit" class="text-gray-500 hover:text-blue-600 p-2 rounded-full"><i class="fas fa-edit"></i></button>
                    <button data-action="delete" class="text-gray-500 hover:text-red-600 p-2 rounded-full"><i class="fas fa-trash"></i></button>
                    <button data-action="open" class="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center">Voir le dossier</button>
                </div>
            </div>`;
    }

    // --- GESTION DES ÉVÉNEMENTS ---
    function setupEventListeners() {
        document.getElementById('add-coachee-btn').addEventListener('click', openModalForAdd);
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
        form.addEventListener('submit', handleFormSubmit);

        // Utilisation de la délégation d'événements pour les actions sur les cartes
        coacheesContainer.addEventListener('click', (event) => {
            const actionButton = event.target.closest('button[data-action]');
            if (!actionButton) return;
            
            const coacheeId = actionButton.closest('.coachee-card').dataset.id;
            const action = actionButton.dataset.action;

            if (action === 'edit') openModalForEdit(coacheeId);
            if (action === 'delete') deleteCoachee(coacheeId);
            if (action === 'open') openCoacheeDossier(coacheeId);
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        let coachees = DataStorage.get(DataStorage.KEYS.COACHEDS);
        const coacheeData = {
            name: coacheeNameInput.value,
            position: coacheePositionInput.value,
            startDate: coacheeStartDateInput.value
        };

        if (coacheeIdInput.value) { // Mode Édition
            coachees = coachees.map(c => c.id === coacheeIdInput.value ? { ...c, ...coacheeData } : c);
        } else { // Mode Ajout
            coachees.push({
                ...coacheeData,
                id: 'coachee-' + Date.now(),
                status: 'Actif',
                currentStep: 1
            });
        }
        DataStorage.save(DataStorage.KEYS.COACHEDS, coachees);
        renderAllCoachees(coachees);
        closeModal();
    }

    // --- ACTIONS (MODALE, SUPPRESSION, ETC.) ---
    function openModalForAdd() {
        form.reset();
        coacheeIdInput.value = '';
        modalTitle.innerText = 'Ajouter un nouveau coaché';
        modal.classList.remove('hidden');
    }

    function openModalForEdit(coacheeId) {
        const coachees = DataStorage.get(DataStorage.KEYS.COACHEDS);
        const coachee = coachees.find(c => c.id === coacheeId);
        if (!coachee) return;
        
        form.reset();
        modalTitle.innerText = 'Modifier le coaché';
        coacheeIdInput.value = coachee.id;
        coacheeNameInput.value = coachee.name;
        coacheePositionInput.value = coachee.position;
        coacheeStartDateInput.value = coachee.startDate;
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function deleteCoachee(coacheeId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce coaché ?')) return;
        let coachees = DataStorage.get(DataStorage.KEYS.COACHEDS);
        coachees = coachees.filter(c => c.id !== coacheeId);
        DataStorage.save(DataStorage.KEYS.COACHEDS, coachees);
        renderAllCoachees(coachees);
    }
    
    function openCoacheeDossier(coacheeId) {
        const coachees = DataStorage.get(DataStorage.KEYS.COACHEDS);
        const coachee = coachees.find(c => c.id === coacheeId);
        if (coachee) {
            window.location.href = `dossier.html?name=${encodeURIComponent(coachee.name)}`;
        }
    }

    // --- DÉMARRAGE DE L'APPLICATION ---
    initializeApp();
});
