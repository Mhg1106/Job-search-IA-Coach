// js/prompts.js - NOUVELLE VERSION COMPLÈTE

document.addEventListener('DOMContentLoaded', function() {
    // --- ÉLÉMENTS DU DOM ---
    const promptContainer = document.getElementById('prompt-container');
    const promptModal = document.getElementById('promptModal');
    const modalTitle = document.getElementById('promptModalTitle');
    const titleInput = document.getElementById('promptTitleEdit');
    const contentTextarea = document.getElementById('promptContentEdit');
    const saveButton = document.getElementById('savePromptEdit');

    // --- DONNÉES PAR DÉFAUT ---
    // Vos prompts détaillés, utilisés uniquement si la mémoire est vide.
    const defaultPrompts = [
        { id: '1', title: '1. Diagnostic de Départ', content: `Je suis un coach spécialisé en emploi et carrière. Je réalise un diagnostic initial pour [Nom du coaché], qui recherche un poste de [type de poste]...` },
        { id: '2', title: '2. Analyse du Marché', content: `En tant que coach en recherche d'emploi, j'ai besoin d'une analyse complète du marché pour le secteur [secteur]...` },
        { id: '3', title: '3. Plan d\'action détaillé', content: `Sur la base du diagnostic réalisé pour [Nom du coaché] qui recherche un poste de [type de poste], élabore un plan d'action concret et détaillé sur 8 semaines...` },
        { id: '4', title: '4. Analyse CV', content: `Analyse le CV de [Nom du coaché] qui postule pour un poste de [type de poste]. Identifie les forces et faiblesses du CV...` },
        { id: '5', title: '5. Recherche Entreprise', content: `Réalise une synthèse complète sur l'entreprise [Nom de l'entreprise] pour mon coaché qui souhaite y postuler...` },
        { id: '6', title: '6. Matching CV / Offre', content: `Analyse le degré de matching entre le CV de [Nom du coaché] et l'offre d'emploi pour le poste de [intitulé du poste] chez [nom de l'entreprise]...` },
        { id: '7', title: '7. Lettre de Motivation', content: `Rédige une lettre de motivation percutante pour [Nom du coaché] qui postule au poste de [intitulé du poste] chez [nom de l'entreprise]...` },
        { id: '8', title: '8. Ciblage Offres', content: `Évalue le matching entre le profil de [Nom du coaché] et ces offres d'emploi. Classe-les par pertinence et suggère des adaptations...` },
        { id: '9', title: '9. Préparation Entretien', content: `Génère une série de questions d'entretien pour [Nom du coaché] qui postule au poste de [intitulé du poste] chez [nom de l'entreprise]...` },
        { id: '10', title: '10. Bilan du Coaching', content: `Réalise un bilan complet du coaching réalisé avec [Nom du coaché]. Analyse la progression, les points forts, les axes d'amélioration...` }
    ];
    // NOTE : Pour la lisibilité, j'ai raccourci le contenu des prompts ici, mais vous devez coller le contenu complet de chaque prompt comme dans votre fichier original.

    // --- FONCTIONS PRINCIPALES ---

    /**
     * Affiche dynamiquement les prompts dans le conteneur HTML.
     */
    function displayPrompts() {
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        promptContainer.innerHTML = ''; // Toujours vider avant de remplir

        prompts.forEach(prompt => {
            const cardHTML = `
                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500" data-id="${prompt.id}">
                    <h3 class="text-xl font-bold text-gray-800">${prompt.title}</h3>
                    <div class="text-xs text-gray-500 my-4 italic line-clamp-3">
                        ${prompt.content}
                    </div>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button data-action="use" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center">
                            <i class="fas fa-play mr-1"></i> Utiliser
                        </button>
                        <button data-action="edit" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm flex items-center">
                            <i class="fas fa-edit mr-1"></i> Modifier
                        </button>
                        <button data-action="open-chatgpt" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center">
                            <i class="fas fa-external-link-alt mr-1"></i> Ouvrir dans ChatGPT
                        </button>
                        <button data-action="save-response" class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center">
                            <i class="fas fa-save mr-1"></i> Enregistrer réponse
                        </button>
                    </div>
                </div>`;
            promptContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    /**
     * Ouvre et configure le modal pour utiliser ou modifier un prompt.
     * @param {string} promptId - L'ID du prompt à afficher.
     * @param {'use'|'edit'} mode - Le mode d'ouverture du modal.
     */
    function showPromptModal(promptId, mode) {
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        const promptData = prompts.find(p => p.id === promptId);
        if (!promptData) return;

        titleInput.value = promptData.title;
        contentTextarea.value = promptData.content;

        if (mode === 'edit') {
            modalTitle.textContent = 'Modifier le prompt : ' + promptData.title;
            titleInput.readOnly = false;
            contentTextarea.readOnly = false;
            saveButton.classList.remove('hidden');
            saveButton.dataset.promptId = promptId; // Stocker l'ID pour la sauvegarde
        } else { // mode 'use'
            modalTitle.textContent = 'Utiliser le prompt : ' + promptData.title;
            titleInput.readOnly = true;
            contentTextarea.readOnly = true;
            saveButton.classList.add('hidden');
        }
        promptModal.classList.remove('hidden');
    }
    
    /**
     * Initialise la page: vérifie les données, les crée si besoin, et affiche.
     */
    function initializePage() {
        let prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        if (prompts.length === 0) {
            console.log("Aucun prompt trouvé en mémoire, création des prompts par défaut.");
            DataStorage.save(DataStorage.KEYS.PROMPTS, defaultPrompts);
        }
        displayPrompts();
    }

    // --- GESTION DES ÉVÉNEMENTS ---

    // Gérer tous les clics sur les boutons des cartes de prompt
    promptContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const card = button.closest('[data-id]');
        const promptId = card.dataset.id;
        const action = button.dataset.action;
        
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        const promptData = prompts.find(p => p.id === promptId);

        switch (action) {
            case 'edit':
                showPromptModal(promptId, 'edit');
                break;
            case 'use':
                showPromptModal(promptId, 'use');
                break;
            case 'open-chatgpt':
                const encodedPrompt = encodeURIComponent(promptData.content);
                window.open(`https://chat.openai.com/?q=${encodedPrompt}`, '_blank');
                break;
            case 'save-response':
                // Logique pour le modal "Enregistrer réponse"
                alert("Fonctionnalité à connecter au modal de réponse.");
                // document.getElementById('responseModal').classList.remove('hidden');
                break;
        }
    });

    // Gérer le clic sur le bouton "Sauvegarder" du modal d'édition
    saveButton.addEventListener('click', () => {
        const promptId = saveButton.dataset.promptId;
        const updatedData = {
            title: titleInput.value,
            content: contentTextarea.value
        };

        if (DataStorage.update(DataStorage.KEYS.PROMPTS, promptId, updatedData)) {
            promptModal.classList.add('hidden');
            displayPrompts(); // Rafraîchir l'affichage
            alert('Prompt mis à jour avec succès !');
        } else {
            alert('Erreur lors de la mise à jour.');
        }
    });

    // Gérer la fermeture du modal
    document.querySelectorAll('.close-prompt-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            promptModal.classList.add('hidden');
        });
    });

    // --- DÉMARRAGE ---
    initializePage();
});
