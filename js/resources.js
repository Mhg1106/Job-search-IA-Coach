document.addEventListener('DOMContentLoaded', function() {
  // Référencer les éléments
  const filterButtons = document.querySelectorAll('.flex.flex-wrap.mb-8 button');
  const resourceCards = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-6 > div');
  const addResourceButton = document.querySelector('.mt-8.flex.justify-end button');
  
  // Fonctionnalité des boutons de filtre
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Réinitialiser tous les boutons au style par défaut
      filterButtons.forEach(btn => {
        btn.classList.remove('bg-gray-800', 'text-white');
        btn.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
      });
      
      // Appliquer le style actif au bouton cliqué
      this.classList.remove('bg-gray-200', 'hover:bg-gray-300', 'text-gray-800');
      this.classList.add('bg-gray-800', 'text-white');
      
      // Filtrer les ressources
      const filterCategory = this.textContent.trim().toLowerCase();
      
      resourceCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (filterCategory === 'tous' || 
            title.includes(filterCategory) || 
            description.includes(filterCategory)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Fonctionnalité des boutons de téléchargement
  const downloadButtons = document.querySelectorAll('.bg-red-500.hover\\:bg-red-600');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
      const resourceCard = this.closest('div.p-5');
      const resourceTitle = resourceCard.querySelector('h2').textContent;
      const resourceType = resourceCard.querySelector('span.text-xs.text-gray-500').textContent;
      
      // Simulation de téléchargement
      alert(`Téléchargement de "${resourceTitle}" (${resourceType}) en cours...`);
      
      // Pour un vrai téléchargement, on pourrait faire:
      // window.location.href = `downloads/${resourceTitle.toLowerCase().replace(/\s+/g, '-')}.zip`;
    });
  });
  
  // Fonctionnalité des boutons de consultation
  const consultButtons = document.querySelectorAll('.bg-blue-500.hover\\:bg-blue-600');
  consultButtons.forEach(button => {
    button.addEventListener('click', function() {
      const resourceCard = this.closest('div.p-5');
      const resourceTitle = resourceCard.querySelector('h2').textContent;
      
      // Simulation d'ouverture de ressource
      alert(`Ouverture de "${resourceTitle}" pour consultation...`);
      
      // Pour une vraie ouverture, on pourrait faire:
      // window.open(`resources/${resourceTitle.toLowerCase().replace(/\s+/g, '-')}.html`, '_blank');
    });
  });
  
  // Fonctionnalité du bouton d'ajout de ressource
  if (addResourceButton) {
    addResourceButton.addEventListener('click', function() {
      // Créer un modal pour l'ajout de ressource (simulation)
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Ajouter une ressource</h2>
            <button class="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
          </div>
          <form id="add-resource-form">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Titre de la ressource">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea class="w-full px-3 py-2 border border-gray-300 rounded-md" rows="2" placeholder="Description de la ressource"></textarea>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="cv">CV</option>
                <option value="lettres">Lettres</option>
                <option value="entretiens">Entretiens</option>
                <option value="linkedin">LinkedIn</option>
                <option value="marche">Marché</option>
                <option value="formation">Formation</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
              <input type="file" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">Annuler</button>
              <button type="submit" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">Ajouter</button>
            </div>
          </form>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Gérer la fermeture du modal
      const closeButton = modal.querySelector('button');
      const cancelButton = modal.querySelector('button[type="button"]');
      const form = modal.querySelector('form');
      
      closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Ressource ajoutée avec succès !');
        document.body.removeChild(modal);
      });
      
      // Fermer le modal si on clique en dehors
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          document.body.removeChild(modal);
        }
      });
    });
  }
});
