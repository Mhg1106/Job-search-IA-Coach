// js/prompt-test.js - NOUVEAU FICHIER HARMONISÉ

document.addEventListener('DOMContentLoaded', function() {
    // --- ÉLÉMENTS DU DOM ---
    const promptSelect = document.getElementById('prompt-select');
    const promptEditor = document.getElementById('prompt-editor');
    const runTestBtn = document.getElementById('run-test-btn');
    const saveResultBtn = document.getElementById('save-result-btn');
    const resultInput = document.getElementById('result-input');
    
    let allPrompts = [];

    // --- INITIALISATION ---
    function initializeApp() {
        allPrompts = DataStorage.get(DataStorage.KEYS.PROMPTS, []);
        populatePromptSelect();
        setupEventListeners();
    }

    // --- FONCTIONS ---
    function populatePromptSelect() {
        promptSelect.innerHTML = '<option value="">-- Sélectionnez un prompt à tester --</option>';
        allPrompts.forEach(prompt => {
            promptSelect.innerHTML += `<option value="${prompt.id}">${prompt.title}</option>`;
        });
    }

    function setupEventListeners() {
        // Quand on choisit un prompt dans la liste, on l'affiche dans l'éditeur
        promptSelect.addEventListener('change', () => {
            const selectedId = promptSelect.value;
            const selectedPrompt = allPrompts.find(p => p.id === selectedId);
            if (selectedPrompt) {
                promptEditor.value = selectedPrompt.content;
            } else {
                promptEditor.value = '';
            }
        });

        // Logique du bouton "Tester"
        runTestBtn.addEventListener('click', () => {
            const promptText = promptEditor.value;
            if (!promptText.trim()) {
                alert('Veuillez sélectionner ou écrire un prompt avant de lancer le test.');
                return;
            }
            // Copier dans le presse-papiers
            navigator.clipboard.writeText(promptText).then(() => {
                alert('Prompt copié dans le presse-papiers !');
                // Ouvrir ChatGPT
                window.open(`https://chat.openai.com/`, '_blank');
            }).catch(err => {
                console.error('Erreur de copie:', err);
                alert('Impossible de copier le texte.');
            });
        });

        // Logique du bouton "Archiver"
        saveResultBtn.addEventListener('click', () => {
            const resultText = resultInput.value;
            const selectedPromptTitle = promptSelect.options[promptSelect.selectedIndex]?.text || 'Test personnalisé';

            if (!resultText.trim()) {
                alert('Veuillez coller un résultat à archiver.');
                return;
            }
            
            // Logique de sauvegarde (à définir plus précisément)
            console.log({
                promptTitle: selectedPromptTitle,
                result: resultText,
                date: new Date().toISOString()
            });
            alert(`Le résultat pour "${selectedPromptTitle}" a été archivé (visible dans la console pour le moment).`);
            resultInput.value = '';
        });
    }

    // --- DÉMARRAGE ---
    initializeApp();
});
