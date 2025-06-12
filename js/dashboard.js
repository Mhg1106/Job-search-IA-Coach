// Gestion du tableau de bord - dashboard.js
let dashboardData = {
    coachees: [],
    sessions: [],
    appointments: [],
    stats: {}
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du tableau de bord...');
    
    // Charger toutes les données
    loadAllData();
    
    // Calculer et afficher les statistiques
    calculateStatistics();
    
    // Générer les graphiques
    generateProgressChart();
    generatePromptsChart();
    
    // Charger les sections dynamiques
    loadUpcomingSessions();
    loadRecentActivities();
    loadAlerts();
    
    // Actualiser toutes les 5 minutes
    setInterval(refreshDashboard, 300000);
});

// ========== CHARGEMENT DES DONNÉES ==========

function loadAllData() {
    // Charger les coachés (données fictives pour le moment)
    dashboardData.coachees = getCoacheesData();
    
    // Charger toutes les sessions de tous les coachés
    dashboardData.sessions = getAllSessions();
    
    // Charger les rendez-vous
    dashboardData.appointments = JSON.parse(localStorage.getItem('coach_appointments')) || [];
    
    console.log('Données chargées:', dashboardData);
}

function getCoacheesData() {
    // Pour le moment, utiliser les données fictives
    // Plus tard, vous pourrez les remplacer par de vraies données
    return [
        {
            id: 'marie-dupont',
            name: 'Marie Dupont',
            status: 'active',
            sector: 'Marketing Digital',
            startDate: '2024-11-01',
            currentStep: 9,
            totalSteps: 10,
            lastActivity: new Date().toISOString(),
            revenue: 800 // Prix du coaching
        },
        {
            id: 'thomas-martin',
            name: 'Thomas Martin',
            status: 'pending',
            sector: 'Développement Web',
            startDate: '2024-11-15',
            currentStep: 4,
            totalSteps: 10,
            lastActivity: new Date(Date.now() - 86400000).toISOString(), // Hier
            revenue: 600
        },
        {
            id: 'sophie-laurent',
            name: 'Sophie Laurent',
            status: 'active',
            sector: 'Chef de Projet',
            startDate: '2024-12-01',
            currentStep: 1,
            totalSteps: 10,
            lastActivity: new Date(Date.now() - 172800000).toISOString(), // Avant-hier
            revenue: 700
        }
    ];
}

function getAllSessions() {
    const allSessions = [];
    
    dashboardData.coachees.forEach(coachee => {
        const sessions = JSON.parse(localStorage.getItem(`sessions_history_${coachee.name}`)) || [];
        sessions.forEach(session => {
            session.coacheeId = coachee.id;
            allSessions.push(session);
        });
    });
    
    return allSessions;
}

// ========== CALCUL DES STATISTIQUES ==========

function calculateStatistics() {
    const stats = {
        activeCoachees: 0,
        totalCoachees: dashboardData.coachees.length,
        monthlySessions: 0,
        successRate: 0,
        monthlyRevenue: 0
    };
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculer coachés actifs
    stats.activeCoachees = dashboardData.coachees.filter(c => c.status === 'active').length;
    
    // Calculer sessions du mois
    stats.monthlySessions = dashboardData.sessions.filter(session => {
        const sessionDate = new Date(session.timestamp || session.date);
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
    }).length;
    
    // Calculer taux de succès (coachés qui ont terminé / total)
    const completedCoachees = dashboardData.coachees.filter(c => c.currentStep >= 10).length;
    stats.successRate = dashboardData.coachees.length > 0 ? 
        Math.round((completedCoachees / dashboardData.coachees.length) * 100) : 0;
    
    // Calculer revenus du mois (coachés actifs ce mois)
    stats.monthlyRevenue = dashboardData.coachees
        .filter(c => {
            const startDate = new Date(c.startDate);
            return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
        })
        .reduce((total, c) => total + (c.revenue || 0), 0);
    
    // Afficher les statistiques
    displayStatistics(stats);
    
    dashboardData.stats = stats;
}

function displayStatistics(stats) {
    document.getElementById('activeCoacheesCount').textContent = stats.activeCoachees;
    document.getElementById('monthlySessionsCount').textContent = stats.monthlySessions;
    document.getElementById('successRate').textContent = `${stats.successRate}%`;
    document.getElementById('monthlyRevenue').textContent = `${stats.monthlyRevenue}€`;
    
    // Calculer évolutions (simulées pour le moment)
    document.getElementById('activeCoacheesEvolution').textContent = '+12%';
    document.getElementById('sessionsEvolution').textContent = '+8%';
    document.getElementById('successEvolution').textContent = '+5%';
    document.getElementById('revenueEvolution').textContent = '+15%';
}

// ========== GÉNÉRATION DES GRAPHIQUES ==========

