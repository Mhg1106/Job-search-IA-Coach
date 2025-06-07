// prompt-handler.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('Prompt handler loaded');
  
  // Attendre un petit délai pour s'assurer que tous les éléments sont chargés
  setTimeout(function() {
    initializePromptHandlers();
  }, 100);
});

function initializePromptHandlers() {
  console.log('Initializing prompt handlers');
  
  // Récupérer le modal
  const responseModal = document.getElementById('responseModal');
  
  if (!responseModal) {
    console.error('Modal not found');
    return;
  }
  
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
  const chatGptButtons = document.querySelectorAll('.open-in-chatgpt-btn');
  console.log('Found ChatGPT buttons:', chatGptButtons.length);
  
  chatGptButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('ChatGPT button clicked');
      
      const promptId = this.getAttribute('data-prompt-id');
      console.log('Prompt ID:', promptId);
      
      const prompt = getPromptById(promptId);
      if (prompt) {
        console.log('Prompt found:', prompt.title);
        
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
            // Fallback pour les navigateurs qui ne supportent pas clipboard API
            fallbackCopyTextToClipboard(prompt.content);
          });
      } else {
        console.error('Prompt not found for ID:', promptId);
        alert('Erreur : prompt non trouvé');
      }
    });
  });
  
  // Gestion du bouton "Enregistrer la réponse"
  const saveResponseButtons = document.querySelectorAll('.save-response-btn');
  console.log('Found save response buttons:', saveResponseButtons.length);
  
  saveResponseButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Save response button clicked');
      
      const promptId = this.getAttribute('data-prompt-id');
      const prompt = getPromptById(promptId);
      
      if (prompt) {
        // Remplir les champs du modal
        document.getElementById('promptTitle').value = prompt.title;
        
        // Remplir le sélecteur de coachés
        const coachedSelect = document.getElementById('coachedSelect');
        coachedSelect.innerHTML = '<option value="">Sélectionnez un coaché</option>';
        
        const coacheds = getCoacheds();
        coacheds.forEach(coached => {
          const option = document.createElement('option');
          option.value = coached.id;
          option.textContent = coached.name;
          coachedSelect.appendChild(option);
        });
        
        // Vider le champ de réponse
        document.getElementById('responseContent').value = '';
        
        // Afficher le modal
        openModal();
        
        // Stocker l'ID du prompt actuel
        document.getElementById('saveResponseBtn').setAttribute('data-prompt-id', promptId);
      }
    });
  });
  
  // Gestion du bouton "Enregistrer" dans le modal
  const saveBtn = document.getElementById('saveResponseBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const promptId = this.getAttribute('data-prompt-id');
      const responseContent = document.getElementById('responseContent').value;
      const coachedId = document.getElementById('coachedSelect').value;
      
      if (responseContent.trim() === '') {
        alert('Veuillez saisir une réponse avant d\'enregistrer.');
        return;
      }
      
      if (!coachedId) {
        alert('Veuillez sélectionner un coaché.');
        return;
      }
      
      // Enregistrer la réponse
      savePromptResponse(promptId, coachedId, responseContent);
      
      // Fermer le modal
      closeModal();
      
      alert('Réponse enregistrée avec succès !');
    });
  }
}

// Fonction fallback pour copier du texte dans le presse-papiers
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Éviter le scroll sur iOS
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert('Le prompt a été copié dans votre presse-papiers. Collez-le dans ChatGPT pour continuer.');
    } else {
      alert('Impossible de copier automatiquement. Veuillez copier manuellement le prompt.');
    }
  } catch (err) {
    console.error('Fallback: Impossible de copier', err);
    alert('Impossible de copier automatiquement. Veuillez copier manuellement le prompt.');
  }
  
  document.body.removeChild(textArea);
}

