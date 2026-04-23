/* ================================================
   STATE & INITIALIZATION
   ================================================ */
let tasks = JSON.parse(localStorage.getItem("pp_tasks")) || [];
let links = JSON.parse(localStorage.getItem("pp_links")) || [];
let userName = localStorage.getItem("pp_name") || "User";
let isDark = localStorage.getItem("pp_theme") === "dark";

let timerInterval = null;
let timeLeft = 25 * 60;
let defaultMins = 25;
let editingIdx = null;

/* ================================================
   THEME MANAGEMENT
   ================================================ */
function toggleDarkMode() {
    isDark = !isDark;
    applyTheme();
    // Update greeting color immediately after theme toggle
    updateClock();
}

function applyTheme() {
    const greetingEl = document.getElementById("greeting");
    if (isDark) {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        document.getElementById("theme-icon").textContent = "☀️";
        if (greetingEl) {
            greetingEl.classList.replace("text-gray-800", "text-white");
        }
        localStorage.setItem("pp_theme", "dark");
    } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
        document.getElementById("theme-icon").textContent = "🌙";
        if (greetingEl) {
            greetingEl.classList.replace("text-white", "text-gray-800");
        }
        localStorage.setItem("pp_theme", "light");
    }
}

/* ================================================
   CLOCK & DATE
   ================================================ */
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('id-ID', options);

    document.getElementById("digital-clock").textContent = `${h}:${m}:${s}`;
    document.getElementById("current-date").textContent = dateStr;

    // Greeting logic
    let greetingText = "Selamat Malam";
    if (now.getHours() < 12) greetingText = "Selamat Pagi";
    else if (now.getHours() < 15) greetingText = "Selamat Siang";
    else if (now.getHours() < 18) greetingText = "Selamat Sore";

    // Dynamic text color for greeting based on theme
    const textColorClass = isDark ? "text-white" : "text-gray-800";
    const greetingEl = document.getElementById("greeting");
    
    if (greetingEl) {
        greetingEl.className = `text-3xl font-semibold ${textColorClass}`;
        greetingEl.innerHTML = 
            `${greetingText}, <span id="user-name" onclick="changeName()" class="cursor-pointer border-b-2 border-indigo-400">${userName}</span>`;
    }
}

function changeName() {
    const newName = prompt("Masukkan nama Anda:", userName);
    if (newName) {
        userName = newName.trim();
        localStorage.setItem("pp_name", userName);
        updateClock();
    }
}

/* ================================================
   FOCUS TIMER
   ================================================ */
function setTimerDuration(mins) {
    stopTimer();
    defaultMins = mins;
    timeLeft = mins * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById("timer-display").textContent = 
        `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            stopTimer();
            alert("Waktu fokus selesai!");
        }
    }, 1000);
    document.getElementById("btn-start").classList.add("bg-indigo-600", "text-white");
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("btn-start").classList.remove("bg-indigo-600", "text-white");
}

function resetTimer() {
    stopTimer();
    timeLeft = defaultMins * 60;
    updateTimerDisplay();
}

/* ================================================
   TASK MANAGEMENT
   ================================================ */
function addTask() {
    const input = document.getElementById("task-input");
    const text = input.value.trim();
    if (!text) return;

    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        const err = document.getElementById("task-error");
        err.classList.remove("hidden");
        setTimeout(() => err.classList.add("hidden"), 2000);
        return;
    }

    tasks.push({ text, completed: false });
    input.value = "";
    saveAndRenderTasks();
}

function toggleTask(idx) {
    tasks[idx].completed = !tasks[idx].completed;
    saveAndRenderTasks();
}

function deleteTask(idx) {
    tasks.splice(idx, 1);
    saveAndRenderTasks();
}

function openEdit(idx) {
    editingIdx = idx;
    document.getElementById("edit-input").value = tasks[idx].text;
    document.getElementById("edit-overlay").classList.replace("hidden", "flex");
}

function closeEdit() {
    document.getElementById("edit-overlay").classList.replace("flex", "hidden");
    editingIdx = null;
}

function saveEdit() {
    const newVal = document.getElementById("edit-input").value.trim();
    if (newVal && editingIdx !== null) {
        tasks[editingIdx].text = newVal;
        closeEdit();
        saveAndRenderTasks();
    }
}

function saveAndRenderTasks() {
    localStorage.setItem("pp_tasks", JSON.stringify(tasks));
    const list = document.getElementById("task-list");
    list.innerHTML = tasks.length ? "" : '<li class="text-gray-400 text-center py-4">Belum ada tugas.</li>';
    
    tasks.forEach((t, i) => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${i})" class="w-5 h-5 rounded border-gray-300">
                <span class="${t.completed ? 'line-through' : ''} ${isDark ? 'text-white' : 'text-gray-800'}">${t.text}</span>
            </div>
            <div class="flex gap-2">
                <button onclick="openEdit(${i})" class="text-xs text-blue-500">Edit</button>
                <button onclick="deleteTask(${i})" class="text-xs text-red-500">Hapus</button>
            </div>
        `;
        list.appendChild(li);
    });
}

/* ================================================
   QUICK LINKS
   ================================================ */
function addLink() {
    const nameInp = document.getElementById("link-name");
    const urlInp = document.getElementById("link-url");
    let name = nameInp.value.trim();
    let url = urlInp.value.trim();

    if (!name || !url) return;
    if (!url.startsWith("http")) url = "https://" + url;

    links.push({ name, url });
    nameInp.value = "";
    urlInp.value = "";
    saveAndRenderLinks();
}

function removeLink(idx) {
    links.splice(idx, 1);
    saveAndRenderLinks();
}

function saveAndRenderLinks() {
    localStorage.setItem("pp_links", JSON.stringify(links));
    const container = document.getElementById("links-container");
    container.innerHTML = links.length ? "" : '<span class="text-gray-400 text-sm">Belum ada link.</span>';

    links.forEach((l, i) => {
        const chip = document.createElement("div");
        chip.className = "link-chip";
        chip.innerHTML = `
            <a href="${l.url}" target="_blank">${l.name}</a>
            <button onclick="removeLink(${i})" class="ml-1 hover:text-red-200">×</button>
        `;
        container.appendChild(chip);
    });
}

/* ================================================
   INIT
   ================================================ */
setInterval(updateClock, 1000);
updateClock();
applyTheme();
saveAndRenderTasks();
saveAndRenderLinks();