function generateProgressChart() {
    const container = document.getElementById('progressChart');
    
    // Compter les coachés par étape
    const stepCounts = {};
    for (let i = 1; i <= 10; i++) {
        stepCounts[i] = 0;
    }
    
    dashboardData.coachees.forEach(coachee => {
        if (stepCounts[coachee.currentStep] !== undefined) {
            stepCounts[coachee.currentStep]++;
        }
    });
    
    // Créer un graphique en barres simple
    let chartHTML = '<div class="space-y-3">';
    
    const stepNames = [
        'Diagnostic', 'Marché', 'Plan action', 'CV', 'Recherche',
        'Matching', 'Lettres', 'Ciblage', 'Entretien', 'Bilan'
    ];
    
    Object.entries(stepCounts).forEach(([step, count]) => {
        const percentage = dashboardData.coachees.length > 0 ? 
            (count / dashboardData.coachees.length) * 100 : 0;
        
        chartHTML += `
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 w-20">${stepNames[step - 1]}</span>
                <div class="flex-1 mx-3">
                    <div class="bg-gray-200 rounded-full h-3">
                        <div class="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                             style="width: ${percentage}%"></div>
                    </div>
                </div>
                <span class="text-sm font-medium w-8">${count}</span>
            </div>
        `;
    });
    
    chartHTML += '</div>';
    container.innerHTML = chartHTML;
}

function generatePromptsChart() {
    const container = document.getElementById('promptsChart');
    
    // Analyser la qualité des prompts
    const qualityStats = {
        excellent: 0,
        bon: 0,
        moyen: 0,
        faible: 0
    };
    
    dashboardData.sessions.forEach(session => {
        if (session.resultQuality && qualityStats[session.resultQuality] !== undefined) {
            qualityStats[session.resultQuality]++;
        }
    });
    
    const total = Object.values(qualityStats).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
        container.innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                    <i class="fas fa-robot fa-3x mb-4"></i>
                    <p>Aucune donnée de qualité disponible</p>
                    <p class="text-sm">Utilisez les prompts IA pour voir les statistiques</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Créer un graphique en donut simple
    let chartHTML = '<div class="space-y-4">';
    
    const colors = {
        excellent: 'bg-green-500',
        bon: 'bg-blue-500',
        moyen: 'bg-yellow-500',
        faible: 'bg-red-500'
    };
    
    const labels = {
        excellent: '⭐⭐⭐⭐⭐ Excellent',
        bon: '⭐⭐⭐⭐ Bon',
        moyen: '⭐⭐⭐ Moyen',
        faible: '⭐⭐ Faible'
    };
    
    Object.entries(qualityStats).forEach(([quality, count]) => {
        const percentage = (count / total) * 100;
        
        chartHTML += `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <div class="w-4 h-4 ${colors[quality]} rounded mr-3"></div>
                    <span class="text-sm">${labels[quality]}</span>
                </div>
                <div class="text-right">
                    <span class="font-medium">${count}</span>
                    <span class="text-sm text-gray-500 ml-2">(${percentage.toFixed(1)}%)</span>
                </div>
            </div>
        `;
    });
    
    chartHTML += '</div>';
    container.innerHTML = chartHTML;
}

// ========== SECTIONS DYNAMIQUES ==========

