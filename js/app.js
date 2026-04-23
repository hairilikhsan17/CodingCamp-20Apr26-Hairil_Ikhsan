// --- State Management ---
let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
let quickLinks = JSON.parse(localStorage.getItem('dashboard_links')) || [
    { name: "Google", url: "https://google.com" },
    { name: "GitHub", url: "https://github.com" }
];
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

// --- FITUR: Nama & Greeting ---
function updateGreeting() {
    const now = new Date();
    const hr = now.getHours();
    let greetingText = "Selamat Malam";
    
    if (hr < 12) greetingText = "Selamat Pagi";
    else if (hr < 15) greetingText = "Selamat Siang";
    else if (hr < 18) greetingText = "Selamat Sore";
    
    // Perbaikan: ID di HTML adalah 'greeting', di dalamnya ada 'user-name'
    const greetingContainer = document.getElementById('greeting');
    greetingContainer.innerHTML = `${greetingText}, <span id="user-name" onclick="changeName()" class="cursor-pointer border-b-2 border-indigo-400">${userName}</span>`;
}

function changeName() {
    const newName = prompt("Siapa nama Anda?", userName);
    if (newName !== null && newName.trim() !== "") {
        userName = newName.trim();
        localStorage.setItem('dashboard_user_name', userName);
        updateGreeting();
    }
}

// --- FITUR: Focus Timer (Pomodoro) ---
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
    document.getElementById('timer-display').textContent = 
        `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function startTimer() {
    if (timerInterval) return;
    document.getElementById('btn-start').classList.add('active');
    timerInterval = setInterval(() => {
        if (timeLeft > 0) { 
            timeLeft--; 
            updateTimerDisplay(); 
        } else { 
            stopTimer(); 
            alert("Waktu fokus selesai! Istirahat sejenak."); 
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('btn-start').classList.remove('active');
}

function resetTimer() {
    stopTimer();
    timeLeft = defaultDuration;
    updateTimerDisplay();
}

// --- FITUR: Task List ---
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
        li.className = "flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700";
        li.innerHTML = `
            <div class="flex items-center space-x-3">
                <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${i})" class="w-4 h-4 text-indigo-600">
                <span class="${t.completed ? 'task-done' : ''}">${t.text}</span>
            </div>
            <button onclick="deleteTask(${i})" class="text-red-400 hover:text-red-600 text-sm">Hapus</button>
        `;
        list.appendChild(li);
    });
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
}

function toggleTask(i) { tasks[i].completed = !tasks[i].completed; renderTasks(); }
function deleteTask(i) { tasks.splice(i, 1); renderTasks(); }

// --- FITUR: Quick Links ---
function addLink() {
    const nameInput = document.getElementById('link-name');
    const urlInput = document.getElementById('link-url');
    let url = urlInput.value.trim();

    if (!nameInput.value || !url) return;
    
    // Auto-fix URL jika tidak ada http
    if (!url.startsWith('http')) url = 'https://' + url;

    quickLinks.push({ name: nameInput.value, url: url });
    nameInput.value = '';
    urlInput.value = '';
    renderLinks();
}

function renderLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = '';
    quickLinks.forEach((link, i) => {
        const a = document.createElement('div');
        a.className = "group relative flex items-center";
        a.innerHTML = `
            <a href="${link.url}" target="_blank" class="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200 transition">
                ${link.name}
            </a>
            <button onclick="deleteLink(${i})" class="ml-1 text-xs text-gray-400 hover:text-red-500">×</button>
        `;
        container.appendChild(a);
    });
    localStorage.setItem('dashboard_links', JSON.stringify(quickLinks));
}

function deleteLink(i) {
    quickLinks.splice(i, 1);
    renderLinks();
}

// --- Digital Clock & Initialization ---
function updateClock() {
    const now = new Date();
    document.getElementById('digital-clock').textContent = now.toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    document.getElementById('current-date').textContent = now.toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    updateGreeting();
}

// Jalankan saat pertama kali load
setInterval(updateClock, 1000);
updateClock();
applyTheme();
renderTasks();
renderLinks();