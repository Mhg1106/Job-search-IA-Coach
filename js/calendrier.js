// Gestion du calendrier - calendrier.js
let currentDate = new Date();
let selectedDate = null;
let currentView = 'calendar'; // 'calendar' ou 'list'
let appointments = [];
let availability = {
    workDays: [1, 2, 3, 4, 5], // Lundi à Vendredi
    startTime: '09:00',
    endTime: '18:00',
    slotDuration: 60 // minutes
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du calendrier...');
    
    // Charger les données
    loadAppointments();
    loadAvailability();
    
    // Initialiser le calendrier
    renderCalendar();
    updateCurrentMonthDisplay();
    
    // Initialiser le formulaire
    initializeAppointmentForm();
    
    // Mettre à jour la vue liste
    renderAppointmentsList();
});

// ========== GESTION DU CALENDRIER ==========

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    
    // Ajuster au lundi de la première semaine
    startDate.setDate(startDate.getDate() - (startDate.getDay() + 6) % 7);
    
    // Garder les en-têtes et vider le reste
    const headers = calendarGrid.querySelectorAll('.calendar-header');
    calendarGrid.innerHTML = '';
    headers.forEach(header => calendarGrid.appendChild(header));
    
    // Générer 42 jours (6 semaines)
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = createDayElement(date, firstDay, lastDay);
        calendarGrid.appendChild(dayElement);
    }
}

function createDayElement(date, firstDay, lastDay) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    
    // Classes conditionnelles
    if (date < firstDay || date > lastDay) {
        dayDiv.classList.add('other-month');
    }
    
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        dayDiv.classList.add('today');
    }
    
    // Numéro du jour
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayDiv.appendChild(dayNumber);
    
    // Rendez-vous du jour
    const dayAppointments = getAppointmentsForDate(date);
    dayAppointments.forEach(appointment => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.className = `appointment ${appointment.status || 'confirmed'}`;
        appointmentDiv.textContent = `${appointment.time} ${appointment.coachee}`;
        appointmentDiv.onclick = (e) => {
            e.stopPropagation();
            viewAppointment(appointment);
        };
        dayDiv.appendChild(appointmentDiv);
    });
    
    // Click handler pour le jour
    dayDiv.onclick = () => selectDate(date);
    
    return dayDiv;
}

function selectDate(date) {
    // Enlever la sélection précédente
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Sélectionner le nouveau jour
    event.target.closest('.calendar-day').classList.add('selected');
    selectedDate = date;
    
    // Mettre à jour les créneaux disponibles
    updateTodaySlots(date);
}

function getAppointmentsForDate(date) {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
}

function updateCurrentMonthDisplay() {
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const currentMonthElement = document.getElementById('currentMonth');
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    updateCurrentMonthDisplay();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    updateCurrentMonthDisplay();
}

function goToToday() {
    currentDate = new Date();
    renderCalendar();
    updateCurrentMonthDisplay();
    selectDate(currentDate);
}

// ========== GESTION DES RENDEZ-VOUS ==========

function openAppointmentModal(appointment = null) {
    const modal = document.getElementById('appointmentModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (appointment) {
        modalTitle.textContent = 'Modifier Rendez-vous';
        fillAppointmentForm(appointment);
    } else {
        modalTitle.textContent = 'Nouveau Rendez-vous';
        clearAppointmentForm();
        
        // Pré-remplir la date si une date est sélectionnée
        if (selectedDate) {
            document.getElementById('appointmentDate').value = selectedDate.toISOString().split('T')[0];
            updateAvailableTimeSlots();
        }
    }
    
    modal.style.display = 'flex';
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').style.display = 'none';
}

function initializeAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const dateInput = document.getElementById('appointmentDate');
    
    // Mettre la date minimum à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Listener pour changement de date
    dateInput.addEventListener('change', updateAvailableTimeSlots);
    
    // Gestionnaire de soumission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveAppointment();
    });
}

