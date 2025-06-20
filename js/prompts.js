// js/prompts.js - NOUVELLE VERSION COMPLÈTE

document.addEventListener('DOMContentLoaded', function() {
    // --- ÉLÉMENTS DU DOM ---
    const promptContainer = document.getElementById('prompt-container');
    const promptModal = document.getElementById('promptModal');
    const modalTitle = document.getElementById('promptModalTitle');
    const titleInput = document.getElementById('promptTitleEdit');
    const contentTextarea = document.getElementById('promptContentEdit');
    const saveButton = document.getElementById('savePromptEdit');

    // --- DONNÉES PAR DÉFAUT ---
    // Vos prompts détaillés, utilisés uniquement si la mémoire est vide.
    const defaultPrompts = [
        { id: '1', title: '1. Diagnostic de Départ', content: `Je suis un coach spécialisé en emploi et carrière. Je réalise un diagnostic initial pour [Nom du coaché], qui recherche un poste de [type de poste].

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

Présente ta réponse de manière professionnelle et encourageante, sans jugement, en adoptant une approche coach qui associe bienveillance et lucidité.` },
        { id: '2', title: '2. Analyse du Marché', content: `En tant que coach en recherche d'emploi, j'ai besoin d'une analyse complète du marché pour le secteur [secteur] dans lequel mon coaché recherche un poste de [type de poste]. Je souhaite obtenir une synthèse actuelle et pertinente pour l'aider à comprendre l'environnement professionnel et optimiser sa recherche.

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

Basez votre analyse sur le marché français actuel, tout en mentionnant les particularités régionales si pertinent. Présentez les informations de manière structurée et actionnable pour un candidat.` },
        { id: '3', title: '3. Plan d\'action détaillé', content: `Sur la base du diagnostic réalisé pour [Nom du coaché] qui recherche un poste de [type de poste], élabore un plan d'action concret et détaillé sur 8 semaines pour structurer sa recherche d'emploi et maximiser ses chances de succès.

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

Présente ce plan sous forme de calendrier structuré, avec des objectifs et tâches clairement définis pour chaque semaine. Utilise un ton motivant et directif. Veille à ce que le plan soit à la fois ambitieux et réaliste, adapté au profil et à la situation du coaché.` },
        { id: '4', title: '4. Analyse CV', content: `Analyse le CV de [Nom du coaché] qui postule pour un poste de [type de poste]. Identifie les forces et faiblesses du CV et propose des améliorations concrètes pour augmenter ses chances de succès.

Voici le CV à analyser :
[Coller ici le CV complet du candidat]

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

Fournis une note globale sur 10 et un plan d'action pour optimiser ce CV dans les 48h.` },
        { id: '5', title: '5. Recherche Entreprise', content: `Réalise une synthèse complète sur l'entreprise [Nom de l'entreprise] pour mon coaché qui souhaite y postuler. Cette recherche doit lui permettre de personnaliser sa candidature et de se préparer efficacement aux entretiens.

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

Termine par 3 raisons concrètes pour lesquelles [Nom du coaché] devrait rejoindre cette entreprise.` },
        { id: '6', title: '6. Matching CV / Offre', content: `Analyse le degré de matching entre le CV de [Nom du coaché] et l'offre d'emploi pour le poste de [intitulé du poste] chez [nom de l'entreprise].

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

Conclus par un avis motivé : candidature à encourager ou non, et stratégie recommandée.` },
        { id: '7', title: '7. Lettre de Motivation', content: `Rédige une lettre de motivation percutante pour [Nom du coaché] qui postule au poste de [intitulé du poste] chez [nom de l'entreprise].

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

Génère 2 versions : une version classique et une version plus créative/moderne.` },
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
- Formations/préparations recommandées pour améliorer le profil` },
        { id: '9', title: '9. Préparation Entretien', content: `Génère une série de questions d'entretien pour [Nom du coaché] qui postule au poste de [intitulé du poste] chez [nom de l'entreprise].

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
   - Échec professionnel et leçons apprises
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

Ajoute des conseils pratiques pour l'entretien et la posture à adopter.` },
        { id: '10', title: '10. Bilan du Coaching', content: `Réalise un bilan complet du coaching réalisé avec [Nom du coaché]. Analyse la progression, les points forts, les axes d'amélioration et propose des recommandations pour la suite.

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

Conclus par une note d'encouragement et une vision positive pour la suite de sa recherche.` }
    ];

    // --- FONCTIONS PRINCIPALES ---

    /**
     * Affiche dynamiquement les prompts dans le conteneur HTML.
     */
    function displayPrompts() {
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        promptContainer.innerHTML = ''; // Toujours vider avant de remplir

        prompts.forEach(prompt => {
            const cardHTML = `
                <div class="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500" data-id="${prompt.id}">
                    <h3 class="text-xl font-bold text-gray-800">${prompt.title}</h3>
                    <div class="text-xs text-gray-500 my-4 italic line-clamp-3">
                        ${prompt.content}
                    </div>
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button data-action="use" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center">
                            <i class="fas fa-play mr-1"></i> Utiliser
                        </button>
                        <button data-action="edit" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm flex items-center">
                            <i class="fas fa-edit mr-1"></i> Modifier
                        </button>
                        <button data-action="open-chatgpt" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center">
                            <i class="fas fa-external-link-alt mr-1"></i> Ouvrir dans ChatGPT
                        </button>
                        <button data-action="save-response" class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center">
                            <i class="fas fa-save mr-1"></i> Enregistrer réponse
                        </button>
                    </div>
                </div>`;
            promptContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    /**
     * Ouvre et configure le modal pour utiliser ou modifier un prompt.
     * @param {string} promptId - L'ID du prompt à afficher.
     * @param {'use'|'edit'} mode - Le mode d'ouverture du modal.
     */
    function showPromptModal(promptId, mode) {
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        const promptData = prompts.find(p => p.id === promptId);
        if (!promptData) return;

        titleInput.value = promptData.title;
        contentTextarea.value = promptData.content;

        if (mode === 'edit') {
            modalTitle.textContent = 'Modifier le prompt : ' + promptData.title;
            titleInput.readOnly = false;
            contentTextarea.readOnly = false;
            saveButton.classList.remove('hidden');
            saveButton.dataset.promptId = promptId; // Stocker l'ID pour la sauvegarde
        } else { // mode 'use'
            modalTitle.textContent = 'Utiliser le prompt : ' + promptData.title;
            titleInput.readOnly = true;
            contentTextarea.readOnly = true;
            saveButton.classList.add('hidden');
        }
        promptModal.classList.remove('hidden');
    }
    
    /**
     * Initialise la page: vérifie les données, les crée si besoin, et affiche.
     */
    function initializePage() {
        let prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        if (prompts.length === 0) {
            console.log("Aucun prompt trouvé en mémoire, création des prompts par défaut.");
            DataStorage.save(DataStorage.KEYS.PROMPTS, defaultPrompts);
        }
        displayPrompts();
    }

    // --- GESTION DES ÉVÉNEMENTS ---

    // Gérer tous les clics sur les boutons des cartes de prompt
    promptContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;

        const card = button.closest('[data-id]');
        const promptId = card.dataset.id;
        const action = button.dataset.action;
        
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        const promptData = prompts.find(p => p.id === promptId);

        switch (action) {
            case 'edit':
                showPromptModal(promptId, 'edit');
                break;
            case 'use':
                showPromptModal(promptId, 'use');
                break;
            case 'open-chatgpt':
                const encodedPrompt = encodeURIComponent(promptData.content);
                window.open(`https://chat.openai.com/?q=${encodedPrompt}`, '_blank');
                break;
            case 'save-response':
                // Logique pour le modal "Enregistrer réponse"
                alert("Fonctionnalité à connecter au modal de réponse.");
                // document.getElementById('responseModal').classList.remove('hidden');
                break;
        }
    });

    // Gérer le clic sur le bouton "Sauvegarder" du modal d'édition
    saveButton.addEventListener('click', () => {
        const promptId = saveButton.dataset.promptId;
        const updatedData = {
            title: titleInput.value,
            content: contentTextarea.value
        };

        if (DataStorage.update(DataStorage.KEYS.PROMPTS, promptId, updatedData)) {
            promptModal.classList.add('hidden');
            displayPrompts(); // Rafraîchir l'affichage
            alert('Prompt mis à jour avec succès !');
        } else {
            alert('Erreur lors de la mise à jour.');
        }
    });

    // Gérer la fermeture du modal
    document.querySelectorAll('.close-prompt-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            promptModal.classList.add('hidden');
        });
    });

    // --- DÉMARRAGE ---
    initializePage();
});
