// js/calendrier.js - VERSION FINALE HARMONISÉE

document.addEventListener('DOMContentLoaded', function() {

    // --- STATE & CONFIG ---
    let currentDate = new Date();
    let appointments = [];

    // --- DOM ELEMENTS ---
    const calendarGrid = document.getElementById('calendar-grid');
    const monthDisplay = document.getElementById('current-month-display');
    const modal = document.getElementById('appointment-modal');
    const form = document.getElementById('appointment-form');
    const modalTitle = document.getElementById('modal-title');
    const appointmentIdInput = document.getElementById('appointment-id');
    const coacheeSelect = document.getElementById('appointment-coachee');
    const typeSelect = document.getElementById('appointment-type');
    const dateInput = document.getElementById('appointment-date');
    const timeInput = document.getElementById('appointment-time');
    const notesInput = document.getElementById('appointment-notes');
    const deleteBtn = document.getElementById('delete-appointment-btn');

    // --- INITIALIZATION ---
    function initializeApp() {
        // Ajouter une clé pour les RDV dans DataStorage si elle n'existe pas
        if (!DataStorage.KEYS.APPOINTMENTS) {
            DataStorage.KEYS.APPOINTMENTS = 'jobsearch_appointments';
        }

        appointments = DataStorage.get(DataStorage.KEYS.APPOINTMENTS, []);
        
        populateCoacheeSelect();
        populateTypeSelect();
        setupEventListeners();
        renderCalendar();
    }

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        document.getElementById('prev-month-btn').addEventListener('click', () => changeMonth(-1));
        document.getElementById('next-month-btn').addEventListener('click', () => changeMonth(1));
        document.getElementById('today-btn').addEventListener('click', goToToday);
        document.getElementById('add-appointment-btn').addEventListener('click', () => openModal());
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
        deleteBtn.addEventListener('click', handleDelete);
        form.addEventListener('submit', handleFormSubmit);

        calendarGrid.addEventListener('click', (event) => {
            const dayElement = event.target.closest('.calendar-day');
            const appointmentElement = event.target.closest('.appointment');

            if (appointmentElement) {
                event.stopPropagation();
                const appointmentId = appointmentElement.dataset.id;
                const appointment = appointments.find(a => a.id === appointmentId);
                if(appointment) openModal(appointment);
            } else if (dayElement) {
                const date = new Date(dayElement.dataset.date);
                openModal(null, date);
            }
        });
    }

    // --- CALENDAR RENDERING ---
    function renderCalendar() {
        monthDisplay.textContent = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        let startDate = new Date(firstDayOfMonth);
        let startDayOfWeek = startDate.getDay(); // 0=Dim, 1=Lun, ...
        if (startDayOfWeek === 0) startDayOfWeek = 7; // Mettre Dimanche à 7
        startDate.setDate(startDate.getDate() - (startDayOfWeek - 1));

        const headers = calendarGrid.querySelectorAll('.calendar-header');
        calendarGrid.innerHTML = '';
        headers.forEach(header => calendarGrid.appendChild(header));

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            calendarGrid.appendChild(createDayElement(date, currentDate.getMonth()));
        }
    }

    function createDayElement(date, currentMonth) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.dataset.date = date.toISOString();

        if (date.getMonth() !== currentMonth) {
            dayDiv.classList.add('other-month');
        }
        if (date.toDateString() === new Date().toDateString()) {
            dayDiv.classList.add('today');
        }

        dayDiv.innerHTML = `<div class="day-number">${date.getDate()}</div>`;
        
        const dayAppointments = appointments.filter(apt => new Date(apt.date).toDateString() === date.toDateString());
        dayAppointments.forEach(apt => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'appointment';
            appointmentDiv.textContent = `${apt.time} - ${apt.coachee}`;
            appointmentDiv.dataset.id = apt.id;
            dayDiv.appendChild(appointmentDiv);
        });

        return dayDiv;
    }

    // --- MODAL & FORM HANDLING ---
    function openModal(appointment = null, date = null) {
        form.reset();
        deleteBtn.classList.add('hidden');
        if (appointment) { // Mode édition
            modalTitle.textContent = 'Modifier le Rendez-vous';
            appointmentIdInput.value = appointment.id;
            coacheeSelect.value = appointment.coachee;
            typeSelect.value = appointment.type;
            dateInput.value = appointment.date;
            timeInput.value = appointment.time;
            notesInput.value = appointment.notes;
            deleteBtn.classList.remove('hidden');
        } else { // Mode ajout
            modalTitle.textContent = 'Nouveau Rendez-vous';
            appointmentIdInput.value = '';
            if (date) {
                dateInput.value = date.toISOString().split('T')[0];
            }
        }
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const id = appointmentIdInput.value;
        const appointmentData = {
            coachee: coacheeSelect.value,
            type: typeSelect.value,
            date: dateInput.value,
            time: timeInput.value,
            notes: notesInput.value,
        };

        if (id) { // Update
            appointments = appointments.map(apt => apt.id === id ? { ...apt, ...appointmentData } : apt);
        } else { // Create
            appointments.push({ ...appointmentData, id: 'apt-' + Date.now() });
        }

        DataStorage.save(DataStorage.KEYS.APPOINTMENTS, appointments);
        renderCalendar();
        closeModal();
    }

    function handleDelete() {
        const id = appointmentIdInput.value;
        if (id && confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
            appointments = appointments.filter(apt => apt.id !== id);
            DataStorage.save(DataStorage.KEYS.APPOINTMENTS, appointments);
            renderCalendar();
            closeModal();
        }
    }

    // --- DYNAMIC POPULATION ---
    function populateCoacheeSelect() {
        const coachees = DataStorage.get(DataStorage.KEYS.COACHEDS);
        coacheeSelect.innerHTML = '<option value="">Sélectionner un coaché</option>';
        coachees.forEach(coachee => {
            coacheeSelect.innerHTML += `<option value="${coachee.name}">${coachee.name}</option>`;
        });
    }

    function populateTypeSelect() {
        const prompts = DataStorage.get(DataStorage.KEYS.PROMPTS);
        typeSelect.innerHTML = '<option value="">Type de session</option>';
        prompts.forEach(prompt => {
            typeSelect.innerHTML += `<option value="${prompt.title}">${prompt.title}</option>`;
        });
         typeSelect.innerHTML += `<option value="Autre">Autre</option>`;
    }

    // --- NAVIGATION ---
    function changeMonth(offset) {
        currentDate.setMonth(currentDate.getMonth() + offset);
        renderCalendar();
    }

    function goToToday() {
        currentDate = new Date();
        renderCalendar();
    }

    // --- START ---
    initializeApp();
});
