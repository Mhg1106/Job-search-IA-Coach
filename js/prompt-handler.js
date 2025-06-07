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
        content: `Tu es un Consultant Expert en Intelligence Économique spécialisé dans l'analyse d'entreprises pour les candidats à l'emploi. Ta mission est de fournir une analyse complète et structurée de l'entreprise [NOM DE L'ENTREPRISE] pour un candidat qui postule au poste de [INTITULÉ DU POSTE].

CV du candidat :
[COLLER LE TEXTE DU CV]

Offre d'emploi :
[COLLER LE TEXTE DE L'OFFRE D'EMPLOI]

Fournis une analyse détaillée de l'entreprise structurée en 7 sections distinctes :

1. FICHE D'IDENTITÉ DE L'ENTREPRISE (10%)
- Données factuelles : date de création, taille, chiffre d'affaires, implantations
- Structure : statut juridique, actionnariat, organisation
- Leadership : principaux dirigeants et leur parcours

2. MODÈLE ÉCONOMIQUE ET POSITIONNEMENT (15%)
- Secteur d'activité précis et spécificités
- Produits/services phares et segments de clientèle
- Sources de revenus et stratégie de croissance

3. PAYSAGE CONCURRENTIEL (15%)
- 3-5 concurrents principaux (directs et indirects)
- Avantages compétitifs de l'entreprise
- Position dans le marché (leader, challenger, etc.)

4. CULTURE D'ENTREPRISE ET VALEURS (15%)
- Valeurs affichées et culture interne
- Politique RSE et engagements
- Environnement de travail et management

5. ACTUALITÉS RÉCENTES (15%)
- 2-3 développements significatifs des 12 derniers mois
- Projets ou orientations stratégiques annoncés
- Innovations ou changements notables

6. ADÉQUATION PROFIL-ENTREPRISE (15%)
- Points de convergence entre le profil du candidat et les besoins/valeurs de l'entreprise
- Compétences du candidat particulièrement pertinentes pour cette organisation
- Éléments du parcours à valoriser spécifiquement

7. CONSEILS STRATÉGIQUES POUR L'ENTRETIEN (15%)
- 3-5 sujets à aborder ou questions à poser qui démontreront ton intérêt et ta connaissance
- Points spécifiques du CV à mettre en avant face à cette entreprise
- Éléments de langage à privilégier en lien avec la culture d'entreprise

Ta réponse doit être factuelle, précise et basée uniquement sur des informations publiques vérifiables. Utilise un ton professionnel et objectif. L'analyse doit permettre au candidat de démontrer une compréhension approfondie de l'entreprise lors de son entretien et d'adapter son discours en conséquence.`
      },
       '5': {
        id: "5",
        title: "Optimisation du CV",
        content: `Tu es un expert en optimisation de CV et en recrutement avec 15 ans d'expérience. Ta mission est d'analyser en profondeur le CV que je vais te partager pour un poste de [TYPE DE POSTE].

Fournis une analyse détaillée et actionnable structurée comme suit:

1. IMPACT VISUEL ET STRUCTURE (20%)
- Évalue la lisibilité, l'organisation et l'équilibre des sections
- Identifie les améliorations possibles de mise en page
- Suggère des optimisations pour la hiérarchisation des informations

2. CONTENU ET FORMULATION (30%)
- Évalue la pertinence des informations par rapport au poste visé
- Analyse l'utilisation des verbes d'action et l'impact des réalisations
- Identifie les informations manquantes ou superflues
- Suggère des formulations plus percutantes pour les réalisations clés

3. COMPATIBILITÉ ATS (25%)
- Évalue si le CV passerait les filtres automatiques
- Identifie les mots-clés manquants ou à renforcer
- Propose des ajustements pour optimiser la détection par les ATS

4. SUGGESTIONS D'AMÉLIORATION (25%)
- Propose 5-7 modifications concrètes et prioritaires
- Justifie chaque suggestion avec son impact potentiel
- Fournit des exemples de reformulations pour les sections clés

Voici le CV à analyser :
[COLLER LE TEXTE DU CV]

Sois précis, direct et constructif. Évite les généralités et concentre-toi sur des améliorations spécifiques et actionnables. Ton objectif est d'aider le candidat à transformer son CV en un outil de marketing personnel efficace qui se démarque et passe les filtres ATS.`
       },
       '6': {
        id: "6",
        title: "Matching CV/emploi",
        content: `Tu es un expert en recrutement spécialisé dans l'évaluation de candidatures. Je te transmets un CV et une offre d'emploi. Ta mission est d'analyser précisément le degré de correspondance entre les deux.

CV du candidat:
[COLLER LE TEXTE DU CV]

Offre d'emploi:
[COLLER LE TEXTE DE L'OFFRE]

Réalise une analyse structurée en 4 parties:

1. TAUX DE CORRESPONDANCE GLOBAL (note sur 100)
- Évalue objectivement l'adéquation globale avec une note précise
- Justifie cette note avec 2-3 facteurs déterminants
- Identifie les points décisifs qui pourraient influencer positivement ou négativement la sélection

2. POINTS FORTS DU PROFIL (30%)
- Identifie les 3-5 éléments du CV qui répondent parfaitement aux exigences
- Explique en quoi ces éléments sont pertinents et convaincants
- Suggère comment les mettre davantage en valeur pour cette candidature spécifique

3. ÉCARTS ET AXES D'AMÉLIORATION (30%)
- Identifie les 3-5 principales exigences de l'offre insuffisamment couvertes
- Suggère comment combler ces écarts (mise en avant d'expériences, reformulation, etc.)
- Propose des alternatives pour compenser les manques éventuels

4. RECOMMANDATIONS DE PERSONNALISATION (40%)
- Propose des modifications concrètes pour maximiser l'impact du CV
- Suggère 3-5 points clés à mettre en avant dans la lettre de motivation
- Identifie les mots-clés essentiels à intégrer pour les filtres ATS
- Recommande une stratégie d'approche adaptée à cette candidature spécifique

Sois précis et actionnable dans tes recommandations. L'objectif est d'aider le candidat à augmenter significativement ses chances d'être sélectionné pour un entretien pour ce poste spécifique.`        
        },
       '7': {
        id: "7",
        title: "Rédaction d'une lettre de motivation",
        content: `Tu es un Expert en Communication Professionnelle spécialisé dans la rédaction de lettres de motivation percutantes. Ta mission est de créer 3 versions distinctes mais également efficaces d'une lettre de motivation pour le poste suivant :

CV du candidat :
[COLLER LE TEXTE DU CV]

Offre d'emploi :
[COLLER LE TEXTE DE L'OFFRE D'EMPLOI]

Informations sur l'entreprise :
[COLLER LE TEXTE DE L'ANALYSE DE L'ENTREPRISE DE L'ÉTAPE 5]

Pour chacune des 3 versions, respecte la structure suivante :

1. ACCROCHE INITIALE (20%)
- Une ouverture originale et personnalisée qui capte l'attention
- Un lien clair avec l'entreprise ou le poste spécifique
- Une formulation qui démontre la compréhension des enjeux du poste

2. CORPS DE LA LETTRE (60%)
- Mise en avant de 2-3 expériences ou compétences directement pertinentes pour le poste
- Exemples concrets et chiffrés illustrant ces compétences
- Connexion explicite entre le parcours du candidat et les besoins de l'entreprise
- Valorisation de la motivation spécifique pour cette entreprise (pas de formules génériques)

3. CONCLUSION ET APPEL À L'ACTION (20%)
- Synthèse de l'adéquation profil/poste
- Proposition concrète (entretien, démonstration de compétences)
- Formule de politesse professionnelle et signature

Différenciation des 3 versions :
- Version 1 : Approche classique et formelle, mettant l'accent sur le parcours et les compétences techniques
- Version 2 : Approche orientée "résolution de problèmes", démontrant la compréhension des défis du poste
- Version 3 : Approche focalisée sur la culture d'entreprise et l'alignement de valeurs

Pour les 3 versions, respecte ces règles :
- Longueur optimale : 350 mots maximum (environ 1 page)
- Ton professionnel mais pas impersonnel
- Contenu spécifique à cette candidature (pas de formules passe-partout)
- Intégration naturelle des mots-clés de l'offre d'emploi
- Présentation soignée et paragraphes courts pour une lecture facile

Assure-toi que chaque version soit unique dans son approche tout en restant authentique et adaptée au profil du candidat.`        
        },
       '8': {
        id: "8",
        title: "Sélection des offres d'emploi à retenir",
        content: `Tu es un Expert en Recrutement et Stratégie de Candidature. Ta mission est d'analyser la compatibilité entre un CV et plusieurs offres d'emploi pour identifier celles qui représentent les meilleures opportunités. Cette analyse aidera à prioriser les candidatures du coaché.

CV du candidat :
[COLLER LE TEXTE DU CV]

Voici les offres d'emploi à évaluer :
[COLLER LES TEXTES DES DIFFÉRENTES OFFRES D'EMPLOI, CLAIREMENT SÉPARÉES ET NUMÉROTÉES]

Pour chaque offre d'emploi, fournis une analyse structurée en 4 sections :

1. TAUX DE CORRESPONDANCE GLOBAL (note sur 100)
- Score précis d'adéquation entre le CV et l'offre
- 3 principaux facteurs qui déterminent ce score
- Recommandation claire : Priorité Haute (80-100), Moyenne (60-79), ou Basse (<60)

2. POINTS FORTS DE LA CANDIDATURE
- 3-5 éléments du CV qui correspondent parfaitement aux exigences
- 1-2 avantages compétitifs du candidat pour ce poste spécifique

3. ÉCARTS À COMBLER
- 2-3 compétences ou expériences requises mais absentes ou insuffisamment démontrées
- Suggestions concrètes pour compenser ou expliquer ces écarts

4. RECOMMANDATIONS STRATÉGIQUES
- 2-3 modifications spécifiques à apporter au CV pour cette candidature
- Points à mettre en avant lors d'un entretien éventuel

Une fois toutes les offres analysées individuellement, fournis en conclusion :

CLASSEMENT DES OFFRES PAR PERTINENCE
- Liste des offres par ordre décroissant de taux de correspondance
- Pour chaque offre : numéro, intitulé du poste, score, et commentaire synthétique (1 ligne)
- Recommandation sur les 3 offres à prioriser avec justification en 1-2 phrases par offre

Ton analyse doit être objective, précise et actionnable. Les recommandations doivent aider le candidat à concentrer ses efforts sur les opportunités les plus prometteuses et à adapter sa stratégie de candidature en fonction de chaque offre.`        
        },
       '9': {
        id: "9",
        title: "Coach expert en préparation d'entretien",
        content: `Tu es un Coach Expert en Préparation aux Entretiens d'Embauche avec une expérience de 15 ans dans le recrutement. Ta mission est de préparer un candidat à un entretien pour le poste suivant :

CV du candidat :
[COLLER LE TEXTE DU CV]

Offre d'emploi :
[COLLER LE TEXTE DE L'OFFRE D'EMPLOI]

Informations sur l'entreprise :
[COLLER LE TEXTE DE L'ANALYSE DE L'ENTREPRISE DE L'ÉTAPE 5]

Élabore un guide de préparation à l'entretien structuré en 5 parties :

1. QUESTIONS ANTICIPÉES (30%)
Prépare exactement 15 questions que le recruteur pourrait poser, répar­ties en 4 catégories :
- Questions sur le parcours et les expériences (4 questions)
- Questions techniques liées au poste (4 questions)
- Questions comportementales/situationnelles (4 questions)
- Questions sur la motivation et le projet professionnel (3 questions)

Pour chaque question :
- Fournis une explication de l'intention du recruteur
- Propose une structure de réponse (points clés à aborder)
- Identifie les pièges éventuels à éviter

2. POINTS FORTS À VALORISER (20%)
- Identifie 3-5 éléments spécifiques du profil à mettre en avant proactivement
- Suggère des formulations précises et des exemples concrets pour illustrer chaque point
- Explique pourquoi ces éléments sont particulièrement pertinents pour ce poste/entreprise

3. SUJETS DÉLICATS À PRÉPARER (15%)
- Identifie 2-3 points potentiellement problématiques du parcours (trous, changements fréquents, etc.)
- Propose des explications constructives et honnêtes pour ces éléments
- Suggère comment rebondir positivement sur ces sujets

4. QUESTIONS À POSER AU RECRUTEUR (15%)
- Propose 5-7 questions pertinentes que le candidat pourrait poser
- Explique pourquoi chaque question est stratégique
- Indique le moment opportun pour poser chacune d'elles

5. PRÉPARATION LOGISTIQUE ET MENTALE (20%)
- Conseils sur la présentation physique/vestimentaire adaptée à l'entreprise
- Recommandations pour la gestion du stress et la communication non-verbale
- Check-list des éléments à préparer avant l'entretien
- Conseils pour les 24h précédant l'entretien

Ton guide doit être spécifique au profil du candidat et au poste visé, pas un ensemble de conseils génériques. Adopte un ton à la fois professionnel et encourageant. L'objectif est de permettre au candidat d'entrer dans l'entretien avec confiance, préparation et authenticité.`        
        },
       '10': {
        id: "10",
        title: "Bilan du coaching",
        content: `Tu es un Expert en Évaluation et Bilan de Coaching Professionnel. Ta mission est d'aider un coach à réaliser un bilan structuré et approfondi de l'accompagnement d'un coaché en recherche d'emploi.

Pour réaliser ce bilan, tu vas procéder en deux phases :

PHASE 1 : QUESTIONNAIRE DE BILAN
Génère 10 questions précises et ouvertes pour évaluer l'impact et l'efficacité du coaching. Ces questions doivent couvrir :
- L'atteinte des objectifs initiaux (2 questions)
- Les apprentissages et prises de conscience (2 questions)
- L'efficacité des outils et méthodes utilisés (2 questions)
- Les améliorations concrètes dans la démarche de recherche d'emploi (2 questions)
- Les axes d'amélioration possibles pour le coaching (2 questions)

PHASE 2 : ANALYSE DES RÉPONSES ET SYNTHÈSE
Une fois que le coach aura soumis les réponses du coaché à ces questions, tu devras produire une synthèse structurée en 5 parties :

1. SITUATION DE DÉPART ET ÉVOLUTION (20%)
- Rappel du diagnostic initial et des objectifs fixés
- Analyse des changements observés et du chemin parcouru
- Évaluation du degré d'atteinte des objectifs initiaux

2. ACQUIS ET PROGRESSIONS (25%)
- Compétences développées ou renforcées pendant l'accompagnement
- Outils appropriés et intégrés dans la pratique
- Évolutions dans la posture et la confiance

3. POINTS FORTS DE L'ACCOMPAGNEMENT (20%)
- Méthodologies et approches ayant eu le plus d'impact positif
- Moments clés ou déclencheurs pendant le parcours
- Valeur ajoutée spécifique apportée par l'IA dans le processus

4. AXES D'AMÉLIORATION (20%)
- Points sur lesquels l'accompagnement aurait pu être plus efficace
- Besoins non couverts ou insuffisamment traités
- Suggestions constructives pour optimiser la démarche

5. PERSPECTIVES ET RECOMMANDATIONS (15%)
- Prochaines étapes recommandées pour le coaché
- Ressources complémentaires à explorer
- Conseils pour maintenir la dynamique positive

Ta synthèse doit être à la fois analytique et constructive, en identifiant concrètement ce qui a fonctionné et ce qui pourrait être amélioré. Elle doit aider le coach à affiner sa méthodologie et fournir au coaché une vision claire de son parcours et de ses prochains défis. Utilise un ton professionnel mais chaleureux, et des formulations précises et nuancées.`        
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
