// coachees.js
document.addEventListener('DOMContentLoaded', function() {
  // Référencer les éléments
  const searchInput = document.getElementById('coachee-search');
  const statusFilter = document.getElementById('status-filter');
  const stageFilter = document.getElementById('stage-filter');
  const addCoacheeBtn = document.getElementById('add-coachee');
  const modal = document.getElementById('add-coachee-modal');
  const closeModal = modal ? modal.querySelector('.close') : null;
  const cancelBtn = modal ? modal.querySelector('.cancel-btn') : null;
  const coacheeForm = document.getElementById('new-coachee-form');
  
  // Fonctionnalité de recherche
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const cards = document.querySelectorAll('.coachee-card');
      
      cards.forEach(card => {
        const nameElement = card.querySelector('.coachee-name');
        const positionElement = card.querySelector('.coachee-position');
        
        if (nameElement && positionElement) {
          const name = nameElement.textContent.toLowerCase();
          const position = positionElement.textContent.toLowerCase();
          
          if (name.includes(searchTerm) || position.includes(searchTerm)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  }

  // Filtre par statut
  if (statusFilter) {
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
  }

  // Filtre par étape
  if (stageFilter) {
    stageFilter.addEventListener('change', function() {
      const stage = this.value;
      const cards = document.querySelectorAll('.coachee-card');
      
      cards.forEach(card => {
        const stageElement = card.querySelector('.current-stage span');
        if (stageElement) {
          const currentStage = stageElement.textContent;
          const stageMapping = {
            '1': 'Diagnostic Initial',
            '2': 'Analyse du Marché',
            '3': 'Plan d\'Actions',
            '4': 'Analyse CV',
            '5': 'Recherche d\'emploi',
            '6': 'Matching',
            '7': 'Lettres de motivation',
            '8': 'Ciblage',
            '9': 'Préparation entretien',
            '10': 'Bilan final'
          };
          
          if (stage === 'all' || currentStage === stageMapping[stage]) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  }
  
  // Modal d'ajout de coaché - avec vérifications
  if (addCoacheeBtn) {
    addCoacheeBtn.addEventListener('click', function() {
      if (modal) {
        modal.style.display = 'flex';
      }
    });
  }
  
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      if (modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      if (modal) {
        modal.style.display = 'none';
      }
    });
  }

  // Gestion du formulaire
  if (coacheeForm) {
    coacheeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Logique d'ajout de coaché à implémenter
      console.log('Formulaire soumis');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  }

  // 🆕 NOUVELLES FONCTIONS pour les boutons
  function openAddCoacheeModal() {
    const modal = document.getElementById('add-coachee-modal');
    if (modal) {
      modal.style.display = 'flex';
    } else {
      alert('Modal d\'ajout non trouvé - Fonctionnalité à développer');
    }
  }

  function showFictionalCoacheesOptions() {
    // Menu d'options pour les coachés fictifs
    const options = [
      'Générer 5 coachés fictifs',
      'Générer 10 coachés fictifs',
      'Supprimer tous les coachés fictifs'
    ];
    
    const choice = prompt('Options coachés fictifs:\n1. ' + options[0] + '\n2. ' + options[1] + '\n3. ' + options[2] + '\n\nEntrez votre choix (1-3):');
    
    switch(choice) {
      case '1':
        alert('Génération de 5 coachés fictifs - À implémenter');
        break;
      case '2':
        alert('Génération de 10 coachés fictifs - À implémenter');
        break;
      case '3':
        alert('Suppression des coachés fictifs - À implémenter');
        break;
      default:
        console.log('Action annulée');
    }
  }
  
  // ⚠️ IMPORTANT: Rendre les fonctions globales pour le HTML
  window.openAddCoacheeModal = openAddCoacheeModal;
  window.showFictionalCoacheesOptions = showFictionalCoacheesOptions;
  
}); // Fin du DOMContentLoaded
