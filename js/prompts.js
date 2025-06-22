// js/prompts.js - VERSION FINALE ET DÉFINITIVE

document.addEventListener('DOMContentLoaded', function() {

    // --- ÉLÉMENTS DU DOM ---
    const promptContainer = document.getElementById('prompt-container');
    const promptModal = document.getElementById('promptModal');
    const modalTitle = document.getElementById('promptModalTitle');
    const titleInput = document.getElementById('promptTitleEdit');
    const contentTextarea = document.getElementById('promptContentEdit');
    const saveButton = document.getElementById('savePromptEdit');
    const form = document.getElementById('prompt-form');

    // Vérification de sécurité robuste au démarrage
    if (!promptContainer || !promptModal || !modalTitle || !saveButton || !form) {
        console.error("Erreur critique : Un ou plusieurs éléments HTML clés sont introuvables. Le script des prompts ne peut pas s'exécuter.");
        return; 
    }

    // --- DONNÉES PAR DÉFAUT ---
    const defaultPrompts = [
        // ... (VOS 10 PROMPTS COMPLETS ICI) ...
        { id: '1', title: '1. Diagnostic de Départ', content: `Je suis un coach spécialisé...` },
        { id: '2', title: '2. Analyse du Marché', content: `En tant que coach...` },
        // ... etc
    ];

    // --- FONCTIONS PRINCIPALES ---
function displayPrompts() {
        if(!promptContainer) return;
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS, []);
        promptContainer.innerHTML = ''; 

        prompts.forEach(prompt => {
            const contentPreview = prompt.content.split(' ').slice(0, 20).join(' ') + '...';
            const cardHTML = `
                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 flex flex-col" data-id="${prompt.id}">
                    <h3 class="text-lg font-bold text-gray-800 flex-grow">${prompt.title}</h3>
                    <div class="text-xs text-gray-600 my-4 italic h-16 overflow-hidden">${contentPreview}</div>
                    <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t">
                        <button data-action="edit" class="text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Modifier</button>
                        <button data-action="use" class="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Utiliser</button>
                        <button data-action="open-chatgpt" title="Ouvrir dans ChatGPT" class="text-sm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-2 rounded-lg"><i class="fas fa-external-link-alt"></i></button>
                        <button data-action="save-response" title="Enregistrer une réponse" class="text-sm bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-2 rounded-lg"><i class="fas fa-save"></i></button>
                    </div>
                </div>`;
            promptContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
    
    function showPromptModal(promptId) {
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS, defaultPrompts);
        const promptData = prompts.find(p => p.id === promptId);
        if (!promptData) return;

        modalTitle.textContent = 'Modifier le prompt';
        // Mettre les données du prompt dans le formulaire
        document.getElementById('prompt-id').value = promptData.id;
        titleInput.value = promptData.title;
        contentTextarea.value = promptData.content;
        
        promptModal.classList.remove('hidden');
    }
    
    function initializePage() {
        let prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        if (!prompts || prompts.length === 0) {
            DataStorage.save(DataStorage.KEYS.PROMPTS, defaultPrompts);
        }
        displayPrompts();
    }

    // --- GESTION DES ÉVÉNEMENTS ---
    promptContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const card = button.closest('[data-id]');
        const promptId = card?.dataset.id;
        const promptData = DataStorage.get(DataStorage.KEYS.PROMPTS, []).find(p => p.id === promptId);
        if (!promptData) return;

        switch (button.dataset.action) {
            case 'edit':
            case 'use': // 'Utiliser' peut aussi ouvrir la modale pour voir/copier
                showPromptModal(promptId);
                break;
            case 'open-chatgpt':
                window.open(`https://chat.openai.com/?q=${encodeURIComponent(promptData.content)}`, '_blank');
                break;
            case 'save-response':
                alert("Fonctionnalité 'Enregistrer réponse' à développer.");
                break;
        }
    });
    // Gestion des boutons pour fermer la modale
    promptModal.querySelectorAll('.close-prompt-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            promptModal.classList.add('hidden');
        });
    });

    // --- DÉMARRAGE ---
    initializePage();
});
