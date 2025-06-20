// js/dashboard.js - VERSION FINALE HARMONISÉE

document.addEventListener('DOMContentLoaded', function() {

    // --- ÉLÉMENTS DU DOM POUR LES STATS ---
    const statsActive = document.getElementById('stats-active-coachees');
    const statsCompleted = document.getElementById('stats-completed-coachees');
    const statsMonthly = document.getElementById('stats-monthly-sessions');
    const statsPrompts = document.getElementById('stats-total-prompts');

    // --- ÉLÉMENTS DU DOM POUR LES GRAPHIQUES ---
    const progressChartCtx = document.getElementById('progress-chart')?.getContext('2d');
    const statusChartCtx = document.getElementById('status-chart')?.getContext('2d');

    // Instances des graphiques pour pouvoir les détruire et recréer
    let progressChartInstance = null;
    let statusChartInstance = null;

    // --- FONCTION PRINCIPALE D'INITIALISATION ---
    function initializeDashboard() {
        // 1. Charger les données réelles depuis DataStorage
        const coachees = DataStorage.get(DataStorage.KEYS.COACHEDS);
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        // Note : Pour les sessions, il faudra une clé centralisée comme 'DataStorage.KEYS.SESSIONS' à l'avenir.
        // Pour l'instant, nous nous basons sur les données des coachés.

        // 2. Calculer les statistiques
        const activeCoachees = coachees.filter(c => c.status === 'Actif').length;
        const completedCoachees = coachees.filter(c => (c.currentStep || 0) >= 10).length;
        const totalPrompts = prompts.length;
        // Le calcul des sessions mensuelles nécessitera un stockage centralisé des sessions.
        // Pour l'exemple, nous mettons une valeur statique.
        const monthlySessions = 0; // À dynamiser plus tard

        // 3. Afficher les statistiques
        statsActive.textContent = activeCoachees;
        statsCompleted.textContent = completedCoachees;
        statsMonthly.textContent = monthlySessions;
        statsPrompts.textContent = totalPrompts;

        // 4. Générer les graphiques avec les données réelles
        generateProgressChart(coachees);
        generateStatusChart(coachees);
    }

    // --- GÉNÉRATION DES GRAPHIQUES ---

    function generateProgressChart(coachees) {
        if (!progressChartCtx) return;
        if (progressChartInstance) progressChartInstance.destroy(); // Détruire l'ancien graphique

        const stepCounts = Array(10).fill(0); // Un tableau de 10 zéros
        coachees.forEach(coachee => {
            const step = (coachee.currentStep || 1) - 1; // index de 0 à 9
            if (step >= 0 && step < 10) {
                stepCounts[step]++;
            }
        });

        progressChartInstance = new Chart(progressChartCtx, {
            type: 'bar',
            data: {
                labels: ['Étape 1', 'Étape 2', 'Étape 3', 'Étape 4', 'Étape 5', 'Étape 6', 'Étape 7', 'Étape 8', 'Étape 9', 'Étape 10'],
                datasets: [{
                    label: 'Nombre de coachés par étape',
                    data: stepCounts,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1 // N'afficher que des entiers sur l'axe Y
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    function generateStatusChart(coachees) {
        if (!statusChartCtx) return;
        if (statusChartInstance) statusChartInstance.destroy(); // Détruire l'ancien graphique

        const statusCounts = {
            'Actif': 0,
            'En attente': 0,
            'Terminé': 0,
            'En pause': 0
        };

        coachees.forEach(coachee => {
            const status = coachee.status || 'En attente';
             if (statusCounts.hasOwnProperty(status)) {
                statusCounts[status]++;
            }
        });

        statusChartInstance = new Chart(statusChartCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    label: 'Statut des Coachés',
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',  // Actif (Bleu)
                        'rgba(249, 115, 22, 0.7)', // En attente (Orange)
                        'rgba(22, 163, 74, 0.7)',   // Terminé (Vert)
                        'rgba(107, 114, 128, 0.7)' // En pause (Gris)
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // --- DÉMARRAGE ---
    initializeDashboard();

});
