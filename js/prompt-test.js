// prompt-test.js
document.addEventListener('DOMContentLoaded', function() {
  // Éléments DOM
  const promptSelect = document.getElementById('prompt-select');
  const promptTitle = document.getElementById('prompt-title');
  const promptEditor = document.getElementById('prompt-editor');
  const insertVarBtn = document.getElementById('insert-variable');
  const formatBtn = document.getElementById('format-prompt');
  const savePromptBtn = document.getElementById('save-prompt');
  const runTestBtn = document.getElementById('run-test');
  const resetTestBtn = document.getElementById('reset-test');
  const testLoading = document.getElementById('test-loading');
  const testOutput = document.getElementById('test-output');
  const ratingBtns = document.querySelectorAll('.rating-btn');
  const feedbackText = document.getElementById('feedback-text');
  const saveFeedbackBtn = document.getElementById('save-feedback');
  
  // Base de prompts (simulée pour l'exemple)
  const prompts = {
    1: {
      title: "Diagnostic de Départ",
      content: "Je suis un coach spécialisé en emploi et carrière. Je réalise un diagnostic initial pour [Nom du coaché], qui recherche un poste de [type de poste] dans le secteur [secteur].\n\nLe/la candidat(e) possède [années d'expérience] ans d'expérience et des compétences en [compétences].\n\nRéalise une analyse complète de la situation professionnelle actuelle avec :\n1. Une synthèse de la situation\n2. Les forces identifiées\n3. Les freins potentiels\n4. Les motivations principales\n5. Un plan d'action initial recommandé (court et moyen terme)\n6. Des actions spécifiques à mettre en place\n\nAdopte un ton constructif et encourageant. Structure ta réponse avec des titres et des listes pour faciliter la lecture."
    },
    2: {
      title: "Analyse du Marché de l'Emploi",
      content: "En tant que coach en recherche d'emploi, j'ai besoin d'une analyse complète du marché pour le secteur [secteur] dans lequel mon coaché [Nom] souhaite travailler.\n\nPrésente les tendances actuelles du marché de l'emploi dans ce secteur avec :\n1. État général du marché (croissance, stabilité, déclin)\n2. Entreprises qui recrutent le plus\n3. Compétences les plus recherchées\n4. Salaires moyens pratiqués\n5. Évolutions prévisibles dans les 12 prochains mois\n\nFocalise ton analyse sur le poste de [type de poste] avec [années d'expérience] ans d'expérience. Inclus des recommandations pour se démarquer dans ce secteur."
    }
  };
  
  // Gestion du changement de prompt
  promptSelect.addEventListener('change', function() {
    const selectedPromptId = this.value;
    
    if (selectedPromptId) {
      const selectedPrompt = prompts[selectedPromptId];
      promptTitle.value = '';
      promptEditor.value = selectedPrompt.content;
    }
  });
  
  // Insertion de variable
  insertVarBtn.addEventListener('click', function() {
    const variables = [
      { name: 'Nom du coaché', value: '[Nom]' },
      { name: 'Type de poste', value: '[type de poste]' },
      { name: 'Secteur', value: '[secteur]' },
      { name: 'Années d\'expérience', value: '[années d\'expérience]' },
      { name: 'Compétences', value: '[compétences]' },
      { name: 'Variable personnalisée', value: '[variable_personnalisée]' }
    ];
    
    // Création d'un petit menu pour choisir la variable
    const menu = document.createElement('div');
    menu.className = 'variable-menu';
    menu.style.position = 'absolute';
    menu.style.zIndex = '100';
    menu.style.background = 'white';
    menu.style.border = '1px solid #ddd';
    menu.style.borderRadius = '4px';
    menu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    menu.style.padding = '5px 0';
    menu.style.maxHeight = '200px';
    menu.style.overflow = 'auto';
    
    variables.forEach(variable => {
      const item = document.createElement('div');
      item.textContent = variable.name;
      item.style.padding = '8px 15px';
      item.style.cursor = 'pointer';
      
      item.addEventListener('mouseover', function() {
        this.style.background = '#f0f0f0';
      });
      
      item.addEventListener('mouseout', function() {
        this.style.background = 'transparent';
      });
      
      item.addEventListener('click', function() {
        // Insérer la variable à la position du curseur
        const cursorPos = promptEditor.selectionStart;
        const textBefore = promptEditor.value.substring(0, cursorPos);
        const textAfter = promptEditor.value.substring(cursorPos);
        
        promptEditor.value = textBefore + variable.value + textAfter;
        
        // Repositionner le curseur
        promptEditor.focus();
        promptEditor.selectionStart = cursorPos + variable.value.length;
        promptEditor.selectionEnd = cursorPos + variable.value.length;
        
        // Supprimer le menu
        menu.remove();
      });
      
      menu.appendChild(item);
    });
    
    // Positionner le menu près du bouton
    const buttonRect = insertVarBtn.getBoundingClientRect();
    menu.style.top = (buttonRect.bottom + 5) + 'px';
    menu.style.left = buttonRect.
