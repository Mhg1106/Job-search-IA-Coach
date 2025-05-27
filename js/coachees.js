// coachees.js
document.addEventListener('DOMContentLoaded', function() {
  // Référencer les éléments
  const searchInput = document.getElementById('coachee-search');
  const statusFilter = document.getElementById('status-filter');
  const stageFilter = document.getElementById('stage-filter');
  const addCoacheeBtn = document.getElementById('add-coachee');
  const modal = document.getElementById('add-coachee-modal');
  const closeModal = modal.querySelector('.close');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const coacheeForm = document.getElementById('new-coachee-form');
  
  // Fonctionnalité de recherche
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.coachee-card');
    
    cards.forEach(card => {
      const name = card.querySelector('.coachee-name').textContent.toLowerCase();
      const position = card.querySelector('.coachee-position').textContent.toLowerCase();
      
      if (name.includes(searchTerm) || position.includes(searchTerm)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
  
  // Filtre par statut
  statusFilter.addEventListener('change', function() {
    const status = this.value;
    const cards = document.querySelectorAll('.coachee-card');
    
    cards.forEach(card => {
      if (status === 'all' || card.classList.contains(status)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
  
  // Filtre par étape
  stageFilter.addEventListener('change', function() {
    const stage = this.value;
    const cards = document.querySelectorAll('.coachee-card');
    
    cards.forEach(card => {
      const currentStage = card.querySelector('.current-stage span').textContent;
      const stageMapping = {
        '1': 'Diagnostic Initial',
        '2': 'Analyse du Marché',
        '3': 'Plan d\'Actions',
        '4': 'Analyse CV',
        '5': 'Recherche Entreprise',
        '6': 'Matching CV/Offre',
        '7': 'Lettre de Motivation',
        '8': 'Ciblage Offres',
        '9': 'Préparation Entretien',
        '10': 'Bilan Coaching'
      };
      
      if (stage === 'all' || currentStage === stageMapping[stage]) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
  
  // Modal d'ajout de coaché
  addCoacheeBtn.addEventListener('click', function() {
    modal.style.display = 'flex';
  });
  
  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  cancelBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Cliquer en dehors du modal pour fermer
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Soumission du formulaire d'ajout
  coacheeForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Récupérer les données du formulaire
    const name = document.getElementById('coachee-name').value;
    const position = document.getElementById('coachee-position').value;
    const email = document.getElementById('coachee-email').value;
    const phone = document.getElementById('coachee-phone').value;
    const notes = document.getElementById('coachee-notes').value;
    
    // Créer un nouveau coaché (pour simulation)
    addNewCoachee(name, position, email);
    
    // Fermer le modal et réinitialiser le formulaire
    modal.style.display = 'none';
    coacheeForm.reset();
  });
  
  // Fonction pour ajouter un nouveau coaché (simulation)
  function addNewCoachee(name, position, email) {
    // Créer un nouvel élément de carte de coaché
    const coacheeGrid = document.querySelector('.coachees-grid');
    const newCard = document.createElement('div');
    newCard.className = 'coachee-card active bg-white rounded-lg shadow-md overflow-hidden';
    
    // Générer les initiales du coaché
    const initials = name.split(' ').map(part => part[0]).join('');
    
    // Générer une couleur aléatoire pour l'avatar
    const colors = ['#3498DB', '#9B59B6', '#2ECC71', '#E67E22', '#F39C12'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Remplir la carte avec les informations du nouveau coaché
    newCard.innerHTML = `
      <div class="coachee-header flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
        <div class="coachee-avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${randomColor};">${initials}</div>
        <div class="coachee-status px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Actif</div>
        <div class="coachee-actions flex gap-1">
          <button class="btn-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" title="Modifier"><i class="fas fa-edit"></i></button>
          <button class="btn-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" title="Plus d'options"><i class="fas fa-ellipsis-v"></i></button>
        </div>
      </div>
      <div class="coachee-body p-4">
        <h3 class="coachee-name text-lg font-bold mb-1">${name}</h3>
        <p class="coachee-position text-sm text-gray-600 mb-3">${position}</p>
        <div class="progress-container h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div class="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500 relative" style="width: 10%;">
            <span class="absolute right-0 top-0 transform translate-y-4 text-xs text-gray-600">1/10</span>
          </div>
        </div>
        <p class="current-stage flex items-center text-sm text-gray-700 mb-2">
          <i class="fas fa-tasks mr-2 text-gray-500"></i>
          <span>Diagnostic Initial</span>
        </p>
        <p class="last-activity flex items-center text-sm text-gray-700">
          <i class="fas fa-clock mr-2 text-gray-500"></i>
          <span>Dernière activité : Aujourd'hui</span>
        </p>
      </div>
      <div class="coachee-footer flex justify-between p-4 border-t border-gray-200 bg-gray-50">
        <button class="btn-action flex items-center px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded">
          <i class="fas fa-play mr-1"></i> Session
        </button>
        <button class="btn-action flex items-center px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded">
          <i class="fas fa-folder-open mr-1"></i> Dossier
        </button>
      </div>
    `;
    
    // Ajouter la nouvelle carte au début de la grille
    coacheeGrid.insertBefore(newCard, coacheeGrid.firstChild);
    
    // Ajouter les événements pour les boutons de la nouvelle carte
    setupCardButtons(newCard);
  }
  
  // Configurer les boutons pour toutes les cartes existantes
  function setupCardButtons() {
    const sessionButtons = document.querySelectorAll('.btn-action:first-child');
    const folderButtons = document.querySelectorAll('.btn-action:last-child');
    
    sessionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const card = this.closest('.coachee-card');
        const name = card.querySelector('.coachee-name').textContent;
        alert(`Démarrer une session avec ${name}`);
        // Ici vous pourriez rediriger vers une page de session
      });
    });
    
    folderButtons.forEach(button => {
      button.addEventListener('click', function() {
        const card = this.closest('.coachee-card');
        const name = card.querySelector('.coachee-name').textContent;
        alert(`Ouvrir le dossier de ${name}`);
        // Ici vous pourriez rediriger vers une page de dossier
      });
    });
  }
  
  // Initialiser les boutons des cartes
  setupCardButtons();
});

