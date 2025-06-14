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
    
    // Récupérer les données du formulaire
    const name = document.getElementById('coachee-name').value;
    const position = document.getElementById('coachee-position').value;
    const email = document.getElementById('coachee-email').value;
    
    // Créer un nouveau coaché
    addNewCoachee(name, position, email);
    
    // Fermer le modal et réinitialiser le formulaire
    if (modal) {
      modal.style.display = 'none';
    }
    coacheeForm.reset();
  });
}

// 🗄️ FONCTIONS DE PERSISTANCE DES DONNÉES
function saveCoacheesToStorage() {
  const coachees = [];
  const coacheeCards = document.querySelectorAll('.coachee-card');
  
  coacheeCards.forEach(card => {
    const coacheeData = {
      id: card.getAttribute('data-coachee-id'),
      name: card.querySelector('.coachee-name').textContent,
      position: card.querySelector('.coachee-position').textContent,
      status: card.querySelector('.coachee-status').textContent,
      currentStage: card.querySelector('.current-stage span').textContent,
      progress: card.querySelector('.progress-bar').style.width,
      progressText: card.querySelector('.progress-bar span').textContent,
      lastActivity: card.querySelector('.last-activity span').textContent,
      avatarColor: card.querySelector('.coachee-avatar').style.backgroundColor,
      avatarInitials: card.querySelector('.coachee-avatar').textContent,
      isCustom: card.hasAttribute('data-custom') // Pour identifier les cartes ajoutées dynamiquement
    };
    coachees.push(coacheeData);
  });
  
  localStorage.setItem('job-coach-coachees', JSON.stringify(coachees));
  console.log('Coachés sauvegardés:', coachees.length);
}

function loadCoacheesFromStorage() {
  const savedCoachees = localStorage.getItem('job-coach-coachees');
  if (!savedCoachees) {
    console.log('Aucun coaché sauvegardé trouvé');
    return;
  }
  
  const coachees = JSON.parse(savedCoachees);
  console.log('Coachés chargés:', coachees.length);
  
  // Supprimer les cartes personnalisées existantes pour éviter les doublons
  document.querySelectorAll('.coachee-card[data-custom]').forEach(card => {
    card.remove();
  });
  
  // Recréer les cartes personnalisées
  const customCoachees = coachees.filter(c => c.isCustom);
  customCoachees.forEach(coacheeData => {
    createCoacheeCardFromData(coacheeData);
  });
}