function loadUpcomingSessions() {
    const container = document.getElementById('upcomingSessions');
    
    // Filtrer les rendez-vous futurs
    const upcomingAppointments = dashboardData.appointments
        .filter(apt => new Date(`${apt.date}T${apt.time}`) > new Date())
        .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
        .slice(0, 5);
    
    if (upcomingAppointments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-calendar-times fa-2x mb-3"></i>
                <p>Aucune session programmée</p>
                <a href="calendrier.html" class="text-blue-600 hover:text-blue-800 text-sm">
                    Planifier une session
                </a>
            </div>
        `;
        return;
    }
    
    let html = '';
    upcomingAppointments.forEach(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        const isToday = appointmentDate.toDateString() === new Date().toDateString();
        const isTomorrow = appointmentDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
        
        let dateLabel = appointmentDate.toLocaleDateString('fr-FR');
        if (isToday) dateLabel = "Aujourd'hui";
        if (isTomorrow) dateLabel = "Demain";
        
        html += `
            <div class="flex items-center justify-between p-3 border-l-4 ${isToday ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'} rounded mb-3">
                <div class="flex-grow-1">
                    <div class="font-medium">${appointment.coachee}</div>
                    <div class="text-sm text-gray-600">
                        ${getStepName(appointment.type)} • ${dateLabel} à ${appointment.time}
                    </div>
                </div>
                <button onclick="startSessionFromDashboard('${appointment.coachee}', '${appointment.type}')" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    
    // Combiner sessions et activités, trier par date
    const activities = [];
    
    // Ajouter les sessions récentes
    dashboardData.sessions.forEach(session => {
        activities.push({
            type: 'session',
            coachee: session.coacheName,
            action: `Session ${session.step} - ${session.stepName}`,
            timestamp: new Date(session.timestamp || session.date),
            icon: 'fas fa-video',
            color: 'text-blue-600'
        });
    });
    
    // Ajouter les rendez-vous créés récemment
    dashboardData.appointments.forEach(apt => {
        activities.push({
            type: 'appointment',
            coachee: apt.coachee,
            action: `Rendez-vous planifié`,
            timestamp: new Date(apt.createdAt || apt.date),
            icon: 'fas fa-calendar-plus',
            color: 'text-green-600'
        });
    });
    
    // Trier par date décroissante et prendre les 8 plus récentes
    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = activities.slice(0, 8);
    
    if (recentActivities.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-clock fa-2x mb-3"></i>
                <p>Aucune activité récente</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    recentActivities.forEach(activity => {
        const timeAgo = getTimeAgo(activity.timestamp);
        
        html += `
            <div class="flex items-center p-3 hover:bg-gray-50 rounded">
                <div class="flex-shrink-0">
                    <i class="${activity.icon} ${activity.color}"></i>
                </div>
                <div class="ml-3 flex-grow-1">
                    <div class="text-sm font-medium">${activity.coachee}</div>
                    <div class="text-sm text-gray-600">${activity.action}</div>
                </div>
                <div class="text-xs text-gray-500">
                    ${timeAgo}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadAlerts() {
    const container = document.getElementById('alertsSection');
    const alerts = [];
    
    // Vérifier les coachés inactifs
    dashboardData.coachees.forEach(coachee => {
        const lastActivity = new Date(coachee.lastActivity);
        const daysSinceActivity = Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24));
        
        if (daysSinceActivity > 7) {
            alerts.push({
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                message: `${coachee.name} n'a pas eu d'activité depuis ${daysSinceActivity} jours`,
                action: () => openCoacheeDossier(coachee.name)
            });
        }
    });
    
    // Vérifier les sessions du jour
    const todayAppointments = dashboardData.appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const today = new Date();
        return aptDate.toDateString() === today.toDateString();
    });
    
    if (todayAppointments.length > 0) {
        alerts.push({
            type: 'info',
            icon: 'fas fa-calendar-day',
            message: `${todayAppointments.length} session(s) prévue(s) aujourd'hui`,
            action: () => window.location.href = 'calendrier.html'
        });
    }
    
    // Afficher les alertes
    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-gray-500">
                <i class="fas fa-check-circle fa-2x mb-2 text-green-500"></i>
                <p>Aucune alerte</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    alerts.forEach((alert, index) => {
        const bgColor = alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200';
        const textColor = alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800';
        
        html += `
            <div class="flex items-center justify-between p-4 ${bgColor} border rounded-lg mb-3">
                <div class="flex items-center">
                    <i class="${alert.icon} ${textColor} mr-3"></i>
                    <span class="${textColor}">${alert.message}</span>
                </div>
                <button onclick="handleAlert(${index})" class="text-sm ${textColor} hover:underline">
                    Action
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Stocker les actions pour les boutons
    window.dashboardAlerts = alerts;
}

// ========== FONCTIONS UTILITAIRES ==========

function getStepName(stepNumber) {
    const stepNames = {
        '1': 'Diagnostic de départ',
        '2': 'Analyse du marché',
        '3': 'Plan d\'action détaillé',
        '4': 'Analyse CV',
        '5': 'Recherche entreprise',
        '6': 'Matching CV / Offre',
        '7': 'Lettres de motivation',
        '8': 'Ciblage offres',
        '9': 'Préparation entretien',
        '10': 'Bilan du coaching'
    };
    return stepNames[stepNumber] || 'Session de coaching';
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
}

// ========== ACTIONS RAPIDES ==========

function toggleQuickActions() {
    const menu = document.getElementById('quickActionsMenu');
    menu.classList.toggle('hidden');
}

function quickAddCoachee() {
    window.location.href = 'coachees.html';
}

function quickScheduleSession() {
    window.location.href = 'calendrier.html';
}

function quickAccessPrompts() {
    window.location.href = 'prompts-library.html';
}

function startSessionFromDashboard(coacheeName, stepType) {
    window.location.href = `session.html?name=${encodeURIComponent(coacheeName)}&step=${stepType}`;
}

function openCoacheeDossier(coacheeName) {
    window.location.href = `dossier.html?name=${encodeURIComponent(coacheeName)}`;
}

function handleAlert(alertIndex) {
    if (window.dashboardAlerts && window.dashboardAlerts[alertIndex]) {
        window.dashboardAlerts[alertIndex].action();
    }
}

// ========== ACTUALISATION ==========

function refreshDashboard() {
    loadAllData();
    calculateStatistics();
    generateProgressChart();
    generatePromptsChart();
    loadUpcomingSessions();
    loadRecentActivities();
    loadAlerts();
}

function refreshProgressChart() {
    generateProgressChart();
}

function refreshPromptsChart() {
    generatePromptsChart();
}

function refreshActivities() {
    loadRecentActivities();
}

// Fermer le menu actions rapides si on clique ailleurs
document.addEventListener('click', function(event) {
    const menu = document.getElementById('quickActionsMenu');
    const button = event.target.closest('button');
    
    if (!button || !button.onclick || button.onclick.toString().indexOf('toggleQuickActions') === -1) {
        menu.classList.add('hidden');
    }
});