function updateAvailableTimeSlots() {
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    const selectedDateStr = dateInput.value;
    
    if (!selectedDateStr) return;
    
    // Vider les options existantes
    timeSelect.innerHTML = '<option value="">Sélectionner l\'heure</option>';
    
    // Générer les créneaux disponibles
    const availableSlots = generateTimeSlots(selectedDateStr);
    
    availableSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.time;
        option.textContent = `${slot.time} ${slot.available ? '' : '(Occupé)'}`;
        option.disabled = !slot.available;
        timeSelect.appendChild(option);
    });
}

function generateTimeSlots(dateStr) {
    const slots = [];
    const selectedDate = new Date(dateStr);
    const dayOfWeek = selectedDate.getDay();
    
    // Vérifier si c'est un jour de travail
    if (!availability.workDays.includes(dayOfWeek)) {
        return slots;
    }
    
    // Générer les créneaux horaires
    const startTime = availability.startTime;
    const endTime = availability.endTime;
    const duration = availability.slotDuration;
    
    let currentTime = timeToMinutes(startTime);
    const endTimeMinutes = timeToMinutes(endTime);
    
    while (currentTime < endTimeMinutes) {
        const timeStr = minutesToTime(currentTime);
        const isAvailable = !isTimeSlotBooked(dateStr, timeStr);
        
        slots.push({
            time: timeStr,
            available: isAvailable
        });
        
        currentTime += duration;
    }
    
    return slots;
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function isTimeSlotBooked(date, time) {
    return appointments.some(apt => apt.date === date && apt.time === time);
}

function saveAppointment() {
    const formData = {
        id: Date.now().toString(),
        coachee: document.getElementById('appointmentCoachee').value,
        type: document.getElementById('appointmentType').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        duration: parseInt(document.getElementById('appointmentDuration').value),
        mode: document.getElementById('appointmentMode').value,
        notes: document.

// Gestion du calendrier - calendrier.js
let currentDate = new Date();
let selectedDate = null;
let currentView = 'calendar'; // 'calendar' ou 'list'
let appointments = [];
let availability = {
    workDays: [1, 2, 3, 4, 5], // Lundi à Vendredi
    startTime: '09:00',
    endTime: '18:00',
    slotDuration: 60 // minutes
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du calendrier...');
    
    // Charger les données
    loadAppointments();
    loadAvailability();
    
    // Initialiser le calendrier
    renderCalendar();
    updateCurrentMonthDisplay();
    
    // Initialiser le formulaire
    initializeAppointmentForm();
    
    // Mettre à jour la vue liste
    renderAppointmentsList();
});

// ========== GESTION DU CALENDRIER ==========

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    
    // Ajuster au lundi de la première semaine
    startDate.setDate(startDate.getDate() - (startDate.getDay() + 6) % 7);
    
    // Garder les en-têtes et vider le reste
    const headers = calendarGrid.querySelectorAll('.calendar-header');
    calendarGrid.innerHTML = '';
    headers.forEach(header => calendarGrid.appendChild(header));
    
    // Générer 42 jours (6 semaines)
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = createDayElement(date, firstDay, lastDay);
        calendarGrid.appendChild(dayElement);
    }
}

function createDayElement(date, firstDay, lastDay) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    
    // Classes conditionnelles
    if (date < firstDay || date > lastDay) {
        dayDiv.classList.add('other-month');
    }
    
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        dayDiv.classList.add('today');
    }
    
    // Numéro du jour
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    dayDiv.appendChild(dayNumber);
    
    // Rendez-vous du jour
    const dayAppointments = getAppointmentsForDate(date);
    dayAppointments.forEach(appointment => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.className = `appointment ${appointment.status || 'confirmed'}`;
        appointmentDiv.textContent = `${appointment.time} ${appointment.coachee}`;
        appointmentDiv.onclick = (e) => {
            e.stopPropagation();
            viewAppointment(appointment);
        };
        dayDiv.appendChild(appointmentDiv);
    });
    
    // Click handler pour le jour
    dayDiv.onclick = () => selectDate(date);
    
    return dayDiv;
}

function selectDate(date) {
    // Enlever la sélection précédente
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Sélectionner le nouveau jour
    event.target.closest('.calendar-day').classList.add('selected');
    selectedDate = date;
    
    // Mettre à jour les créneaux disponibles
    updateTodaySlots(date);
}

function getAppointmentsForDate(date) {
    const dateString = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateString);
}