function createCoacheeCardFromData(coacheeData) {
  const lastCard = document.querySelector('.coachee-card:not([data-custom]):last-of-type') || 
                   document.querySelector('.coachee-card:last-child');
  
  if (!lastCard) return;
  
  const newCard = document.createElement('div');
  newCard.className = 'coachee-card bg-white rounded-lg shadow-md overflow-hidden mb-4';
  newCard.setAttribute('data-coachee-id', coacheeData.id);
  newCard.setAttribute('data-custom', 'true'); // Marquer comme personnalisé
  
  newCard.innerHTML = `
    <div class="coachee-header flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
      <div class="coachee-avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${coacheeData.avatarColor};">${coacheeData.avatarInitials}</div>
      <div class="flex items-center gap-2">
        <div class="fictional-badge px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800" style="display: none;">Fictif</div>
        <div class="coachee-status px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">${coacheeData.status}</div>
      </div>
      <div class="coachee-actions flex gap-1">
        <button onclick="editCoachee('${coacheeData.id}')" class="btn-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" title="Modifier">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="toggleCoacheeMenu('${coacheeData.id}')" class="btn-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" title="Plus d'options">
          <i class="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
    <div class="coachee-body p-4">
      <h3 class="coachee-name text-lg font-bold mb-1">${coacheeData.name}</h3>
      <p class="coachee-position text-sm text-gray-600 mb-3">${coacheeData.position}</p>
      <div class="progress-container h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div class="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-500 relative" style="width: ${coacheeData.progress};">
          <span class="absolute right-0 top-0 transform translate-y-4 text-xs text-gray-600">${coacheeData.progressText}</span>
        </div>
      </div>
      <p class="current-stage flex items-center text-sm text-gray-700 mb-2">
        <i class="fas fa-tasks mr-2 text-gray-500"></i>
        <span>${coacheeData.currentStage}</span>
      </p>
      <p class="last-activity flex items-center text-sm text-gray-700">
        <i class="fas fa-clock mr-2 text-gray-500"></i>
        <span>${coacheeData.lastActivity}</span>
      </p>
    </div>
    <div class="coachee-footer flex justify-between p-4 border-t border-gray-200 bg-gray-50">
      <button onclick="startSession('${coacheeData.name}', '1')" class="btn-action flex items-center px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded">
        <i class="fas fa-play mr-1"></i> Session
      </button>
      <button onclick="openDossier('${coacheeData.name}')" class="btn-action flex items-center px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded">
        <i class="fas fa-folder-open mr-1"></i> Dossier
      </button>
    </div>
    
    <div id="menu-${coacheeData.id}" class="coachee-menu absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden">
      <button onclick="editCoachee('${coacheeData.id}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
        <i class="fas fa-edit mr-2 text-blue-600"></i>Modifier
      </button>
      <button onclick="duplicateCoachee('${coacheeData.id}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
        <i class="fas fa-copy mr-2 text-green-600"></i>Dupliquer
      </button>
      <button onclick="exportCoachee('${coacheeData.id}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
        <i class="fas fa-download mr-2 text-purple-600"></i>Exporter
      </button>
      <hr class="my-1">
      <button onclick="deleteCoachee('${coacheeData.id}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600">
        <i class="fas fa-trash mr-2"></i>Supprimer
      </button>
    </div>
  `;
  
  lastCard.insertAdjacentElement('afterend', newCard);
}

