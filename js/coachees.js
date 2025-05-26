// coachees.js
document.addEventListener('DOMContentLoaded', function() {
  // Récupérer les éléments du DOM
  const coacheeSearch = document.getElementById('coachee-search');
  const statusFilter = document.getElementById('status-filter');
  const stageFilter = document.getElementById('stage-filter');
  const addCoacheeBtn = document.getElementById('add-coachee');
  const modal = document.getElementById('add-coachee-modal');
  const closeModal = modal.querySelector('.close');
  const cancelBtn = modal.querySelector('.cancel-btn');
  const coacheeForm = document.getElementById('new-coachee-form');
  const coacheeCards = document.querySelectorAll('.coachee-card');
  
  // Filtrage en temps réel
  coacheeSearch.addEventListener('input', filterCoachees);
  statusFilter.addEventListener('change', filterCoachees);
  stageFilter.addEventListener('change', filterCoachees);
  
  // Fonction de filtrage
  function filterCoachees() {
    const searchTerm = coacheeSearch.value.toLowerCase();
    const statusValue = statusFilter.value;
    const stageValue = stageFilter.value;
    
    coacheeCards.forEach(card => {
      const name = card.querySelector('.coachee-name').textContent.toLowerCase();
      const position = card.querySelector('.coachee-position').textContent.toLowerCase();
      const status = card.classList.contains('active') ? 'active' : 
                     card.classList.contains('pending') ? 'pending' : 'completed';
      const stage = card.querySelector('.current-stage span').textContent;
      const stageNumber = getStageNumber(stage);
      
      const matchesSearch = name.includes(searchTerm) || position.includes(searchTerm);
      const matchesStatus = statusValue === 'all' || status === statusValue;
      const matchesStage = stageValue === 'all' || stageNumber.toString() === stageValue;
      
      if (matchesSearch && matchesStatus && matchesStage) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
  
  // Helper pour obtenir le numéro d'étape à partir du texte
  function getStageNumber(stageName) {
    const stageMap = {
      'Diagnostic Initial': 1,
      'Analyse du Marché': 2,
      'Plan d\'Actions': 3,
      'Analyse CV': 4,
      'Recherche Entreprise': 5,
      'Matching CV/Offre': 6,
      'Lettre de Motivation': 7,
      'Ciblage Offres': 8,
      'Préparation Entretien': 9,
      'Bilan Coaching': 10
    };
    
    return stageMap[stageName] || 0;
  }
  
  // Gestion du modal
  addCoacheeBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });
  
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Fermeture du modal en cliquant à l'extérieur
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Gestion du formulaire
  coacheeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupération des données du formulaire
    const name = document.getElementById('coachee-name').value;
    const position = document.getElementById('coachee-position').value;
    const email = document.getElementById('coachee-email').value;
    
    // Ici, vous ajouteriez normalement le code pour enregistrer le nouveau coaché
    // via une API ou dans un stockage local
    
    // Pour l'exemple, on pourrait ajouter une nouvelle carte
    addNewCoacheeCard(name, position);
    
    // Réinitialiser le formulaire et fermer le modal
    coacheeForm.reset();
    modal.style.display = 'none';
  });
  
  // Fonction pour ajouter une nouvelle carte coaché (simulation)
  function addNewCoacheeCard(name, position) {
    // Créer les initiales pour l'avatar
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    // Créer une nouvelle carte
    const newCard = document.createElement('div');
    newCard.className = 'coachee-card active';
    
    // Générer une couleur aléatoire pour l'avatar
    const colors = ['#3498DB', '#E67E22', '#9B59B6', '#2ECC71', '#1ABC9C', '#F39C12'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Construction du HTML de la carte
    newCard.innerHTML = `
      <div class="coachee-header">
        <div class="coachee-avatar" style="background-color: ${randomColor};">${initials}</div>
        <div class="coachee-status active">Actif</div>
        <div class="coachee-actions">
          <button class="btn-icon" title="Modifier"><i class="fas fa-edit"></i></button>
          <button class="btn-icon" title="Plus d'options"><i class="fas fa-ellipsis-v"></i></button>
        </div>
      </div>
      <div class="coachee-body">
        <h3 class="coachee-name">${name}</h3>
        <p class="coachee-position">${position}</p>
        <div class="progress-container">
          <div class="progress-bar" style="width: 10%;">
            <span>1/10</span>
          </div>
        </div>
        <p class="current-stage">
          <i class="fas fa-tasks"></i>
          <span>Diagnostic Initial</span>
        </p>
        <p class="last-activity">
          <i class="fas fa-clock"></i>
          <span>Dernière activité : Aujourd'hui, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </p>
      </div>
      <div class="coachee-footer">
        <button class="btn-action">
          <i class="fas fa-play"></i> Session
        </button>
        <button class="btn-action">
          <i class="fas fa-folder-open"></i> Dossier
        </button>
      </div>
    `;
    
    // Ajouter la carte à la grille
    document.querySelector('.coachees-grid').prepend(newCard);
  }
});
