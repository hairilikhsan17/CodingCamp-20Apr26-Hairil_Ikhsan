// --- State Management (Local Storage) ---
let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
let quickLinks = JSON.parse(localStorage.getItem('dashboard_links')) || [];

function saveToStorage() {
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
    localStorage.setItem('dashboard_links', JSON.stringify(quickLinks));
}

// --- Jam Digital & Greeting ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('digital-clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('id-ID', options);

    let greeting = "Selamat Malam";
    if (now.getHours() < 12) greeting = "Selamat Pagi";
    else if (now.getHours() < 15) greeting = "Selamat Siang";
    else if (now.getHours() < 18) greeting = "Selamat Sore";
    document.getElementById('greeting').textContent = greeting;
}
setInterval(updateClock, 1000);
updateClock();

// --- Focus Timer ---
let timerInterval;
let timeLeft = 25 * 60;

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function setActiveButton(activeId) {
    const buttons = ['btn-start', 'btn-stop', 'btn-reset'];
    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (id === activeId) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function startTimer() {
    if (timerInterval) return;
    setActiveButton('btn-start');
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            stopTimer();
            alert("Waktu fokus selesai!");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    setActiveButton('btn-stop');
}

function resetTimer() {
    stopTimer();
    timeLeft = 25 * 60;
    updateTimerDisplay();
    setActiveButton('btn-reset');
}

// --- Task List Logic ---
function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = "flex items-center justify-between p-2 border-b last:border-0";
        li.innerHTML = `
            <div class="flex items-center space-x-3 overflow-hidden">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    onchange="toggleTask(${index})" class="w-5 h-5 accent-indigo-500 flex-shrink-0">
                <span class="text-gray-700 truncate ${task.completed ? 'task-done' : ''}">${task.text}</span>
            </div>
            <div class="flex items-center flex-shrink-0">
                <button onclick="editTask(${index})" class="btn-edit">Edit</button>
                <button onclick="deleteTask(${index})" class="btn-danger">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });
    saveToStorage();
}

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text: text, completed: false });
    input.value = '';
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function editTask(index) {
    const newText = prompt("Edit tugas:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        renderTasks();
    }
}

// --- Quick Links Logic ---
function renderLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = '';
    quickLinks.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = "flex items-center bg-indigo-500 text-white px-4 py-2 rounded-lg relative group transition-all hover:bg-indigo-600";
        div.innerHTML = `
            <a href="${link.url}" target="_blank" class="mr-2">${link.name}</a>
            <button onclick="deleteLink(${index})" class="ml-2 text-xs bg-indigo-700 hover:bg-red-500 rounded-full w-4 h-4 flex items-center justify-center transition-colors">×</button>
        `;
        container.appendChild(div);
    });
    saveToStorage();
}

function addLink() {
    const nameInput = document.getElementById('link-name');
    const urlInput = document.getElementById('link-url');
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (!name || !url) return;
    if (!url.startsWith('http')) url = 'https://' + url;

    quickLinks.push({ name: name, url: url });
    nameInput.value = '';
    urlInput.value = '';
    renderLinks();
}

function deleteLink(index) {
    quickLinks.splice(index, 1);
    renderLinks();
}

// Init App
document.getElementById('task-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
document.getElementById('link-url').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addLink();
});

// Load data on start
renderTasks();
renderLinks();