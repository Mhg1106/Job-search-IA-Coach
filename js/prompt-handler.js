// Contenu du fichier js/prompt-handler.js
document.addEventListener('DOMContentLoaded', function() {
  // Récupérer le modal
  const responseModal = document.getElementById('responseModal');
  
  // Gestionnaire pour ouvrir le modal
  function openModal() {
    responseModal.classList.remove('hidden');
  }
  
  // Gestionnaire pour fermer le modal
  function closeModal() {
    responseModal.classList.add('hidden');
  }
  
  // Ajouter des événements pour fermer le modal
  document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Fermer le modal si on clique en dehors
  window.addEventListener('click', function(event) {
    if (event.target === responseModal) {
      closeModal();
    }
  });

  // Gestion du bouton "Ouvrir dans ChatGPT"
  document.querySelectorAll('.open-in-chatgpt-btn').forEach(button => {
    button.addEventListener('click', function() {
      const promptId = this.getAttribute('data-prompt-id');
      const prompt = getPromptById(promptId);
      if (prompt) {
        // Ouvrir ChatGPT dans un nouvel onglet
        const chatGptUrl = 'https://chat.openai.com/';
        window.open(chatGptUrl, '_blank');
        
        // Copier le prompt dans le presse-papiers
        navigator.clipboard.writeText(prompt.content)
          .then(() => {
            alert('Le prompt a été copié dans votre presse-papiers. Collez-le dans ChatGPT pour continuer.');
          })
          .catch(err => {
            console.error('Erreur lors de la copie du prompt: ', err);
            alert('Erreur lors de la copie du prompt. Veuillez le copier manuellement.');
          });
      }
    });
  });
  
  // Gestion du bouton "Enregistrer la réponse"
  document.querySelectorAll('.save-response-btn').forEach(button => {
    button.addEventListener('click', function() {
      const promptId = this.getAttribute('data-prompt-id');
      const prompt = getPromptById(promptId);
      if (prompt) {
        // Remplir les champs du modal
        document.getElementById('promptTitle').value = prompt.title;
        
        // Remplir le sélecteur de coachés
        const coachedSelect = document.getElementById('coachedSelect');
        coachedSelect.innerHTML = '';
        
        const coacheds = getCoacheds();
        coacheds.forEach(coached => {
          const option = document.createElement('option');
          option.value = coached.id;
          option.textContent = coached.name;
          coachedSelect.appendChild(option);
        });
        
        // Afficher le modal
        openModal();
        
        // Stocker l'ID du prompt actuel
        document.getElementById('saveResponseBtn').setAttribute('data-prompt-id', promptId);
      }
    });
  });
  
  // Gestion du bouton "Enregistrer" dans le modal
  document.getElementById('saveResponseBtn').addEventListener('click', function() {
    const promptId = this.getAttribute('data-prompt-id');
    const responseContent = document.getElementById('responseContent').value;
    const coachedId = document.getElementById('coachedSelect').value;
    
    if (responseContent.trim() === '') {
      alert('Veuillez saisir une réponse avant d\'enregistrer.');
      return;
    }
    
    // Enregistrer la réponse
    savePromptResponse(promptId, coachedId, responseContent);
    
    // Fermer le modal
    closeModal();
    
    alert('Réponse enregistrée avec succès !');
  });
  
  // Fonctions utilitaires
 function getPromptById(id) {
    // Convertir l'ID en nombre pour correspondre à l'index (en partant de 1)
    const promptIndex = parseInt(id);
    
    // Sélectionner tous les conteneurs de prompts
    const promptContainers = document.querySelectorAll('.bg-white.p-5.rounded-lg.shadow-md.border-l-4');
    
    if (promptContainers && promptContainers[promptIndex - 1]) {
        // Récupérer le conteneur du prompt correspondant
        const promptContainer = promptContainers[promptIndex - 1];
        
        // Extraire le titre du prompt
        const title = promptContainer.querySelector('.text-xl.font-bold').textContent.trim();
        
        // Extraire le contenu du prompt (texte en italique)
        const contentElement = promptContainer.querySelector('.text-xs.text-gray-500.mb-4.italic');
        const content = contentElement ? contentElement.textContent.trim() : '';
        
        return {
            id: id,
            title: title,
            content: content
        };
    }
    
    // Si le prompt n'est pas trouvé, retourner null
    return null;
}
  
  function getCoacheds() {
    // Pour cet exemple, nous utilisons des données statiques
    // Dans une application réelle, vous récupéreriez cela depuis localStorage
    return [
      { id: "1", name: "Marie Dupont" },
      { id: "2", name: "Thomas Martin" },
      { id: "3", name: "Sophie Laurent" }
    ];
  }
  
  function savePromptResponse(promptId, coachedId, content) {
    // Dans une application réelle, vous sauvegarderiez dans localStorage
    console.log("Sauvegarde de la réponse:", { promptId, coachedId, content, date: new Date() });
    
    // Exemple avec localStorage:
    const responses = JSON.parse(localStorage.getItem('promptResponses') || '[]');
    
    const response = {
      id: generateUniqueId(),
      promptId: promptId,
      coachedId: coachedId,
      content: content,
      date: new Date().toISOString()
    };
    
    responses.push(response);
    localStorage.setItem('promptResponses', JSON.stringify(responses));
  }
  
  function generateUniqueId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }
});
