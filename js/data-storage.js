/**
 * Gestion de la persistance des données avec localStorage
 */
const DataStorage = {
  // Clés pour le localStorage
  KEYS: {
    COACHEDS: 'jobsearch_coacheds',
    PROMPTS: 'jobsearch_prompts',
    RESOURCES: 'jobsearch_resources',
    PROMPT_RESPONSES: 'jobsearch_prompt_responses',
    NOTES: 'jobsearch_notes'
  },
  
  /**
   * Sauvegarder des données dans localStorage
   * @param {string} key - La clé de stockage
   * @param {Array|Object} data - Les données à stocker
   */
  save: function(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      return false;
    }
  },
  
  /**
   * Récupérer des données depuis localStorage
   * @param {string} key - La clé de stockage
   * @param {Array|Object} defaultValue - Valeur par défaut si aucune donnée n'est trouvée
   * @returns {Array|Object} Les données récupérées ou la valeur par défaut
   */
  get: function(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return defaultValue;
    }
  },
  
  /**
   * Mettre à jour un objet spécifique dans une collection
   * @param {string} key - La clé de stockage
   * @param {string} id - L'ID de l'objet à mettre à jour
   * @param {Object} newData - Les nouvelles données
   * @returns {boolean} Succès de l'opération
   */
  update: function(key, id, newData) {
    try {
      const collection = this.get(key);
      const index = collection.findIndex(item => item.id === id);
      
      if (index !== -1) {
        collection[index] = { ...collection[index], ...newData };
        this.save(key, collection);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      return false;
    }
  },
  
  /**
   * Ajouter un nouvel objet à une collection
   * @param {string} key - La clé de stockage
   * @param {Object} data - L'objet à ajouter
   * @returns {Object} L'objet ajouté avec son ID
   */
  add: function(key, data) {
    try {
      const collection = this.get(key);
      const newItem = {
        id: this.generateId(),
        ...data,
        createdAt: new Date().toISOString()
      };
      
      collection.push(newItem);
      this.save(key, collection);
      return newItem;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de données:', error);
      return null;
    }
  },
  
  /**
   * Supprimer un objet d'une collection
   * @param {string} key - La clé de stockage
   * @param {string} id - L'ID de l'objet à supprimer
   * @returns {boolean} Succès de l'opération
   */
  delete: function(key, id) {
    try {
      const collection = this.get(key);
      const newCollection = collection.filter(item => item.id !== id);
      
      if (collection.length !== newCollection.length) {
        this.save(key, newCollection);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
      return false;
    }
  },
  
  /**
   * Générer un ID unique
   * @returns {string} ID unique
   */
  generateId: function() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  },
  
  /**
   * Exporter toutes les données en format JSON
   * @returns {string} Données au format JSON
   */
  exportAllData: function() {
    const data = {
      coacheds: this.get(this.KEYS.COACHEDS),
      prompts: this.get(this.KEYS.PROMPTS),
      resources: this.get(this.KEYS.RESOURCES),
      promptResponses: this.get(this.KEYS.PROMPT_RESPONSES),
      notes: this.get(this.KEYS.NOTES)
    };
    
    return JSON.stringify(data, null, 2);
  },
  
  /**
   * Importer des données depuis un format JSON
   * @param {string} jsonData - Données au format JSON
   * @returns {boolean} Succès de l'opération
   */
  importAllData: function(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.coacheds) this.save(this.KEYS.COACHEDS, data.coacheds);
      if (data.prompts) this.save(this.KEYS.PROMPTS, data.prompts);
      if (data.resources) this.save(this.KEYS.RESOURCES, data.resources);
      if (data.promptResponses) this.save(this.KEYS.PROMPT_RESPONSES, data.promptResponses);
      if (data.notes) this.save(this.KEYS.NOTES, data.notes);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation des données:', error);
      return false;
    }
  }
};

// Fonction pour initialiser des données de test si nécessaire
function initializeTestData() {
  // Vérifier si des données existent déjà
  if (DataStorage.get(DataStorage.KEYS.COACHEDS).length === 0) {
    // Ajouter des coachés de test
    DataStorage.add(DataStorage.KEYS.COACHEDS, {
      name: 'Marie Dupont',
      email: 'marie.dupont@example.com',
      phone: '0123456789',
      status: 'En cours',
      currentStep: 1
    });
    
    DataStorage.add(DataStorage.KEYS.COACHEDS, {
      name: 'Thomas Martin',
      email: 'thomas.martin@example.com',
      phone: '0987654321',
      status: 'En cours',
      currentStep: 3
    });
    
    DataStorage.add(DataStorage.KEYS.COACHEDS, {
      name: 'Sophie Laurent',
      email: 'sophie.laurent@example.com',
      phone: '0654321987',
      status: 'En cours',
      currentStep: 2
    });
  }
}

// Exécuter l'initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  initializeTestData();
});
