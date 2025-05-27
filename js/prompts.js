document.addEventListener('DOMContentLoaded', function() {
  // Référencer les boutons d'utilisation des prompts
  const useButtons = document.querySelectorAll('.bg-blue-500.hover\\:bg-blue-600');
  
  // Référencer les boutons de modification des prompts
  const editButtons = document.querySelectorAll('.bg-gray-200.hover\\:bg-gray-300');
  
  // Référencer le bouton d'ajout de prompt
  const addPromptButton = document.querySelector('.bg-green-500.hover\\:bg-green-600');
  
  // Fonction pour utiliser un prompt
  useButtons.forEach(button => {
    button.addEventListener('click', function() {
      const promptCard = this.closest('div[class^="bg-white p-5"]');
      const promptTitle = promptCard.querySelector('.text-xl.font-bold').textContent;
      
      // Rediriger vers la page de test avec le prompt sélectionné
      window.location.href = `prompt-test.html?prompt=${encodeURIComponent(promptTitle.split('.')[0].trim())}`;
    });
  });
  
  // Fonction pour modifier un prompt
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const promptCard = this.closest('div[class^="bg-white p-5"]');
      const promptTitle = promptCard.querySelector('.text-xl.font-bold').textContent;
      const promptContent = promptCard.querySelector('.text-xs.text-gray-500.mb-4.italic').textContent;
      
      // Afficher un modal ou rediriger vers une page d'édition (simulation)
      alert(`Modifier le prompt : ${promptTitle}\n\nContenu actuel :\n${promptContent}`);
    });
  });
  
  // Fonction pour ajouter un nouveau prompt
  if (addPromptButton) {
    addPromptButton.addEventListener('click', function() {
      // Implémenter l'ajout de prompt (simulation)
      alert('Fonctionnalité d\'ajout de prompt à implémenter');
    });
  }
});
