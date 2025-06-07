console.log('Script prompt-handler-simple.js chargé');

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation des gestionnaires...');
    
    // Initialiser après un délai pour s'assurer que tout est prêt
    setTimeout(function() {
        initializeButtons();
    }, 500);
});

function initializeButtons() {
    console.log('Initialisation des boutons...');
    
    // Données des prompts
    const promptsData = {
        '1': {
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
            title: "Analyse du Marché",
            content: `En tant que coach en recherche d'emploi, j'ai besoin d'une analyse complète du marché pour le secteur [secteur] dans lequel mon coaché recherche un poste de [type de poste]. Je souhaite obtenir une synthèse actuelle et pertinente pour l'aider à comprendre l'environnement professionnel et optimiser sa recherche.

Fournissez une analyse détaillée incluant :

1. État actuel du marché de l'emploi dans ce secteur
2. Compétences recherchées
3. Entreprises à cibler
4. Processus de recrutement typiques
5. Rémunération
6. Conseils stratégiques

Basez votre analyse sur le marché français actuel, tout en mentionnant les particularités régionales si pertinent.`
        },
        '3': {
            title: "Plan d'action détaillé",
            content: `Sur la base du diagnostic réalisé pour [Nom du coaché] qui recherche un poste de [type de poste], élabore un plan d'action concret et détaillé sur 8 semaines pour structurer sa recherche d'emploi et maximiser ses chances de succès.`
        },
        '4': {
            title: "Analyse CV",
            content: `Analyse le CV de [Nom du coaché] qui postule pour un poste de [type de poste]. Identifie les forces et faiblesses du CV et propose des améliorations concrètes pour augmenter ses chances de succès.`
        },
        '5': {
            title: "Recherche Entreprise",
            content: `Réalise une synthèse complète sur l'entreprise [Nom de l'entreprise] pour mon coaché qui souhaite y postuler. Cette recherche doit lui permettre de personnaliser sa candidature et de se préparer efficacement aux entretiens.`
        },
        '6': {
            title: "Matching CV / Offre",
            content: `Analyse le degré de matching entre le CV de [Nom du coaché] et l'offre d'emploi pour le poste de [intitulé du poste] chez [nom de l'entreprise].`
        },
        '7': {
            title: "Lettre de Motivation",
            content: `Rédige une lettre de motivation percutante pour [Nom du coaché] qui postule au poste de [intitulé du poste] chez [nom de l'entreprise].`
        },
        '8': {
            title: "Ciblage Offres",
            content: `Évalue le matching entre le profil de [Nom du coaché] et ces offres d'emploi. Classe-les par pertinence et suggère des adaptations.`
        },
        '9': {
            title: "Préparation Entretien",
            content: `Génère une série de questions d'entretien pour [Nom du coaché] qui postule au poste de [intitulé du poste] chez [nom de l'entreprise].`
        },
        '10': {
            title: "Bilan du Coaching",
            content: `Réalise un bilan complet du coaching réalisé avec [Nom du coaché]. Analyse la progression, les points forts, les axes d'amélioration et propose des recommandations pour la suite.`
        }
    };
    
    // Gestionnaire pour les boutons "Ouvrir dans ChatGPT"
    const chatGptButtons = document.querySelectorAll('.open-in-chatgpt-btn');
    console.log('Boutons ChatGPT trouvés :', chatGptButtons.length);
    
    chatGptButtons.forEach((button, index) => {
        console.log('Ajout événement sur bouton', index + 1);
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clic détecté sur bouton ChatGPT');
            
            const promptId = this.getAttribute('data-prompt-id');
            console.log('ID du prompt :', promptId);
            
            const promptData = promptsData[promptId];
            if (promptData) {
                console.log('Prompt trouvé :', promptData.title);
                
                // Ouvrir ChatGPT
                window.open('https://chat.openai.com/', '_blank');
                
                // Copier le contenu
                copyToClipboard(promptData.content);
            } else {
                console.error('Prompt non trouvé pour l\'ID :', promptId);
                alert('Erreur : Prompt non trouvé');
            }
        });
    });
    
    // Gestionnaire pour les boutons "Enregistrer réponse"
    const saveButtons = document.querySelectorAll('.save-response-btn');
    console.log('Boutons Save trouvés :', saveButtons.length);
    
    saveButtons.forEach((button, index) => {
        console.log('Ajout événement sur bouton save', index + 1);
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clic détecté sur bouton Save');
            
            const promptId = this.getAttribute('data-prompt-id');
            const promptData = promptsData[promptId];
            
            if (promptData) {
                alert('Fonctionnalité "Enregistrer réponse" pour le prompt : ' + promptData.title + '\n\nCette fonction sera bientôt disponible.');
            }
        });
    });
    
    console.log('Initialisation terminée');
}

// Fonction pour copier dans le presse-papiers
function copyToClipboard(text) {
    console.log('Tentative de copie dans le presse-papiers...');
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Copie réussie avec clipboard API');
            showSuccessMessage();
        }).catch(function(err) {
            console.log('Échec clipboard API, utilisation du fallback');
            fallbackCopyTextToClipboard(text);
        });
    } else {
        console.log('Clipboard API non disponible, utilisation du fallback');
        fallbackCopyTextToClipboard(text);
    }
}

// Méthode de copie alternative
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            console.log('Copie réussie avec execCommand');
            showSuccessMessage();
        } else {
            console.log('Échec de la copie');
            showErrorMessage();
        }
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
        showErrorMessage();
    }
    
    document.body.removeChild(textArea);
}

function showSuccessMessage() {
    alert('✅ Le prompt a été copié dans votre presse-papiers !\n\nCollez-le maintenant dans ChatGPT pour continuer.');
}

function showErrorMessage() {
    alert('❌ Impossible de copier automatiquement.\n\nVeuillez copier manuellement le contenu du prompt.');
}
