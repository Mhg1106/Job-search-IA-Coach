// prompt-handler.js
document.addEventListener('DOMContentLoaded', function() {
  // Supprimer d'abord tous les événements existants pour éviter les doublons
  document.querySelectorAll('.open-in-chatgpt-btn').forEach(button => {
    button.replaceWith(button.cloneNode(true));
  });
  
  document.querySelectorAll('.save-response-btn').forEach(button => {
    button.replaceWith(button.cloneNode(true));
  });
  
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
  
  // Fonction pour récupérer le contenu complet des prompts
  function getPromptById(id) {
    // Définir les contenus complets de chaque prompt
    const prompts = {
      '1': {
        id: "1",
        title: "Diagnostic de Départ",
        content: `Je suis un coach spécialisé en emploi et carrière. Je réalise un diagnostic initial pour [Nom du coaché], qui recherche un poste de [type de poste].

Sur la base des réponses au questionnaire suivant, je souhaite que tu établisses une synthèse structurée de sa situation, identifiant ses forces, axes d'amélioration, et les points prioritaires à travailler.

Voici les réponses au questionnaire diagnostic :
1. Formation et parcours académique : [réponse]
2. Expérience professionnelle (principaux postes et durées) : [réponse]
3. Compétences techniques principales : [réponse]
4. Compétences comportementales (soft skills) : [réponse]
5. Domaines/secteurs d'activité ciblés : [réponse]
6. Types de postes recherchés : [réponse]
7. Zone géographique souhaitée : [réponse]
8. Prétentions salariales : [réponse]
9. Critères prioritaires dans la recherche (ambiance, valeurs, télétravail, etc.) : [réponse]
10. Canaux de recherche déjà utilisés : [réponse]
11. Résultats actuels (nombre de candidatures, entretiens) : [réponse]
12. Difficultés principales rencontrées : [réponse]
13. Auto-évaluation de ses outils de recherche (CV, lettre, profil LinkedIn) sur 10 : [réponse]
14. Objectif principal du coaching : [réponse]
15. Temps hebdomadaire pouvant être consacré à sa recherche : [réponse]

Ta synthèse doit inclure :
1. Un résumé du profil et de la situation actuelle
2. Une analyse des forces et atouts
3. Les axes d'amélioration prioritaires
4. Une évaluation de la cohérence du projet professionnel
5. Des recommandations pour les prochaines étapes du coaching, en priorisant les actions
6. Un plan d'action initial recommandé

Présente ta réponse de manière professionnelle et encourageante, sans jugement, en adoptant une approche coach qui associe bienveillance et lucidité.`
      },
      '2': {
        id: "2",
        title: "Analyse du Marché",
        content: `En tant que coach en recherche d'emploi, j'ai besoin d'une analyse complète du marché pour le secteur [secteur] dans lequel mon coaché recherche un poste de [type de poste]. Je souhaite obtenir une synthèse actuelle et pertinente pour l'aider à comprendre l'environnement professionnel et optimiser sa recherche.

Fournissez une analyse détaillée incluant :

1. État actuel du marché de l'emploi dans ce secteur :
   - Tendances générales (croissance, stabilité, déclin)
   - Impact des évolutions économiques et technologiques récentes
   - Prévisions pour les 1-2 prochaines années

2. Compétences recherchées :
   - Compétences techniques essentielles pour le poste ciblé
   - Soft skills particulièrement valorisées
   - Certifications ou formations appréciées
   - Compétences émergentes à développer

3. Entreprises à cibler :
   - Principaux employeurs dans ce secteur
   - Entreprises en développement ou recrutement actif
   - Startups prometteuses ou PME pertinentes
   - Particularités des entreprises françaises dans ce domaine

4. Processus de recrutement typiques :
   - Canaux de recrutement privilégiés (sites spécialisés, plateformes, réseaux)
   - Étapes courantes du processus de sélection
   - Spécificités des entretiens dans ce secteur

5. Rémunération :
   - Fourchettes salariales pour ce type de poste
   - Avantages complémentaires généralement proposés
   - Facteurs influençant la négociation salariale

6. Conseils stratégiques :
   - Recommandations pour se démarquer des autres candidats
   - Approches de networking efficaces spécifiques au secteur
   - Préparation spécifique pour les entretiens

Basez votre analyse sur le marché français actuel, tout en mentionnant les particularités régionales si pertinent. Présentez les informations de manière structurée et actionnable pour un candidat.`
      },
      '3': {
        id: "3",
        title: "Plan d'action détaillé",
        content: `Sur la base du diagnostic réalisé pour [Nom du coaché] qui recherche un poste de [type de poste], élabore un plan d'action concret et détaillé sur 8 semaines pour structurer sa recherche d'emploi et maximiser ses chances de succès.

Ce plan d'action doit :
1. S'appuyer sur ses forces identifiées : [forces principales]
2. Adresser ses axes d'amélioration prioritaires : [axes d'amélioration]
3. Tenir compte de sa disponibilité de [X] heures par semaine
4. Être organisé semaine par semaine avec des objectifs clairs et mesurables
5. Inclure des actions concrètes et un calendrier réaliste

Pour chaque semaine, précise :
- Les objectifs spécifiques de la semaine
- Les tâches prioritaires à accomplir (3-5 maximum)
- Les outils ou ressources à mobiliser
- Les livrables attendus
- Un système simple de suivi de la progression

Le plan doit couvrir les dimensions essentielles d'une recherche efficace :
- Optimisation des outils de candidature (CV, lettre de motivation, profil LinkedIn)
- Stratégie de ciblage des entreprises et des offres
- Techniques de candidatures spontanées
- Activation et développement du réseau professionnel
- Préparation aux entretiens
- Suivi des candidatures et relances
- Stratégie de veille sur le marché

Présente ce plan sous forme de calendrier structuré, avec des objectifs et tâches clairement définis pour chaque semaine. Utilise un ton motivant et directif. Veille à ce que le plan soit à la fois ambitieux et réaliste, adapté au profil et à la situation du coaché.`
      },
      // Ajoutez vos autres prompts ici
      '4': {
        id: "4",
        title: "Connaissance détaillée de l'entreprise cible",
        content: `Analyse le CV de [Nom du coaché] qui postule pour un poste de [type de poste]. Identifie les forces et faiblesses du CV et propose des améliorations concrètes pour augmenter ses chances de succès.`
      },
      
    };
    
    // Renvoyer le prompt demandé
    return prompts[id] || null;
  }
  
  function getCoacheds() {
    // Version simplifiée pour l'exemple
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
