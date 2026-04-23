// --- State Management ---
let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
let userName = localStorage.getItem('dashboard_user_name') || "User";
let isDark = localStorage.getItem('dashboard_theme') === 'dark';

// --- FITUR: Dark Mode ---
function applyTheme() {
    document.body.classList.toggle('dark-mode', isDark);
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('dashboard_theme', isDark ? 'dark' : 'light');
}

function toggleDarkMode() {
    isDark = !isDark;
    applyTheme();
}

// --- FITUR: Nama Khusus ---
function updateGreeting() {
    const now = new Date();
    let greeting = "Selamat Malam";
    const hr = now.getHours();
    if (hr < 12) greeting = "Selamat Pagi";
    else if (hr < 15) greeting = "Selamat Siang";
    else if (hr < 18) greeting = "Selamat Sore";
    
    document.getElementById('greeting-text').textContent = greeting;
    document.getElementById('user-name').textContent = userName;
}

function changeName() {
    const newName = prompt("Siapa nama Anda?", userName);
    if (newName) {
        userName = newName.trim() || "User";
        localStorage.setItem('dashboard_user_name', userName);
        updateGreeting();
    }
}

// --- FITUR: Pomodoro Variable ---
let timerInterval;
let defaultDuration = 25 * 60;
let timeLeft = defaultDuration;

function setTimerDuration(mins) {
    stopTimer();
    defaultDuration = mins * 60;
    timeLeft = defaultDuration;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById('timer-display').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function startTimer() {
    if (timerInterval) return;
    document.getElementById('btn-start').classList.add('active');
    timerInterval = setInterval(() => {
        if (timeLeft > 0) { timeLeft--; updateTimerDisplay(); }
        else { stopTimer(); alert("Waktu fokus selesai!"); }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    document.querySelectorAll('.btn-timer').forEach(b => b.classList.remove('active'));
}

function resetTimer() {
    stopTimer();
    timeLeft = defaultDuration;
    updateTimerDisplay();
}

// --- FITUR: Anti Duplikat ---
function addTask() {
    const input = document.getElementById('task-input');
    const errorMsg = document.getElementById('task-error');
    const text = input.value.trim();

    if (!text) return;
    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        errorMsg.classList.remove('hidden');
        return;
    }

    errorMsg.classList.add('hidden');
    tasks.push({ text: text, completed: false });
    input.value = '';
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach((t, i) => {
        const li = document.createElement('li');
        li.className = "flex items-center justify-between p-2 border-b border-gray-200";
        li.innerHTML = `
            <div class="flex items-center space-x-3">
                <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${i})">
                <span class="${t.completed ? 'task-done' : ''}">${t.text}</span>
            </div>
            <button onclick="deleteTask(${i})" class="text-red-400 hover:text-red-600">Hapus</button>
        `;
        list.appendChild(li);
    });
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
}

function toggleTask(i) { tasks[i].completed = !tasks[i].completed; renderTasks(); }
function deleteTask(i) { tasks.splice(i, 1); renderTasks(); }

// Init
function updateClock() {
    const now = new Date();
    document.getElementById('digital-clock').textContent = now.toLocaleTimeString('id-ID', {hour12:false});
    document.getElementById('current-date').textContent = now.toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
    updateGreeting();
}

setInterval(updateClock, 1000);
applyTheme(); // Load tema
renderTasks(); // Load tugas