function updateCurrentMonthDisplay() {
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const currentMonthElement = document.getElementById('currentMonth');
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    updateCurrentMonthDisplay();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    updateCurrentMonthDisplay();
}

function goToToday() {
    currentDate = new Date();
    renderCalendar();
    updateCurrentMonthDisplay();
    selectDate(currentDate);
}

// ========== GESTION DES RENDEZ-VOUS ==========

function openAppointmentModal(appointment = null) {
    const modal = document.getElementById('appointmentModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (appointment) {
        modalTitle.textContent = 'Modifier Rendez-vous';
        fillAppointmentForm(appointment);
    } else {
        modalTitle.textContent = 'Nouveau Rendez-vous';
        clearAppointmentForm();
        
        // Pré-remplir la date si une date est sélectionnée
        if (selectedDate) {
            document.getElementById('appointmentDate').value = selectedDate.toISOString().split('T')[0];
            updateAvailableTimeSlots();
        }
    }
    
    modal.style.display = 'flex';
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').style.display = 'none';
}

function initializeAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const dateInput = document.getElementById('appointmentDate');
    
    // Mettre la date minimum à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Listener pour changement de date
    dateInput.addEventListener('change', updateAvailableTimeSlots);
    
    // Gestionnaire de soumission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveAppointment();
    });
}

function updateAvailableTimeSlots() {
    const dateInput = document.getElementById('appointmentDate');
    const timeSelect = document.getElementById('appointmentTime');
    const selectedDateStr = dateInput.value;
    
    if (!selectedDateStr) return;
    
    // Vider les options existantes
    timeSelect.innerHTML = '<option value="">Sélectionner l\'heure</option>';
    
    // Générer les créneaux disponibles
    const availableSlots = generateTimeSlots(selectedDateStr);
    
    availableSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.time;
        option.textContent = `${slot.time} ${slot.available ? '' : '(Occupé)'}`;
        option.disabled = !slot.available;
        timeSelect.appendChild(option);
    });
}