// Fonction pour récupérer le contenu complet des prompts
function getPromptById(id) {
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
    '4': {
      id: "4",
      title: "Analyse CV",
      content: `Analyse le CV de [Nom du coaché] qui postule pour un poste de [type de poste]. Identifie les forces et faiblesses du CV et propose des améliorations concrètes pour augmenter ses chances de succès.

Effectue une analyse complète selon les critères suivants :

1. Structure et présentation :
   - Lisibilité et mise en forme
   - Organisation des informations
   - Longueur et équilibre des sections
   - Design et impact visuel

2. Contenu et pertinence :
   - Adéquation avec le poste ciblé
   - Valorisation des expériences
   - Mise en avant des compétences clés
   - Cohérence du parcours

3. Optimisation ATS (Applicant Tracking System) :
   - Mots-clés du secteur
   - Formatage compatible
   - Structure lisible par les robots

4. Points forts à maintenir :
   - Éléments différenciants
   - Expériences valorisantes
   - Compétences recherchées

5. Axes d'amélioration prioritaires :
   - Sections à renforcer
   - Informations manquantes
   - Reformulations suggérées

6. Recommandations concrètes :
   - Modifications spécifiques à apporter
   - Nouvelles sections à ajouter
   - Éléments à supprimer ou raccourcir

Fournis une note globale sur 10 et un plan d'action pour optimiser ce CV dans les 48h.`
    },
    '5': {
      id: "5",
      title: "Recherche Entreprise",
      content: `Réalise une synthèse complète sur l'entreprise [Nom de l'entreprise] pour mon coaché qui souhaite y postuler. Cette recherche doit lui permettre de personnaliser sa candidature et de se préparer efficacement aux entretiens.

Fournissez une analyse détaillée couvrant :

1. Présentation générale :
   - Secteur d'activité et positionnement
   - Taille et implantations
   - Histoire et évolution récente
   - Chiffres clés (CA, effectifs, croissance)

2. Business model et stratégie :
   - Modèle économique
   - Marchés et clients cibles
   - Avantages concurrentiels
   - Projets de développement

3. Culture d'entreprise :
   - Valeurs et mission
   - Style de management
   - Ambiance et environnement de travail
   - Politique RH et avantages sociaux

4. Actualités et enjeux :
   - Actualités récentes (6 derniers mois)
   - Défis et opportunités
   - Projets en cours
   - Évolutions du marché

5. Opportunités pour le candidat :
   - Pourquoi cette entreprise recrute
   - Profils recherchés
   - Évolutions possibles
   - Compétences valorisées

6. Conseils pour la candidature :
   - Arguments à mettre en avant
   - Motivations à exprimer
   - Questions pertinentes à poser
   - Pièges à éviter

Termine par 3 raisons concrètes pour lesquelles [Nom du coaché] devrait rejoindre cette entreprise.`
    },
    '6': {
      id: "6",
      title: "Matching CV / Offre",
      content: `Analyse le degré de matching entre le CV de [Nom du coaché] et l'offre d'emploi pour le poste de [intitulé du poste] chez [nom de l'entreprise].

Voici l'offre d'emploi :
[Coller ici le texte complet de l'offre]

Voici le CV du candidat :
[Coller ici le CV ou les éléments clés du CV]

Effectue une analyse comparative détaillée :

1. Score de compatibilité global (sur 100) avec justification

2. Analyse des compétences :
   - Compétences requises vs compétences du candidat
   - Niveau de maîtrise pour chaque compétence
   - Compétences manquantes critiques
   - Compétences supplémentaires valorisantes

3. Expérience professionnelle :
   - Adéquation des expériences passées
   - Niveau de séniorité requis vs acquis
   - Secteurs d'activité en phase
   - Responsabilités similaires

4. Formation et certifications :
   - Niveau d'études requis vs acquis
   - Formations complémentaires nécessaires
   - Certifications manquantes ou à valoriser

5. Soft skills et savoir-être :
   - Qualités humaines recherchées
   - Fit culturel avec l'entreprise
   - Style de management adapté

6. Points forts du candidat pour ce poste :
   - Éléments différenciants
   - Expériences transférables
   - Atouts concurrentiels

7. Points d'amélioration :
   - Lacunes à combler
   - Formations à envisager
   - Expériences à acquérir

8. Recommandations pour optimiser la candidature :
   - Adaptations du CV
   - Arguments à développer en lettre de motivation
   - Préparation spécifique pour l'entretien

Conclus par un avis motivé : candidature à encourager ou non, et stratégie recommandée.`
    },
    '7': {
      id: "7",
      title: "Lettre de Motivation",
      content: `Rédige une lettre de motivation percutante pour [Nom du coaché] qui postule au poste de [intitulé du poste] chez [nom de l'entreprise].

Informations sur le candidat :
- Profil : [résumé du profil professionnel]
- Expériences clés : [principales expériences]
- Motivations : [pourquoi ce poste/cette entreprise]
- Compétences principales : [compétences à valoriser]

Informations sur le poste :
[Description du poste et exigences]

Informations sur l'entreprise :
[Contexte, valeurs, actualités de l'entreprise]

Structure attendue :

1. En-tête professionnel avec coordonnées

2. Objet clair et accrocheur

3. Paragraphe d'accroche (pourquoi ce poste vous intéresse)

4. Paragraphe "ce que j'apporte" :
   - Expériences pertinentes
   - Compétences clés en lien avec le poste
   - Réalisations concrètes et chiffrées

5. Paragraphe "pourquoi cette entreprise" :
   - Connaissance de l'entreprise
   - Adéquation avec ses valeurs
   - Vision commune des enjeux

6. Paragraphe de conclusion :
   - Motivation pour un entretien
   - Disponibilité
   - Formule de politesse

Critères de qualité :
- Personnalisée et non générique
- Concise (1 page maximum)
- Dynamique et positive
- Sans fautes d'orthographe
- Complémentaire au CV (ne pas répéter)
- Axée sur la valeur ajoutée pour l'entreprise

Génère 2 versions : une version classique et une version plus créative/moderne.`
    },
    '8': {
      id: "8",
      title: "Ciblage Offres",
      content: `Évalue le matching entre le profil de [Nom du coaché] et ces offres d'emploi. Classe-les par pertinence et suggère des adaptations.

Profil du candidat :
- Formation : [formation]
- Expérience : [expériences clés]
- Compétences : [compétences principales]
- Secteurs de prédilection : [secteurs]
- Contraintes : [zone géographique, salaire, etc.]

Offres à analyser :

OFFRE 1 :
[Titre du poste]
[Entreprise]
[Description et exigences]

OFFRE 2 :
[Titre du poste]
[Entreprise]
[Description et exigences]

OFFRE 3 :
[Titre du poste]
[Entreprise]
[Description et exigences]

Pour chaque offre, fournis :

1. Score de pertinence (sur 10) avec justification

2. Points de convergence :
   - Compétences en adéquation
   - Expériences transférables
   - Fit culturel potentiel

3. Points de divergence :
   - Compétences manquantes
   - Expérience insuffisante
   - Autres écarts

4. Niveau de priorité :
   - Priorité 1 : candidature immédiate
   - Priorité 2 : candidature après préparation
   - Priorité 3 : candidature à long terme

5. Adaptations nécessaires :
   - Modifications du CV
   - Angle de la lettre de motivation
   - Préparation spécifique

Conclus par :
- Classement final des offres par ordre de priorité
- Stratégie globale de candidature
- Planning de candidatures sur 2 semaines
- Formations/préparations recommandées pour améliorer le profil`
    },
    '9': {
      id: "9",
      title: "Préparation Entretien",
      content: `Génère une série de questions d'entretien pour [Nom du coaché] qui postule au poste de [intitulé du poste] chez [nom de l'entreprise].

Informations sur le candidat :
- Profil : [résumé du profil]
- Expériences clés : [expériences principales]
- Points forts : [atouts]
- Points de vigilance : [faiblesses potentielles]

Informations sur le poste :
- Missions principales : [missions]
- Compétences requises : [compétences]
- Enjeux du poste : [contexte et défis]

Prépare les questions suivantes :

1. QUESTIONS CLASSIQUES (10 questions) :
   - Présentez-vous en quelques minutes
   - Pourquoi ce poste vous intéresse-t-il ?
   - Pourquoi notre entreprise ?
   - Quelles sont vos principales qualités ?
   - Quel est votre principal défaut ?
   - Décrivez une réalisation dont vous êtes fier
   - Comment gérez-vous le stress ?
   - Où vous voyez-vous dans 5 ans ?
   - Avez-vous des questions sur le poste/l'équipe ?
   - Quelles sont vos prétentions salariales ?

2. QUESTIONS TECHNIQUES (5 questions spécifiques au poste)

3. QUESTIONS COMPORTEMENTALES (5 questions STAR) :
   - Situation où vous avez dû gérer un conflit
   - Moment où vous avez pris une initiative
   - Échec professionnel et lessons apprises
   - Travail en équipe difficile
   - Adaptation à un changement

4. QUESTIONS À POSER AU RECRUTEUR :
   - 5 questions pertinentes sur le poste
   - 3 questions sur l'équipe/l'entreprise
   - 2 questions sur les perspectives d'évolution

Pour chaque question, fournis :
- La réponse recommandée (structure STAR si applicable)
- Les points clés à mentionner
- Les pièges à éviter
- Des exemples concrets du parcours du candidat

Ajoute des conseils pratiques pour l'entretien et la posture à adopter.`
    },
    '10': {
      id: "10",
      title: "Bilan du Coaching",
      content: `Réalise un bilan complet du coaching réalisé avec [Nom du coaché]. Analyse la progression, les points forts, les axes d'amélioration et propose des recommandations pour la suite.

Informations sur le parcours de coaching :
- Durée : [X semaines/mois]
- Objectif initial : [objectif fixé au départ]
- Étapes réalisées : [liste des étapes du coaching]
- Difficultés rencontrées : [obstacles principaux]
- Résultats obtenus : [candidatures, entretiens, offres]

Effectue une analyse détaillée :

1. BILAN QUANTITATIF :
   - Nombre de candidatures envoyées
   - Taux de réponses positives
   - Nombre d'entretiens obtenus
   - Évolution du taux de conversion
   - Résultats par canal de recherche

2. BILAN QUALITATIF :
   - Évolution de la confiance en soi
   - Amélioration des outils (CV, lettre, profil LinkedIn)
   - Développement des compétences d'entretien
   - Clarification du projet professionnel
   - Élargissement du réseau

3. POINTS FORTS DU PARCOURS :
   - Réussites marquantes
   - Progrès les plus significatifs
   - Compétences développées
   - Moments de déclic

4. AXES D'AMÉLIORATION :
   - Objectifs non atteints
   - Compétences à renforcer
   - Freins persistants
   - Points de vigilance

5. ENSEIGNEMENTS ET APPRENTISSAGES :
   - Stratégies qui ont fonctionné
   - Approches à ajuster
   - Découvertes sur le marché
   - Prise de conscience personnelle

6. RECOMMANDATIONS POUR LA SUITE :
   - Actions prioritaires pour les 3 prochains mois
   - Formations complémentaires suggérées
   - Réseau à développer
   - Veille à maintenir

7. PLAN D'AUTONOMIE :
   - Outils pour continuer seul
   - Rythme de recherche recommandé
   - Points de vigilance
   - Moments de réajustement

Conclus par une note d'encouragement et une vision positive pour la suite de sa recherche.`
    }
  };
  
  return prompts[id] || null;
}

