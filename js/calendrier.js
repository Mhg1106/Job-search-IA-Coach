// js/calendrier.js - VERSION FINALE HARMONISÉE - VÉRIFIÉE

document.addEventListener('DOMContentLoaded', function() {
    console.log("Exécution de calendrier.js - Version du 21 Juin");

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
        if (!DataStorage.KEYS.APPOINTMENTS) DataStorage.KEYS.APPOINTMENTS = 'jobsearch_appointments';
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
        let startDate = new Date(firstDayOfMonth);
        let startDayOfWeek = startDate.getDay();
        if (startDayOfWeek === 0) startDayOfWeek = 7;
        startDate.setDate(startDate.getDate() - (startDayOfWeek - 1));

        const headers = Array.from(calendarGrid.querySelectorAll('.calendar-header'));
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
        dayDiv.className = 'calendar-day p-2 flex flex-col';
        dayDiv.dataset.date = date.toISOString().split('T')[0];

        if (date.getMonth() !== currentMonth) dayDiv.classList.add('other-month', 'bg-gray-50');
        
        const dayNumberDiv = document.createElement('div');
        dayNumberDiv.className = 'day-number self-start mb-1';
        dayNumberDiv.textContent = date.getDate();
        if (date.toDateString() === new Date().toDateString()) {
             dayNumberDiv.classList.add('bg-blue-500', 'text-white', 'rounded-full', 'w-7', 'h-7', 'flex', 'items-center', 'justify-center');
        }
        dayDiv.appendChild(dayNumberDiv);
        
        const appointmentsContainer = document.createElement('div');
        appointmentsContainer.className = 'flex-grow overflow-y-auto';
        const dayAppointments = appointments.filter(apt => apt.date === dayDiv.dataset.date);
        dayAppointments.forEach(apt => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'appointment text-xs p-1 rounded mb-1';
            appointmentDiv.textContent = `${apt.time} ${apt.coachee}`;
            appointmentDiv.dataset.id = apt.id;
            appointmentsContainer.appendChild(appointmentDiv);
        });
        dayDiv.appendChild(appointmentsContainer);

        return dayDiv;
    }

    // --- MODAL & FORM HANDLING ---
    function openModal(appointment = null, date = null) {
        form.reset();
        deleteBtn.classList.add('hidden');
        if (appointment) { // Edit mode
            modalTitle.textContent = 'Modifier le Rendez-vous';
            appointmentIdInput.value = appointment.id;
            coacheeSelect.value = appointment.coachee;
            typeSelect.value = appointment.type;
            dateInput.value = appointment.date;
            timeInput.value = appointment.time;
            notesInput.value = appointment.notes;
            deleteBtn.classList.remove('hidden');
        } else { // Add mode
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

        if (id) {
            appointments = appointments.map(apt => apt.id === id ? { ...apt, ...appointmentData } : apt);
        } else {
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
