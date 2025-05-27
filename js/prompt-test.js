// prompt-test.js
document.addEventListener('DOMContentLoaded', function() {
  // Référencer les éléments
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
  
  // Simulation de base de données de prompts
  const prompts = {
    '1': {
      title: "Diagnostic de Départ",
      content: "Je suis un coach spécialisé en emploi et carrière. Je réalise un diagnostic initial pour [Nom du coaché], qui recherche un poste de [type de poste] dans le secteur [secteur].\n\nLe/la candidat(e) possède [années d'expérience] ans d'expérience et des compétences en [compétences].\n\nRéalise une analyse complète de la situation professionnelle actuelle avec :\n1. Une synthèse de la situation\n2. Les forces identifiées\n3. Les freins potentiels\n4. Les motivations principales\n5. Un plan d'action initial recommandé (court et moyen terme)\n6. Des actions spécifiques à mettre en place\n\nAdopte un ton constructif et encourageant. Structure ta réponse avec des titres et des listes pour faciliter la lecture."
    },
    '2': {
      title: "Analyse du Marché de l'Emploi",
      content: "En tant que coach en recherche d'emploi, j'ai besoin d'une analyse complète du marché pour le secteur [secteur] dans lequel mon coaché [Nom] souhaite travailler.\n\nPrésente les tendances actuelles du marché de l'emploi dans ce secteur avec :\n1. État général du marché (croissance, stabilité, déclin)\n2. Entreprises qui recrutent le plus\n3. Compétences les plus recherchées\n4. Salaires moyens pratiqués\n5. Évolutions prévisibles dans les 12 prochains mois\n\nFocalise ton analyse sur le poste de [type de poste] avec [années d'expérience] ans d'expérience. Inclus des recommandations pour se démarquer dans ce secteur."
    },
    '3': {
      title: "Plan d'Actions Concret",
      content: "Sur la base du diagnostic réalisé pour [Nom du coaché] qui recherche un poste de [type de poste] dans le secteur [secteur], élabore un plan d'action concret et détaillé. Le plan doit être structuré par semaine sur 2 mois avec des objectifs clairs, des actions précises et des livrables identifiés."
    }
    // Ajouter d'autres prompts au besoin
  };
  
  // Vérifier si un prompt est spécifié dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const promptParam = urlParams.get('prompt');
  if (promptParam) {
    promptSelect.value = promptParam;
    loadPrompt(promptParam);
  }
  
  // Charger un prompt lors de la sélection
  promptSelect.addEventListener('change', function() {
    if (this.value) {
      loadPrompt(this.value);
      promptTitle.value = '';
    }
  });
  
  // Fonction pour charger un prompt
  function loadPrompt(promptId) {
    if (prompts[promptId]) {
      promptEditor.value = prompts[promptId].content;
    }
  }
  
  // Bouton d'insertion de variable
  insertVarBtn.addEventListener('click', function() {
    const variables = [
      { name: 'Nom du coaché', value: '[Nom]' },
      { name: 'Type de poste', value: '[type de poste]' },
      { name: 'Secteur', value: '[secteur]' },
      { name: 'Années d\'expérience', value: '[années d\'expérience]' },
      { name: 'Compétences', value: '[compétences]' }
    ];
    
    // Créer un menu de sélection de variable
    const varMenu = document.createElement('div');
    varMenu.style.position = 'absolute';
    varMenu.style.zIndex = '100';
    varMenu.style.background = 'white';
    varMenu.style.border = '1px solid #ddd';
    varMenu.style.borderRadius = '4px';
    varMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    varMenu.style.maxHeight = '200px';
    varMenu.style.overflow = 'auto';
    varMenu.style.width = '200px';
    
    // Positionner le menu sous le bouton
    const rect = insertVarBtn.getBoundingClientRect();
    varMenu.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    varMenu.style.left = (rect.left + window.scrollX) + 'px';
    
    // Ajouter les options
    variables.forEach(variable => {
      const option = document.createElement('div');
      option.textContent = variable.name;
      option.style.padding = '8px 15px';
      option.style.cursor = 'pointer';
      option.style.transition = 'background 0.2s';
      
      option.addEventListener('mouseover', () => {
        option.style.backgroundColor = '#f0f0f0';
      });
      
      option.addEventListener('mouseout', () => {
        option.style.backgroundColor = 'transparent';
      });
      
      option.addEventListener('click', () => {
        // Insérer la variable à la position du curseur
        const start = promptEditor.selectionStart;
        const end = promptEditor.selectionEnd;
        promptEditor.value = promptEditor.value.substring(0, start) + variable.value + promptEditor.value.substring(end);
        
        // Repositionner le curseur
        promptEditor.focus();
        promptEditor.selectionStart = start + variable.value.length;
        promptEditor.selectionEnd = start + variable.value.length;
        
        // Fermer le menu
        document.body.removeChild(varMenu);
      });
      
      varMenu.appendChild(option);
    });
    
    document.body.appendChild(varMenu);
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', function closeMenu(event) {
      if (!varMenu.contains(event.target) && event.target !== insertVarBtn) {
        if (document.body.contains(varMenu)) {
          document.body.removeChild(varMenu);
        }
        document.removeEventListener('click', closeMenu);
      }
    });
  });
  
  // Bouton de formatage du prompt
  formatBtn.addEventListener('click', function() {
    const text = promptEditor.value;
    
    // Formater le texte (exemple simple)
    const formatted = text
      .replace(/\n\s*\n/g, '\n\n')  // Normaliser les sauts de ligne
      .replace(/([0-9]+\.)/g, '\n$1')  // Ajouter des sauts avant les numéros
      .trim();
    
    promptEditor.value = formatted;
  });
  
  // Bouton de sauvegarde du prompt
  savePromptBtn.addEventListener('click', function() {
    const title = promptTitle.value || promptSelect.options[promptSelect.selectedIndex]?.text || 'Nouveau prompt';
    
    // Simuler la sauvegarde
    alert(`Prompt "${title}" sauvegardé avec succès !`);
  });
  
  // Bouton d'exécution du test
  runTestBtn.addEventListener('click', function() {
    // Récupérer les valeurs des variables
    const name = document.getElementById('var-name').value;
    const position = document.getElementById('var-position').value;
    const sector = document.getElementById('var-sector').value;
    const experience = document.getElementById('var-experience').value;
    const skills = document.getElementById('var-skills').value;
    
    // Afficher le chargement
    testLoading.classList.remove('hidden');
    testOutput.style.opacity = '0.3';
    
    // Simuler le temps de traitement
    setTimeout(() => {
      // Cacher le chargement
      testLoading.classList.add('hidden');
      testOutput.style.opacity = '1';
      
      // En production, ici vous feriez un appel à une API d'IA
      // Pour l'instant, nous utilisons simplement le contenu existant
    }, 1500);
  });
  
  // Bouton de réinitialisation
  resetTestBtn.addEventListener('click', function() {
    // Réinitialiser les champs de variables
    document.getElementById('var-name').value = '';
    document.getElementById('var-position').value = '';
    document.getElementById('var-sector').value = '';
    document.getElementById('var-experience').value = '';
    document.getElementById('var-skills').value = '';
    document.getElementById('var-custom').value = '';
    
    // Réinitialiser l'éditeur si un prompt est sélectionné
    if (promptSelect.value) {
      loadPrompt(promptSelect.value);
    } else {
      promptEditor.value = '';
    }
  });
  
  // Boutons d'évaluation
  ratingBtns.forEach(button => {
    button.addEventListener('click', function() {
      const rating = this.getAttribute('data-rating');
      
      // Réinitialiser toutes les étoiles
      ratingBtns.forEach(btn => {
        btn.querySelector('i').className = 'far fa-star text-yellow-400';
      });
      
      // Remplir les étoiles jusqu'à la note sélectionnée
      for (let i = 0; i < rating; i++) {
        ratingBtns[i].querySelector('i').className = 'fas fa-star text-yellow-400';
      }
    });
  });
  
  // Bouton de sauvegarde du feedback
  saveFeedbackBtn.addEventListener('click', function() {
    const rating = document.querySelectorAll('.fas.fa-star').length;
    const feedback = feedbackText.value;
    
    // Simuler la sauvegarde du feedback
    alert(`Évaluation sauvegardée (${rating}/5) : ${feedback || 'Pas de commentaire'}`);
  });
});