function generateTimeSlots(dateStr) {
    const slots = [];
    const selectedDate = new Date(dateStr);
    const dayOfWeek = selectedDate.getDay();
    
    // Vérifier si c'est un jour de travail
    if (!availability.workDays.includes(dayOfWeek)) {
        return slots;
    }
    
    // Générer les créneaux horaires
    const startTime = availability.startTime;
    const endTime = availability.endTime;
    const duration = availability.slotDuration;
    
    let currentTime = timeToMinutes(startTime);
    const endTimeMinutes = timeToMinutes(endTime);
    
    while (currentTime < endTimeMinutes) {
        const timeStr = minutesToTime(currentTime);
        const isAvailable = !isTimeSlotBooked(dateStr, timeStr);
        
        slots.push({
            time: timeStr,
            available: isAvailable
        });
        
        currentTime += duration;
    }
    
    return slots;
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function isTimeSlotBooked(date, time) {
    return appointments.some(apt => apt.date === date && apt.time === time);
}

function saveAppointment() {
    const formData = {
        id: Date.now().toString(),
        coachee: document.getElementById('appointmentCoachee').value,
        type: document.getElementById('appointmentType').value,
        date: document.getElementById('appointmentDate').value,
        time: document.getElementById('appointmentTime').value,
        duration: parseInt(document.getElementById('appointmentDuration').value),
        mode: document.getElementById('appointmentMode').value,
        notes: document.getElementById('appointmentNotes').value,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Validation
    if (!formData.coachee || !formData.type || !formData.date || !formData.time) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Ajouter à la liste des rendez-vous
    appointments.push(formData);
    
    // Sauvegarder dans localStorage
    saveAppointments();
    
    // Mettre à jour l'affichage
    renderCalendar();
    renderAppointmentsList();
    
    // Fermer le modal
    closeAppointmentModal();
    
    // Notification
    showNotification(`Rendez-vous planifié avec ${formData.coachee} le ${formatDate(formData.date)} à ${formData.time}`, 'success');
}

function fillAppointmentForm(appointment) {
    document.getElementById('appointmentCoachee').value = appointment.coachee;
    document.getElementById('appointmentType').value = appointment.type;
    document.getElementById('appointmentDate').value = appointment.date;
    document.getElementById('appointmentTime').value = appointment.time;
    document.getElementById('appointmentDuration').value = appointment.duration;
    document.getElementById('appointmentMode').value = appointment.mode;
    document.getElementById('appointmentNotes').value = appointment.notes || '';
}

function clearAppointmentForm() {
    document.getElementById('appointmentForm').reset();
    document.getElementById('appointmentTime').innerHTML = '<option value="">Sélectionner l\'heure</option>';
}

function viewAppointment(appointment) {
    // Ouvrir le modal en mode édition
    openAppointmentModal(appointment);
}

function deleteAppointment(appointmentId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
        appointments = appointments.filter(apt => apt.id !== appointmentId);
        saveAppointments();
        renderCalendar();
        renderAppointmentsList();
        showNotification('Rendez-vous supprimé', 'info');
    }
}

// ========== GESTION DES DISPONIBILITÉS ==========

function manageAvailability() {
    const modal = document.getElementById('availabilityModal');
    
    // Charger les valeurs actuelles
    document.getElementById('workStartTime').value = availability.startTime;
    document.getElementById('workEndTime').value = availability.endTime;
    
    // Charger les jours de travail
    const days = ['workMonday', 'workTuesday', 'workWednesday', 'workThursday', 'workFriday', 'workSaturday'];
    days.forEach((dayId, index) => {
        document.getElementById(dayId).checked = availability.workDays.includes(index + 1);
    });
    
    modal.style.display = 'flex';
}

function closeAvailabilityModal() {
    document.getElementById('availabilityModal').style.display = 'none';
}

function saveAvailability() {
    // Récupérer les nouvelles valeurs
    availability.startTime = document.getElementById('workStartTime').value;
    availability.endTime = document.getElementById('workEndTime').value;
    
    // Récupérer les jours de travail
    const workDays = [];
    const days = ['workMonday', 'workTuesday', 'workWednesday', 'workThursday', 'workFriday', 'workSaturday'];
    days.forEach((dayId, index) => {
        if (document.getElementById(dayId).checked) {
            workDays.push(index + 1);
        }
    });
    availability.workDays = workDays;
    
    // Sauvegarder
    localStorage.setItem('coach_availability', JSON.stringify(availability));
    
    // Fermer le modal
    closeAvailabilityModal();
    
    // Notification
    showNotification('Disponibilités mises à jour', 'success');
}

// ========== GESTION DES VUES ==========

function toggleView() {
    const calendarView = document.getElementById('calendarView');
    const listView = document.getElementById('listView');
    const viewIcon = document.getElementById('viewIcon');
    const viewText = document.getElementById('viewText');
    
    if (currentView === 'calendar') {
        calendarView.style.display = 'none';
        listView.style.display = 'block';
        viewIcon.className = 'fas fa-calendar-alt';
        viewText.textContent = 'Vue Calendrier';
        currentView = 'list';
        renderAppointmentsList();
    } else {
        calendarView.style.display = 'block';
        listView.style.display = 'none';
        viewIcon.className = 'fas fa-list';
        viewText.textContent = 'Vue Liste';
        currentView = 'calendar';
    }
}

function renderAppointmentsList() {
    const container = document.getElementById('appointmentsList');
    
    // Trier les rendez-vous par date et heure
    const sortedAppointments = [...appointments].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });
    
    if (sortedAppointments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <p class="text-muted">Aucun rendez-vous planifié</p>
                <button class="btn btn-primary" onclick="openAppointmentModal()">
                    <i class="fas fa-plus"></i> Planifier un rendez-vous
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    sortedAppointments.forEach(appointment => {
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
        
        const stepName = stepNames[appointment.type] || 'Session de coaching';
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        const isPast = appointmentDate < new Date();
        const statusClass = isPast ? 'border-secondary' : 'border-primary';
        
        html += `
            <div class="card mb-3 ${statusClass}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="card-title">
                                <i class="fas fa-user text-primary"></i>
                                ${appointment.coachee}
                            </h6>
                            <p class="card-text mb-2">
                                <strong>${stepName}</strong><br>
                                <i class="fas fa-calendar text-muted"></i> ${formatDate(appointment.date)}<br>
                                <i class="fas fa-clock text-muted"></i> ${appointment.time} - ${calculateEndTime(appointment.time, appointment.duration)}<br>
                                <i class="fas fa-${appointment.mode === 'visio' ? 'video' : appointment.mode === 'presentiel' ? 'map-marker-alt' : 'phone'} text-muted"></i> 
                                ${appointment.mode === 'visio' ? 'Visioconférence' : appointment.mode === 'presentiel' ? 'Présentiel' : 'Téléphone'}
                            </p>
                            ${appointment.notes ? `<p class="text-muted small">${appointment.notes}</p>` : ''}
                        </div>
                        <div class="btn-group-vertical">
                            <button class="btn btn-sm btn-outline-primary mb-1" onclick="startSession('${appointment.coachee}', '${appointment.type}')">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary mb-1" onclick="viewAppointment(${JSON.stringify(appointment).replace(/"/g, '&quot;')})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteAppointment('${appointment.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateTodaySlots(date) {
    const container = document.getElementById('todaySlots');
    if (!container) return;
    
    const dateStr = date.toISOString().split('T')[0];
    const slots = generateTimeSlots(dateStr);
    
    if (slots.length === 0) {
        container.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-bed text-muted fa-2x mb-2"></i>
                <p class="text-muted mb-0">Jour non travaillé</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    slots.forEach(slot => {
        const slotClass = slot.available ? 'available' : 'booked';
        const appointment = appointments.find(apt => apt.date === dateStr && apt.time === slot.time);
        
        html += `
            <div class="time-slot ${slotClass}">
                <div>
                    <strong>${slot.time}</strong>
                    ${appointment ? `<br><small>${appointment.coachee}</small>` : ''}
                </div>
                <div>
                    ${slot.available ? 
                        `<button class="btn btn-sm btn-success" onclick="quickBookSlot('${dateStr}', '${slot.time}')">
                            <i class="fas fa-plus"></i>
                        </button>` : 
                        `<span class="badge bg-danger">Occupé</span>`
                    }
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function quickBookSlot(date, time) {
    selectedDate = new Date(date);
    document.getElementById('appointmentDate').value = date;
    document.getElementById('appointmentTime').innerHTML = `<option value="${time}" selected>${time}</option>`;
    openAppointmentModal();
}

// ========== FONCTIONS UTILITAIRES ==========

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateEndTime(startTime, duration) {
    const start = timeToMinutes(startTime);
    const end = start + duration;
    return minutesToTime(end);
}

function startSession(coacheeName, stepType) {
    // Rediriger vers la page de session
    window.location.href = `session.html?name=${encodeURIComponent(coacheeName)}&step=${stepType}`;
}

// ========== SAUVEGARDE / CHARGEMENT ==========

function saveAppointments() {
    localStorage.setItem('coach_appointments', JSON.stringify(appointments));
}

function loadAppointments() {
    const saved = localStorage.getItem('coach_appointments');
    if (saved) {
        appointments = JSON.parse(saved);
    } else {
        // Données de démonstration
        appointments = [
            {
                id: '1',
                coachee: 'Marie Dupont',
                type: '9',
                date: '2024-12-15',
                time: '10:00',
                duration: 60,
                mode: 'visio',
                notes: 'Préparation entretien chez TechCorp',
                status: 'confirmed'
            },
            {
                id: '2',
                coachee: 'Thomas Martin',
                type: '4',
                date: '2024-12-16',
                time: '14:00',
                duration: 90,
                mode: 'presentiel',
                notes: 'Révision complète du CV',
                status: 'confirmed'
            }
        ];
    }
}

function loadAvailability() {
    const saved = localStorage.getItem('coach_availability');
    if (saved) {
        availability = JSON.parse(saved);
    }
}

// ========== NOTIFICATIONS ==========

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-success' : 
                   type === 'error' ? 'bg-danger' : 'bg-info';
    
    notification.className = `position-fixed top-0 end-0 m-3 alert ${bgColor} text-white alert-dismissible fade show`;
    notification.style.zIndex = '2050';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Suppression automatique après 4 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}
