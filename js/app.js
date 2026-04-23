/* ================================================
   TO-DO LIFE DASHBOARD — script.js
   Features: Clock, Greeting, Pomodoro, To-Do, Quick Links,
             Dark Mode, Custom Name, Timer Duration, Sort Tasks
   ================================================ */

"use strict";

/* ---- DOM REFS ---- */
const $ = id => document.getElementById(id);

const clockEl      = $("clock");
const greetingEl   = $("greeting");
const dateEl       = $("currentDate");
const themeToggle  = $("themeToggle");
const editNameBtn  = $("editNameBtn");
const nameEdit     = $("nameEdit");
const nameInput    = $("nameInput");
const saveNameBtn  = $("saveNameBtn");

const timerDisplay  = $("timerDisplay");
const timerDuration = $("timerDuration");
const startBtn      = $("startBtn");
const stopBtn       = $("stopBtn");
const resetBtn      = $("resetBtn");

const taskInput    = $("taskInput");
const addTaskBtn   = $("addTaskBtn");
const taskList     = $("taskList");
const sortSelect   = $("sortSelect");
const statPending  = $("statPending");
const statDone     = $("statDone");

const editOverlay   = $("editOverlay");
const editTaskInput = $("editTaskInput");
const saveEditBtn   = $("saveEditBtn");
const cancelEditBtn = $("cancelEditBtn");

const linkName   = $("linkName");
const linkUrl    = $("linkUrl");
const addLinkBtn = $("addLinkBtn");
const linksGrid  = $("linksGrid");

/* ---- LOCAL STORAGE ---- */
const LS = {
  get:  key       => JSON.parse(localStorage.getItem(key)),
  set:  (key, v)  => localStorage.setItem(key, JSON.stringify(v)),
};

/* ================================================
   THEME
   ================================================ */
function initTheme() {
  const t = LS.get("theme") || "light";
  document.documentElement.setAttribute("data-theme", t);
  themeToggle.textContent = t === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const cur  = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
  LS.set("theme", next);
});

/* ================================================
   CLOCK, DATE & GREETING
   ================================================ */
const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function pad(n) { return String(n).padStart(2, "0"); }

function getGreeting(h) {
  if (h >= 5  && h <= 11) return "Good Morning 🌤";
  if (h >= 12 && h <= 17) return "Good Afternoon ☀️";
  if (h >= 18 && h <= 21) return "Good Evening 🌆";
  return "Good Night 🌙";
}

function updateClock() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  clockEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  greetingEl.textContent = getGreeting(h);
  dateEl.textContent = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

setInterval(updateClock, 1000);
updateClock();

/* ================================================
   CUSTOM NAME
   ================================================ */
function initName() {
  const name = LS.get("userName");
  // We show greeting text only, name not used in this layout (greeting handles it)
  if (name) greetingEl.dataset.name = name;
}

editNameBtn.addEventListener("click", () => {
  nameEdit.classList.toggle("hidden");
  nameInput.value = LS.get("userName") || "";
  if (!nameEdit.classList.contains("hidden")) nameInput.focus();
});

saveNameBtn.addEventListener("click", saveName);
nameInput.addEventListener("keydown", e => { if (e.key === "Enter") saveName(); });

function saveName() {
  const val = nameInput.value.trim();
  if (!val) return;
  LS.set("userName", val);
  nameEdit.classList.add("hidden");
}

/* ================================================
   POMODORO TIMER
   ================================================ */
let timerInterval = null;
let timerRunning  = false;
let totalSecs     = 0;
let remainSecs    = 0;

function initTimer() {
  const mins    = parseInt(timerDuration.value) || 25;
  totalSecs     = mins * 60;
  remainSecs    = totalSecs;
  timerDisplay.textContent = formatTime(remainSecs);
}

function formatTime(s) {
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

function tick() {
  if (remainSecs <= 0) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerDisplay.textContent = "00:00";
    alert("⏱ Focus session complete! Take a break.");
    initTimer();
    return;
  }
  remainSecs--;
  timerDisplay.textContent = formatTime(remainSecs);
}

startBtn.addEventListener("click", () => {
  if (timerRunning) return;
  timerRunning  = true;
  timerInterval = setInterval(tick, 1000);
});

stopBtn.addEventListener("click", () => {
  if (!timerRunning) return;
  timerRunning = false;
  clearInterval(timerInterval);
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerRunning = false;
  initTimer();
});

timerDuration.addEventListener("change", () => {
  if (!timerRunning) initTimer();
});

initTimer();

/* ================================================
   TO-DO LIST
   ================================================ */
let tasks     = LS.get("tasks") || [];
let editingId = null;

function escHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function renderTasks() {
  taskList.innerHTML = "";

  let list = [...tasks];

  if (sortSelect.value === "active")    list.sort((a,b) => Number(a.completed) - Number(b.completed));
  if (sortSelect.value === "completed") list.sort((a,b) => Number(b.completed) - Number(a.completed));

  if (list.length === 0) {
    taskList.innerHTML = `<li class="empty-msg">No tasks yet. Add one above!</li>`;
  } else {
    list.forEach(t => {
      const li = document.createElement("li");
      li.className = `task-item${t.completed ? " completed" : ""}`;
      li.innerHTML = `
        <input type="checkbox" class="task-cb" ${t.completed ? "checked" : ""} data-id="${t.id}" />
        <span class="task-text">${escHtml(t.text)}</span>
        <div class="task-actions">
          <button class="btn-edit"   data-id="${t.id}">Edit</button>
          <button class="btn-delete" data-id="${t.id}">Delete</button>
        </div>`;
      taskList.appendChild(li);
    });
  }

  // Update stats
  const done    = tasks.filter(t => t.completed).length;
  const pending = tasks.length - done;
  statPending.textContent = `${pending} pending`;
  statDone.textContent    = `${done} done`;
}

function saveTasks() { LS.set("tasks", tasks); renderTasks(); }

/* Add task */
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  // Duplicate check
  if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
    taskInput.style.borderColor = "#ef4444";
    taskInput.placeholder = "⚠ Task already exists!";
    setTimeout(() => {
      taskInput.style.borderColor = "";
      taskInput.placeholder = "Add a new task...";
    }, 1800);
    return;
  }

  tasks.push({ id: Date.now(), text, completed: false });
  taskInput.value = "";
  saveTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });

/* Task list click delegation */
taskList.addEventListener("change", e => {
  if (!e.target.classList.contains("task-cb")) return;
  const id   = Number(e.target.dataset.id);
  const task = tasks.find(t => t.id === id);
  if (task) { task.completed = e.target.checked; saveTasks(); }
});

taskList.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("btn-edit")) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    editingId = id;
    editTaskInput.value = task.text;
    editOverlay.classList.remove("hidden");
    editTaskInput.focus();
    return;
  }

  if (e.target.classList.contains("btn-delete")) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
  }
});

/* Sort */
sortSelect.addEventListener("change", renderTasks);

/* Edit modal */
saveEditBtn.addEventListener("click", saveEdit);
editTaskInput.addEventListener("keydown", e => { if (e.key === "Enter") saveEdit(); });

function saveEdit() {
  const text = editTaskInput.value.trim();
  if (!text || editingId === null) return;
  if (tasks.some(t => t.id !== editingId && t.text.toLowerCase() === text.toLowerCase())) {
    editTaskInput.style.borderColor = "#ef4444";
    return;
  }
  const task = tasks.find(t => t.id === editingId);
  if (task) task.text = text;
  editingId = null;
  editOverlay.classList.add("hidden");
  saveTasks();
}

cancelEditBtn.addEventListener("click", () => {
  editingId = null;
  editOverlay.classList.add("hidden");
});

editOverlay.addEventListener("click", e => {
  if (e.target === editOverlay) {
    editingId = null;
    editOverlay.classList.add("hidden");
  }
});

/* ================================================
   QUICK LINKS
   ================================================ */
let links = LS.get("links") || [];

function renderLinks() {
  linksGrid.innerHTML = "";

  if (links.length === 0) {
    linksGrid.innerHTML = `<span class="no-links">No links saved yet.</span>`;
    return;
  }

  links.forEach(link => {
    const chip = document.createElement("span");
    chip.className = "link-chip";

    const a = document.createElement("a");
    a.href   = link.url;
    a.target = "_blank";
    a.rel    = "noopener noreferrer";
    a.textContent = escHtml(link.name);

    const x = document.createElement("button");
    x.className   = "link-x";
    x.textContent = "×";
    x.title = "Remove";
    x.addEventListener("click", e => {
      e.preventDefault();
      links = links.filter(l => l.id !== link.id);
      saveLinks();
    });

    chip.appendChild(a);
    chip.appendChild(x);
    linksGrid.appendChild(chip);
  });
}

function saveLinks() { LS.set("links", links); renderLinks(); }

function addLink() {
  const name = linkName.value.trim();
  let   url  = linkUrl.value.trim();
  if (!name || !url) return;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try { new URL(url); } catch {
    linkUrl.style.borderColor = "#ef4444";
    setTimeout(() => { linkUrl.style.borderColor = ""; }, 1600);
    return;
  }
  links.push({ id: Date.now(), name, url });
  linkName.value = "";
  linkUrl.value  = "";
  saveLinks();
}

addLinkBtn.addEventListener("click", addLink);
linkUrl.addEventListener("keydown",  e => { if (e.key === "Enter") addLink(); });
linkName.addEventListener("keydown", e => { if (e.key === "Enter") addLink(); });

/* ================================================
   INIT
   ================================================ */
(function init() {
  initTheme();
  initName();
  renderTasks();
  renderLinks();
})();
// placeholder
