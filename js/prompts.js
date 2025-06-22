// js/prompts.js - VERSION FINALE, COMPLÈTE ET VÉRIFIÉE

document.addEventListener('DOMContentLoaded', function() {

    // --- ÉLÉMENTS DU DOM ---
    const promptContainer = document.getElementById('prompt-container');
    const promptModal = document.getElementById('promptModal');
    const modalTitle = document.getElementById('promptModalTitle');
    const titleInput = document.getElementById('promptTitleEdit');
    const contentTextarea = document.getElementById('promptContentEdit');
    const form = document.getElementById('prompt-form');

    // Vérification de sécurité
    if (!promptContainer || !promptModal || !form) {
        console.error("Erreur critique : Éléments HTML de base manquants.");
        return; 
    }

    // --- DONNÉES PAR DÉFAUT ---
    // C'est la "matrice" de départ de vos prompts.
    // Elle est utilisée UNE SEULE FOIS, au premier lancement.
    const defaultPrompts = [
        { id: '1', title: '1. Diagnostic de Départ', content: `Tu es un Spécialiste en Diagnostic d'Employabilité et Orientation. Ta mission est d'aider un coach professionnel à structurer la première séance avec un coaché en:

1. Générant une série de EXACTEMENT 10 questions ciblées pour établir un diagnostic initial.

2. Produisant une synthèse analytique basée sur les réponses du coaché pour délimiter la demande de coaching.

Les questions doivent explorer:
a. La situation professionnelle et personnelle actuelle
b. Les aspirations et motivations
c. Les compétences perçues et valeurs clés
d. Les contraintes et appréhensions
e. La compréhension du marché et démarches entreprises

La synthèse finale, de 400-600 mots, sera organisée en 5 sections:
1. Résumé de la Situation et Demande Initiale
2. Identification du Projet Professionnel
3. Analyse des Forces et Motivations
4. Points de Vigilance et Besoins Identifiés
5. Axes de Travail Prioritaires` },
        { id: '2', title: '2. Analyse du Marché', content: `Tu es un Analyste Expert du Marché de l'Emploi avec une connaissance approfondie des tendances actuelles et futures. Ta mission est de produire une analyse détaillée du marché pour le poste de [TYPE DE POSTE] dans la région [ZONE GÉOGRAPHIQUE].

Utilise les connaissances les plus récentes (jusqu'à 2025) pour fournir une analyse structurée selon les 5 sections suivantes :

1. APERÇU GÉNÉRAL DU MARCHÉ (20%)
- Volume approximatif d'offres pour ce type de poste dans la région spécifiée
- Évolution de la demande sur les 12-24 derniers mois (en hausse, stable, en baisse)
- Prévisions pour les 12-24 prochains mois

2. COMPÉTENCES CLÉS RECHERCHÉES (25%)
- Top 5-7 des compétences techniques les plus demandées pour ce poste
- Top 3-5 des compétences transversales (soft skills) valorisées
- Certifications ou formations spécifiques constituant un avantage concurrentiel

3. PROFIL DES RECRUTEURS (20%)
- Types d'entreprises qui recrutent majoritairement (taille, secteurs)
- Canaux de recrutement privilégiés pour ce type de poste
- Processus de recrutement typiques (étapes, durée moyenne)

4. RÉMUNÉRATION ET CONDITIONS (15%)
- Fourchette de salaire moyenne pour ce poste dans cette région
- Avantages couramment proposés
- Types de contrats les plus fréquents

5. CONSEILS STRATÉGIQUES (20%)
- 3-5 recommandations concrètes pour se démarquer sur ce marché
- Éléments différenciateurs à mettre en avant dans les candidatures
- Suggestions de niches ou spécialisations porteuses dans ce domaine

Ton analyse doit être à la fois factuelle, précise et actionnelle. Utilise des données chiffrées quand c'est possible et indique clairement lorsqu'il s'agit de tendances générales ou d'estimations. L'objectif est de fournir au candidat une vision claire des opportunités et des exigences du marché pour orienter efficacement sa recherche d'emploi.` },
        { id: '3', title: '3. Plan d\'action détaillé', content: `Tu es un Coach Stratégique en Recherche d'Emploi avec 15 ans d'expérience. Ta mission est de créer un plan d'action personnalisé, concret et structuré pour un candidat dont le profil est le suivant :

[RÉSUMÉ DU DIAGNOSTIC DE L'ÉTAPE 1]

Le candidat recherche un poste de [TYPE DE POSTE] dans [ZONE GÉOGRAPHIQUE].

Voici les tendances actuelles du marché pour ce poste :
[RÉSUMÉ DE L'ANALYSE DE MARCHÉ DE L'ÉTAPE 2]

Élabore un plan d'actions détaillé sur 30 jours (4 semaines) structuré selon les 5 axes suivants :

1. PRÉPARATION DES OUTILS DE CANDIDATURE (Semaine 1)
- Actions concrètes pour optimiser le CV et créer/adapter des modèles de lettres
- Préparation du profil LinkedIn et autres plateformes professionnelles
- Création d'un système de suivi des candidatures

2. STRATÉGIE DE RECHERCHE ACTIVE (Semaines 1-4)
- Sources d'offres à consulter (générales et spécialisées)
- Objectifs hebdomadaires chiffrés (nombre de candidatures, etc.)
- Organisation quotidienne/hebdomadaire recommandée

3. DÉVELOPPEMENT DU RÉSEAU (Semaines 2-4)
- Actions de networking ciblées (personnes à contacter, événements à privilégier)
- Approche pour les candidatures spontanées
- Stratégie de visibilité professionnelle en ligne

4. RENFORCEMENT DES COMPÉTENCES (Semaines 2-4)
- Formation(s) courte(s) ou certification(s) à envisager
- Ressources gratuites à consulter
- Compétences spécifiques à développer/démontrer

5. PRÉPARATION AUX ENTRETIENS (Semaines 3-4)
- Recherches préalables sur les entreprises ciblées
- Questions typiques à anticiper et éléments de réponse
- Simulations et exercices de préparation

Pour chaque action, précise :
- Un délai de réalisation réaliste
- Des indicateurs de réussite mesurables
- Le niveau de priorité (Essentiel, Important, Complémentaire)

Ton plan d'action doit être ambitieux mais réalisable, en tenant compte des contraintes et atouts spécifiques du candidat. Pour chaque semaine, propose 5-7 actions concrètes et détaillées, pas seulement des généralités. Utilise un ton motivant et encourageant tout en restant pragmatique.` },
        { id: '4', title: '4. Analyse CV', content: `Tu es un Consultant Expert en Intelligence Économique spécialisé dans l'analyse d'entreprises pour les candidats à l'emploi. Ta mission est de fournir une analyse complète et structurée de l'entreprise [NOM DE L'ENTREPRISE] pour un candidat qui postule au poste de [INTITULÉ DU POSTE].

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

Ta réponse doit être factuelle, précise et basée uniquement sur des informations publiques vérifiables. Utilise un ton professionnel et objectif. L'analyse doit permettre au candidat de démontrer une compréhension approfondie de l'entreprise lors de son entretien et d'adapter son discours en conséquence.` },
        { id: '5', title: '5. Recherche Entreprise', content: `Tu es un expert en optimisation de CV et en recrutement avec 15 ans d'expérience. Ta mission est d'analyser en profondeur le CV que je vais te partager pour un poste de [TYPE DE POSTE].

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

Sois précis, direct et constructif. Évite les généralités et concentre-toi sur des améliorations spécifiques et actionnables. Ton objectif est d'aider le candidat à transformer son CV en un outil de marketing personnel efficace qui se démarque et passe les filtres ATS.` },
        { id: '6', title: '6. Matching CV / Offre', content: `Tu es un expert en recrutement spécialisé dans l'évaluation de candidatures. Je te transmets un CV et une offre d'emploi. Ta mission est d'analyser précisément le degré de correspondance entre les deux.

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

Sois précis et actionnable dans tes recommandations. L'objectif est d'aider le candidat à augmenter significativement ses chances d'être sélectionné pour un entretien pour ce poste spécifique.` },
        { id: '7', title: '7. Lettre de Motivation', content: `Tu es un Expert en Communication Professionnelle spécialisé dans la rédaction de lettres de motivation percutantes. Ta mission est de créer 3 versions distinctes mais également efficaces d'une lettre de motivation pour le poste suivant :

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

Assure-toi que chaque version soit unique dans son approche tout en restant authentique et adaptée au profil du candidat.` },
        { id: '8', title: '8. Ciblage Offres', content: `Évalue le matching entre le profil de [Nom du coaché] et ces offres d'emploi. Classe-les par pertinence et suggère des adaptations.
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

[Ajouter d'autres offres si nécessaire]
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
- Formations/préparations recommandées pour améliorer le profil
` },
        { id: '9', title: '9. Préparation Entretien', content: `Tu es un Coach Expert en Préparation aux Entretiens d'Embauche avec une expérience de 15 ans dans le recrutement. Ta mission est de préparer un candidat à un entretien pour le poste suivant :

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

Ton guide doit être spécifique au profil du candidat et au poste visé, pas un ensemble de conseils génériques. Adopte un ton à la fois professionnel et encourageant. L'objectif est de permettre au candidat d'entrer dans l'entretien avec confiance, préparation et authenticité.` },
        { id: '10', title: '10. Bilan du Coaching', content: `Tu es un Expert en Évaluation et Bilan de Coaching Professionnel. Ta mission est d'aider un coach à réaliser un bilan structuré et approfondi de l'accompagnement d'un coaché en recherche d'emploi.

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

Ta synthèse doit être à la fois analytique et constructive, en identifiant concrètement ce qui a fonctionné et ce qui pourrait être amélioré. Elle doit aider le coach à affiner sa méthodologie et fournir au coaché une vision claire de son parcours et de ses prochains défis. Utilise un ton professionnel mais chaleureux, et des formulations précises et nuancées.` }
    ];

    // --- FONCTIONS ---
    function displayPrompts() {
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS, []);
        promptContainer.innerHTML = ''; 

        prompts.forEach(prompt => {
            const contentPreview = prompt.content.split(' ').slice(0, 20).join(' ') + '...';
            const cardHTML = `
                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 flex flex-col" data-id="${prompt.id}">
                    <h3 class="text-lg font-bold text-gray-800 flex-grow">${prompt.title}</h3>
                    <div class="text-xs text-gray-600 my-4 italic h-16 overflow-hidden">${contentPreview}</div>
                    <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t">
                        <button data-action="edit" class="text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">Modifier</button>
                        <button data-action="use" class="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Utiliser</button>
                        <button data-action="open-chatgpt" title="Ouvrir dans ChatGPT" class="text-sm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-2 rounded-lg"><i class="fas fa-external-link-alt"></i></button>
                        <button data-action="save-response" title="Enregistrer une réponse" class="text-sm bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-2 rounded-lg"><i class="fas fa-save"></i></button>
                    </div>
                </div>`;
            promptContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
    
    function showPromptModal(promptId) {
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS, []);
        const promptData = prompts.find(p => p.id === promptId);
        if (!promptData) return;

        modalTitle.textContent = 'Modifier le prompt';
        document.getElementById('prompt-id').value = promptData.id;
        titleInput.value = promptData.title;
        contentTextarea.value = promptData.content;
        
        promptModal.classList.remove('hidden');
    }
    
    function initializePage() {
        let prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        if (!prompts || prompts.length === 0) {
            DataStorage.save(DataStorage.KEYS.PROMPTS, defaultPrompts);
            prompts = defaultPrompts; // On s'assure que la variable locale est à jour
        }
        displayPrompts(prompts);
    }
    
    function handleFormSubmit(event) {
        event.preventDefault();
        const promptId = document.getElementById('prompt-id').value;
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS, []);
        
        const promptIndex = prompts.findIndex(p => p.id === promptId);
        if (promptIndex > -1) {
            prompts[promptIndex].title = titleInput.value;
            prompts[promptIndex].content = contentTextarea.value;
            DataStorage.save(DataStorage.KEYS.PROMPTS, prompts);
            displayPrompts(prompts);
            promptModal.classList.add('hidden');
        } else {
            alert('Erreur : impossible de trouver le prompt à mettre à jour.');
        }
    }

    // --- GESTION DES ÉVÉNEMENTS ---
    promptContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;

        const card = button.closest('[data-id]');
        const promptId = card?.dataset.id;
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS, []);
        const promptData = prompts.find(p => p.id === promptId);
        if (!promptData) return;

        switch (button.dataset.action) {
            case 'edit':
            case 'use':
                showPromptModal(promptId);
                break;
            case 'open-chatgpt':
                window.open(`https://chat.openai.com/?q=${encodeURIComponent(promptData.content)}`, '_blank');
                break;
            case 'save-response':
                alert("Fonctionnalité 'Enregistrer réponse' à développer.");
                break;
        }
    });

    form.addEventListener('submit', handleFormSubmit);

    promptModal.querySelectorAll('.close-prompt-modal').forEach(btn => {
        btn.addEventListener('click', () => promptModal.classList.add('hidden'));
    });

    // --- DÉMARRAGE ---
    initializePage();
});