function addNewCoachee(name, position, email) {
  console.log('Ajout de:', name);
  
  // 🆕 NOUVELLE APPROCHE : Insérer après la dernière carte existante
  const allCards = document.querySelectorAll('.coachee-card');
  if (allCards.length === 0) {
    alert('Aucune carte trouvée');
    return;
  }
  
  // Prendre la dernière carte comme référence
  const lastCard = allCards[allCards.length - 1];
  console.log('Insertion après la carte:', lastCard.querySelector('.coachee-name').textContent);
  
  // Générer un ID unique pour le nouveau coaché
  const coacheeId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Générer les initiales du coaché
  const initials = name.split(' ').map(part => part[0]).join('').toUpperCase();
  
  // Générer une couleur aléatoire pour l'avatar
  const colors = ['#3498DB', '#9B59B6', '#2ECC71', '#E67E22', '#F39C12', '#E74C3C'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Créer un nouvel élément de carte de coaché
  const newCard = document.createElement('div');
  newCard.className = 'coachee-card bg-white rounded-lg shadow-md overflow-hidden mb-4'; // Ajout mb-4 pour l'espacement
  newCard.setAttribute('data-coachee-id', coacheeId);
  
  // Structure identique à vos cartes existantes
  newCard.innerHTML = `
    <div class="coachee-header flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
      <div class="coachee-avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${randomColor};">${initials}</div>
      <div class="flex items-center gap-2">
        <!-- Badge fictif (conditionnel) -->
        <div class="fictional-badge px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800" style="display: none;">Fictif</div>
        <div class="coachee-status px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Actif</div>
      </div>
      <div class="coachee-actions flex gap-1">
        <button onclick="editCoachee('${coacheeId}')" class="btn-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" title="Modifier">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="toggleCoacheeMenu('${coacheeId}')" class="btn-icon w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200" title="Plus d'options">
          <i class="fas fa-ellipsis-v"></i>
        </button>
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
        <span>Dernière activité : Maintenant</span>
      </p>
    </div>
    <div class="coachee-footer flex justify-between p-4 border-t border-gray-200 bg-gray-50">
      <button onclick="startSession('${name}', '1')" class="btn-action flex items-center px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded">
        <i class="fas fa-play mr-1"></i> Session
      </button>
      <button onclick="openDossier('${name}')" class="btn-action flex items-center px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded">
        <i class="fas fa-folder-open mr-1"></i> Dossier
      </button>
    </div>
    
    <!-- Menu contextuel (caché par défaut) -->
    <div id="menu-${coacheeId}" class="coachee-menu absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden">
      <button onclick="editCoachee('${coacheeId}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
        <i class="fas fa-edit mr-2 text-blue-600"></i>Modifier
      </button>
      <button onclick="duplicateCoachee('${coacheeId}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
        <i class="fas fa-copy mr-2 text-green-600"></i>Dupliquer
      </button>
      <button onclick="exportCoachee('${coacheeId}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
        <i class="fas fa-download mr-2 text-purple-600"></i>Exporter
      </button>
      <hr class="my-1">
      <button onclick="deleteCoachee('${coacheeId}')" class="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600">
        <i class="fas fa-trash mr-2"></i>Supprimer
      </button>
    </div>
  `;
  
  // 🎯 INSERTION CORRECTE : Après la dernière carte
  lastCard.insertAdjacentElement('afterend', newCard);

  // Marquer comme carte personnalisée
  newCard.setAttribute('data-custom', 'true');
  
  // Sauvegarder automatiquement
  saveCoacheesToStorage();

  console.log('Nouvelle carte ajoutée après', lastCard.querySelector('.coachee-name').textContent);
  alert(`Coaché ${name} ajouté avec succès !`);
}

// Functions utilitaires pour les nouvelles cartes
function toggleNewCoacheeMenu(coacheeId) {
  const menu = document.getElementById('menu-' + coacheeId);
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function confirmDeleteNewCoachee(coacheeId, name) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le coaché ${name} ?`)) {
    const card = document.querySelector(`[data-coachee-id="${coacheeId}"]`);
    if (card) {
      card.remove();
      alert(`${name} a été supprimé.`);
    }
  }
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
  
// 🆕 FONCTIONS POUR QUE TOUS LES BOUTONS MARCHENT
function editCoachee(coacheeId) {
  alert(`Fonction Modifier pour ${coacheeId} - À implémenter`);
}

function toggleCoacheeMenu(coacheeId) {
  const menu = document.getElementById('menu-' + coacheeId);
  if (menu) {
    // Fermer tous les autres menus d'abord
    document.querySelectorAll('.coachee-menu').forEach(m => {
      if (m !== menu) m.classList.add('hidden');
    });
    // Toggle le menu actuel
    menu.classList.toggle('hidden');
  }
}

function duplicateCoachee(coacheeId) {
  alert(`Fonction Dupliquer pour ${coacheeId} - À implémenter`);
}

function exportCoachee(coacheeId) {
  alert(`Fonction Exporter pour ${coacheeId} - À implémenter`);
}

function deleteCoachee(coacheeId) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ce coaché ?`)) {
    const card = document.querySelector(`[data-coachee-id="${coacheeId}"]`);
    if (card) {
      const name = card.querySelector('.coachee-name').textContent;
      card.remove();
      
      // 🆕 SAUVEGARDER APRÈS SUPPRESSION
      saveCoacheesToStorage();
      
      alert(`${name} a été supprimé.`);
    }
  }
}

function startSession(name, step) {
  alert(`Démarrer une session avec ${name} (étape ${step}) - À implémenter`);
}

function openDossier(name) {
  alert(`Ouvrir le dossier de ${name} - À implémenter`);
}

  // 🆕 CHARGER LES COACHÉS SAUVEGARDÉS (À LA FIN, APRÈS LES DÉFINITIONS)
  loadCoacheesFromStorage();

  // ⚠️ IMPORTANT: Rendre les fonctions globales pour le HTML
  window.openAddCoacheeModal = openAddCoacheeModal;
  window.showFictionalCoacheesOptions = showFictionalCoacheesOptions;
  
}); // Fin du DOMContentLoaded
