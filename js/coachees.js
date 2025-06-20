// js/coachees.js - Version Finale, Propre et Fonctionnelle

document.addEventListener('DOMContentLoaded', function() {
    
    let coachees = [];
    const storageKey = 'job-coach-app-data';

    const initialCoachees = [
        { id: 'marie-dupont', name: 'Marie Dupont', position: 'Marketing Digital', status: 'Actif', currentStep: 9, startDate: '2024-05-15' },
        { id: 'thomas-martin', name: 'Thomas Martin', position: 'Développement Web', status: 'En attente', currentStep: 4, startDate: '2024-06-01' },
        { id: 'sophie-laurent', name: 'Sophie Laurent', position: 'Chef de Projet', status: 'Actif', currentStep: 1, startDate: '2024-06-20' }
    ];

    function initializeApp() {
        const savedData = localStorage.getItem(storageKey);
        if (savedData && JSON.parse(savedData).length > 0) {
            coachees = JSON.parse(savedData);
        } else {
            coachees = initialCoachees;
            saveData();
        }
        renderAllCoachees();
        setupEventListeners();
    }

    function renderAllCoachees() {
        const container = document.getElementById('coachees-container');
        if (!container) return;
        container.innerHTML = '';
        if (coachees.length === 0) {
            container.innerHTML = `<p class="text-gray-500 col-span-full text-center">Aucun coaché.</p>`;
            return;
        }
        coachees.forEach(coachee => {
            const cardHTML = createCoacheeCardHTML(coachee);
            container.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    function saveData() {
        localStorage.setItem(storageKey, JSON.stringify(coachees));
    }

    function setupEventListeners() {
        const coacheeForm = document.getElementById('new-coachee-form');
        if (coacheeForm) {
            coacheeForm.addEventListener('submit', handleFormSubmit);
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const coacheeId = document.getElementById('coachee-id').value;
        const name = document.getElementById('coachee-name').value;
        const position = document.getElementById('coachee-position').value;
        const startDate = document.getElementById('coachee-start-date').value;

        if (!name || !position || !startDate) {
            alert('Le nom, le poste et la date sont obligatoires.');
            return;
        }

        if (coacheeId) {
            const index = coachees.findIndex(c => c.id === coacheeId);
            if (index > -1) {
                coachees[index].name = name;
                coachees[index].position = position;
                coachees[index].startDate = startDate;
            }
        } else {
            const newCoachee = {
                id: 'coachee-' + Date.now(),
                name: name,
                position: position,
                startDate: startDate,
                status: 'Actif',
                currentStep: 1
            };
            coachees.push(newCoachee);
        }

        saveData();
        renderAllCoachees();
        closeCoacheeModal();
    }

    window.openAddCoacheeModal = function() {
        document.getElementById('new-coachee-form').reset();
        document.getElementById('coachee-id').value = '';
        document.getElementById('coachee-start-date').valueAsDate = new Date();
        document.getElementById('modal-title').innerText = 'Ajouter un nouveau coaché';
        document.getElementById('add-coachee-modal').classList.remove('hidden');
    }

    window.closeCoacheeModal = function() {
        document.getElementById('add-coachee-modal').classList.add('hidden');
    }

    window.editCoachee = function(coacheeId) {
        const coachee = coachees.find(c => c.id === coacheeId);
        if (!coachee) return;
        document.getElementById('new-coachee-form').reset();
        document.getElementById('modal-title').innerText = 'Modifier le coaché';
        document.getElementById('coachee-id').value = coachee.id;
        document.getElementById('coachee-name').value = coachee.name;
        document.getElementById('coachee-position').value = coachee.position;
        document.getElementById('coachee-start-date').value = coachee.startDate;
        document.getElementById('add-coachee-modal').classList.remove('hidden');
    }

    window.deleteCoachee = function(coacheeId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce coaché ?')) return;
        coachees = coachees.filter(c => c.id !== coacheeId);
        saveData();
        renderAllCoachees();
    }
    
    window.toggleCoacheeMenu = function(coacheeId) {
        document.querySelectorAll('.coachee-menu').forEach(m => {
            if (m.id !== `menu-${coacheeId}`) m.classList.add('hidden');
        });
        document.getElementById(`menu-${coacheeId}`).classList.toggle('hidden');
    }

    function createCoacheeCardHTML(coachee) {
        const initials = coachee.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const progress = (coachee.currentStep || 1) * 10;
        
        let formattedDate = 'Date non définie';
        if (coachee.startDate) {
            formattedDate = new Date(coachee.startDate).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
        }

        return `
            <div class="coachee-card bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <div class="coachee-header flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                    <div class="flex items-center">
                        <div class="coachee-avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color: #3498DB;">${initials}</div>
                        <div class="ml-3">
                            <h3 class="coachee-name text-lg font-bold">${coachee.name}</h3>
                            <p class="coachee-position text-sm text-gray-600">${coachee.position}</p>
                        </div>
                    </div>
                    <div class="coachee-actions relative">
                        <button onclick="toggleCoacheeMenu('${coachee.id}')" class="btn-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"><i class="fas fa-ellipsis-v"></i></button>
                        <div id="menu-${coachee.id}" class="coachee-menu absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 hidden">
                            <a href="#" onclick="editCoachee('${coachee.id}')" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i class="fas fa-edit w-6 mr-2 text-blue-600"></i>Modifier</a>
                            <a href="#" onclick="deleteCoachee('${coachee.id}')" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"><i class="fas fa-trash w-6 mr-2"></i>Supprimer</a>
                        </div>
                    </div>
                </div>
                <div class="coachee-body p-4 flex-grow">
                    <div class="mb-4 p-2 bg-gray-100 rounded-lg flex items-center">
                        <i class="fas fa-calendar-alt w-5 mr-3 text-gray-500"></i>
                        <div>
                            <p class="text-xs text-gray-600">Début du coaching</p>
                            <p class="text-sm font-medium text-gray-800">${formattedDate}</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-500">Progression</p>
                    <div class="progress-container h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div class="progress-bar h-full bg-blue-500" style="width: ${progress}%;"></div>
                    </div>
                </div>
                <div class="coachee-footer flex justify-end p-4 border-t border-gray-200 bg-gray-50">
                    <button class="btn-action px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center"><i class="fas fa-play mr-2"></i> Démarrer Session</button>
                </div>
            </div>`;
    }

    initializeApp();
});