function getCoacheds() {
  // Utiliser le système de stockage local s'il est disponible
  if (typeof DataStorage !== 'undefined') {
    return DataStorage.get(DataStorage.KEYS.COACHEDS, []);
  }
  
  // Sinon, utiliser des données par défaut
  return [
    { id: "1", name: "Marie Dupont" },
    { id: "2", name: "Thomas Martin" },
    { id: "3", name: "Sophie Laurent" }
  ];
}

function savePromptResponse(promptId, coachedId, content) {
  console.log("Sauvegarde de la réponse:", { promptId, coachedId, content, date: new Date() });
  
  // Utiliser le système de stockage local s'il est disponible
  if (typeof DataStorage !== 'undefined') {
    const responses = DataStorage.get(DataStorage.KEYS.PROMPT_RESPONSES, []);
    
    const response = {
      id: DataStorage.generateId(),
      promptId: promptId,
      coachedId: coachedId,
      content: content,
      date: new Date().toISOString()
    };
    
    responses.push(response);
    DataStorage.save(DataStorage.KEYS.PROMPT_RESPONSES, responses);
  } else {
    // Fallback vers localStorage simple
    const responses = JSON.parse(localStorage.getItem('promptResponses') || '[]');
    
    const response = {
      id: 'id_' + Math.random().toString(36).substr(2, 9),
      promptId: promptId,
      coachedId: coachedId,
      content: content,
      date: new Date().toISOString()
    };
    
    responses.push(response);
    localStorage.setItem('promptResponses', JSON.stringify(responses));
  }
}
