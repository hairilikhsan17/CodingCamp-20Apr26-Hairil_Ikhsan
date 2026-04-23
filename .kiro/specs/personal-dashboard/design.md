# Dokumen Desain Teknis — Personal Dashboard

## Ikhtisar

Personal Dashboard adalah aplikasi web statis satu halaman (*Single Page Application*) yang berjalan sepenuhnya di browser tanpa backend. Aplikasi dibangun dengan HTML5, CSS3, dan Vanilla JavaScript murni — tidak ada framework, tidak ada build tool, tidak ada server.

Pengguna membuka `index.html` langsung dari sistem file atau melalui browser, dan seluruh data (tugas, tautan) disimpan secara persisten di `localStorage` browser. Empat widget mandiri ditampilkan sekaligus dalam satu layar: **Greeting**, **Focus Timer**, **To-Do List**, dan **Quick Links**.

### Tujuan Desain

- **Zero-dependency**: tidak ada npm, tidak ada CDN eksternal, tidak ada koneksi jaringan yang diperlukan.
- **Modular tapi satu file JS**: setiap widget dikelola oleh modul fungsi tersendiri di dalam `js/app.js`.
- **Responsif**: layout menyesuaikan diri dari 320px hingga 1920px menggunakan CSS Grid dan media query.
- **Persisten**: data To-Do dan Quick Links bertahan melewati reload halaman via `localStorage`.

---

## Arsitektur

### Struktur File

```
personal-dashboard/
├── index.html          ← satu-satunya file HTML, titik masuk aplikasi
├── css/
│   └── style.css       ← satu-satunya file CSS
└── js/
    └── app.js          ← satu-satunya file JavaScript
```

### Arsitektur Aplikasi

Aplikasi menggunakan pola **Module Pattern** berbasis fungsi di dalam satu file JS. Tidak ada class ES6 yang diperlukan — setiap widget adalah sekumpulan fungsi yang beroperasi pada elemen DOM dan state lokal.

```
app.js
├── Inisialisasi (DOMContentLoaded)
│   ├── greetingInit()
│   ├── focusTimerInit()
│   ├── todoInit()
│   └── quickLinksInit()
│
├── Modul Greeting
│   ├── greetingInit()
│   ├── updateClock()
│   └── getGreetingText(hour)
│
├── Modul Focus Timer
│   ├── focusTimerInit()
│   ├── startTimer()
│   ├── stopTimer()
│   ├── resetTimer()
│   ├── tick()
│   └── updateTimerDisplay(seconds)
│
├── Modul To-Do List
│   ├── todoInit()
│   ├── addTask(text)
│   ├── toggleTask(id)
│   ├── editTask(id, newText)
│   ├── deleteTask(id)
│   ├── renderTasks()
│   ├── saveTasks()
│   └── loadTasks()
│
├── Modul Quick Links
│   ├── quickLinksInit()
│   ├── addLink(name, url)
│   ├── deleteLink(id)
│   ├── normalizeUrl(url)
│   ├── renderLinks()
│   ├── saveLinks()
│   └── loadLinks()
│
└── Utilitas
    ├── generateId()
    └── escapeHtml(str)
```

### Alur Data

```
Browser Load
    │
    ▼
DOMContentLoaded
    │
    ├─► greetingInit() ──► setInterval(updateClock, 1000)
    │
    ├─► focusTimerInit() ──► state timer lokal (interval ID, sisa detik)
    │
    ├─► todoInit() ──► loadTasks() ◄──► localStorage["pd_tasks"]
    │                      │
    │                  renderTasks() ──► DOM
    │
    └─► quickLinksInit() ──► loadLinks() ◄──► localStorage["pd_links"]
                                 │
                             renderLinks() ──► DOM
```

---

## Komponen dan Antarmuka

### 1. Modul Greeting

Bertanggung jawab menampilkan jam, tanggal, dan teks sapaan yang diperbarui setiap detik.

#### Fungsi-fungsi Utama

| Fungsi | Deskripsi |
|---|---|
| `greetingInit()` | Memanggil `updateClock()` sekali, lalu mendaftarkan `setInterval(updateClock, 1000)` |
| `updateClock()` | Membaca `new Date()`, memformat jam/tanggal, memanggil `getGreetingText()`, memperbarui DOM |
| `getGreetingText(hour)` | Menerima angka jam (0–23), mengembalikan string sapaan sesuai rentang waktu |

#### Logika Sapaan

```
getGreetingText(hour):
  if hour >= 5  && hour <= 11  → "Selamat Pagi"
  if hour >= 12 && hour <= 17  → "Selamat Siang"
  if hour >= 18 && hour <= 20  → "Selamat Sore"
  else (21–23, 0–4)            → "Selamat Malam"
```

#### Elemen DOM yang Dikelola

- `#clock` — menampilkan HH:MM:SS
- `#date-display` — menampilkan "Senin, 14 Juli 2025"
- `#greeting-text` — menampilkan teks sapaan

---

### 2. Modul Focus Timer

Mengelola state timer hitung mundur 25 menit dengan tiga tombol kontrol.

#### State Internal

```javascript
// State lokal di dalam closure focusTimerInit()
let intervalId = null;       // ID dari setInterval, null jika tidak berjalan
let remainingSeconds = 1500; // 25 * 60 = 1500 detik
const TOTAL_SECONDS = 1500;
```

#### Fungsi-fungsi Utama

| Fungsi | Deskripsi |
|---|---|
| `focusTimerInit()` | Menginisialisasi state, memasang event listener pada tiga tombol |
| `startTimer()` | Mengatur `intervalId = setInterval(tick, 1000)`, menonaktifkan tombol Mulai, mengaktifkan tombol Berhenti |
| `stopTimer()` | Memanggil `clearInterval(intervalId)`, mengatur `intervalId = null`, memperbarui state tombol |
| `resetTimer()` | Memanggil `stopTimer()`, mengatur `remainingSeconds = TOTAL_SECONDS`, memperbarui tampilan |
| `tick()` | Mengurangi `remainingSeconds` sebesar 1; jika mencapai 0, memanggil `onTimerComplete()` |
| `updateTimerDisplay(seconds)` | Mengonversi detik ke format MM:SS, memperbarui elemen `#timer-display` |
| `onTimerComplete()` | Memanggil `stopTimer()`, menampilkan notifikasi (browser `alert` atau elemen modal) |

#### Alur State Tombol

```
State: STOPPED
  Tombol Mulai   → enabled
  Tombol Berhenti → disabled
  Tombol Reset   → enabled

State: RUNNING
  Tombol Mulai   → disabled
  Tombol Berhenti → enabled
  Tombol Reset   → enabled
```

#### Elemen DOM yang Dikelola

- `#timer-display` — menampilkan MM:SS
- `#btn-start` — tombol Mulai
- `#btn-stop` — tombol Berhenti
- `#btn-reset` — tombol Reset

---

### 3. Modul To-Do List

Mengelola CRUD task dengan persistensi ke `localStorage`.

#### Fungsi-fungsi Utama

| Fungsi | Deskripsi |
|---|---|
| `todoInit()` | Memuat task dari storage, merender daftar, memasang event listener pada form input |
| `addTask(text)` | Memvalidasi input (tidak boleh kosong/whitespace), membuat objek task baru, menyimpan, merender ulang |
| `toggleTask(id)` | Membalik nilai `completed` pada task dengan `id` yang sesuai, menyimpan, merender ulang |
| `editTask(id, newText)` | Memvalidasi `newText` tidak kosong, memperbarui `text` task, menyimpan, merender ulang |
| `deleteTask(id)` | Menghapus task dari array berdasarkan `id`, menyimpan, merender ulang |
| `renderTasks()` | Mengosongkan container, membuat elemen DOM untuk setiap task dalam array |
| `saveTasks()` | Memanggil `localStorage.setItem("pd_tasks", JSON.stringify(tasks))` |
| `loadTasks()` | Memanggil `localStorage.getItem("pd_tasks")`, mem-parse JSON, mengembalikan array (default `[]`) |

#### Alur Interaksi Pengguna

```
Tambah Task:
  Pengguna ketik teks → tekan Enter atau klik "Tambah"
    → addTask(text)
      → validasi: teks kosong? → batalkan, tidak ada perubahan
      → buat objek task baru
      → push ke array tasks
      → saveTasks()
      → renderTasks()
      → kosongkan input field

Edit Task:
  Pengguna klik "Edit" pada task
    → tampilkan input inline dengan nilai teks saat ini
    → pengguna ubah teks → klik "Simpan"
      → editTask(id, newText)
        → validasi: teks kosong? → batalkan, kembalikan teks lama
        → perbarui task.text
        → saveTasks()
        → renderTasks()

Toggle Task:
  Pengguna klik tombol centang
    → toggleTask(id)
      → balik task.completed
      → saveTasks()
      → renderTasks()

Hapus Task:
  Pengguna klik "Hapus"
    → deleteTask(id)
      → filter array
      → saveTasks()
      → renderTasks()
```

#### Elemen DOM yang Dikelola

- `#todo-input` — kolom input teks task baru
- `#btn-add-task` — tombol Tambah
- `#todo-list` — container `<ul>` untuk daftar task

---

### 4. Modul Quick Links

Mengelola daftar tautan favorit dengan persistensi ke `localStorage`.

#### Fungsi-fungsi Utama

| Fungsi | Deskripsi |
|---|---|
| `quickLinksInit()` | Memuat link dari storage, merender daftar, memasang event listener pada form |
| `addLink(name, url)` | Memvalidasi kedua field tidak kosong, memanggil `normalizeUrl()`, menyimpan, merender ulang |
| `deleteLink(id)` | Menghapus link dari array berdasarkan `id`, menyimpan, merender ulang |
| `normalizeUrl(url)` | Jika URL tidak diawali `http://` atau `https://`, tambahkan `https://` di depan |
| `renderLinks()` | Mengosongkan container, membuat elemen kartu/tombol untuk setiap link |
| `saveLinks()` | Memanggil `localStorage.setItem("pd_links", JSON.stringify(links))` |
| `loadLinks()` | Memanggil `localStorage.getItem("pd_links")`, mem-parse JSON, mengembalikan array (default `[]`) |

#### Alur Interaksi Pengguna

```
Tambah Link:
  Pengguna isi nama dan URL → klik "Tambah"
    → addLink(name, url)
      → validasi: nama kosong? → tampilkan pesan error pada field nama
      → validasi: URL kosong? → tampilkan pesan error pada field URL
      → normalizeUrl(url)
      → buat objek link baru
      → push ke array links
      → saveLinks()
      → renderLinks()
      → kosongkan form input

Buka Link:
  Pengguna klik kartu link
    → window.open(link.url, "_blank")

Hapus Link:
  Pengguna klik tombol "Hapus" pada kartu
    → deleteLink(id)
      → filter array
      → saveLinks()
      → renderLinks()
```

#### Elemen DOM yang Dikelola

- `#link-name-input` — kolom input nama link
- `#link-url-input` — kolom input URL link
- `#btn-add-link` — tombol Tambah
- `#links-container` — container untuk kartu-kartu link
- `.error-msg` — elemen pesan error per field

---

## Model Data

### Struktur Data di localStorage

Aplikasi menggunakan dua key di `localStorage`:

#### `pd_tasks` — Array of Task Objects

```json
[
  {
    "id": "task_1720944000000_4f2a",
    "text": "Selesaikan laporan mingguan",
    "completed": false,
    "createdAt": 1720944000000
  },
  {
    "id": "task_1720944060000_9b1c",
    "text": "Review pull request tim",
    "completed": true,
    "createdAt": 1720944060000
  }
]
```

| Field | Tipe | Deskripsi |
|---|---|---|
| `id` | `string` | ID unik: `"task_" + Date.now() + "_" + random4hex` |
| `text` | `string` | Deskripsi tugas, tidak boleh kosong atau hanya whitespace |
| `completed` | `boolean` | `false` = belum selesai, `true` = sudah selesai |
| `createdAt` | `number` | Unix timestamp (ms) saat task dibuat |

#### `pd_links` — Array of Link Objects

```json
[
  {
    "id": "link_1720944000000_3d7e",
    "name": "GitHub",
    "url": "https://github.com",
    "createdAt": 1720944000000
  },
  {
    "id": "link_1720944120000_a5f8",
    "name": "MDN Web Docs",
    "url": "https://developer.mozilla.org",
    "createdAt": 1720944120000
  }
]
```

| Field | Tipe | Deskripsi |
|---|---|---|
| `id` | `string` | ID unik: `"link_" + Date.now() + "_" + random4hex` |
| `name` | `string` | Label tampilan link, tidak boleh kosong |
| `url` | `string` | URL tujuan, sudah dinormalisasi dengan `https://` jika perlu |
| `createdAt` | `number` | Unix timestamp (ms) saat link dibuat |

### Fungsi Utilitas

```javascript
// Menghasilkan ID unik sederhana
function generateId(prefix) {
  const rand = Math.random().toString(16).slice(2, 6);
  return `${prefix}_${Date.now()}_${rand}`;
}

// Mencegah XSS saat menyisipkan teks ke innerHTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
```

---

## Layout dan Struktur HTML

### Struktur Semantik `index.html`

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal Dashboard</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main class="dashboard">

    <!-- Widget 1: Greeting -->
    <section class="widget widget--greeting" id="widget-greeting">
      <p id="greeting-text">Selamat Pagi</p>
      <h1 id="clock">00:00:00</h1>
      <p id="date-display">Senin, 14 Juli 2025</p>
    </section>

    <!-- Widget 2: Focus Timer -->
    <section class="widget widget--timer" id="widget-timer">
      <h2 class="widget__title">Focus Timer</h2>
      <div id="timer-display" class="timer__display">25:00</div>
      <div class="timer__controls">
        <button id="btn-start">Mulai</button>
        <button id="btn-stop" disabled>Berhenti</button>
        <button id="btn-reset">Reset</button>
      </div>
    </section>

    <!-- Widget 3: To-Do List -->
    <section class="widget widget--todo" id="widget-todo">
      <h2 class="widget__title">To-Do List</h2>
      <div class="todo__input-group">
        <input type="text" id="todo-input" placeholder="Tambah tugas baru..." autocomplete="off">
        <button id="btn-add-task">Tambah</button>
      </div>
      <ul id="todo-list" class="todo__list"></ul>
    </section>

    <!-- Widget 4: Quick Links -->
    <section class="widget widget--links" id="widget-links">
      <h2 class="widget__title">Quick Links</h2>
      <div class="links__form">
        <div class="links__field">
          <input type="text" id="link-name-input" placeholder="Nama (contoh: GitHub)" autocomplete="off">
          <span class="error-msg" id="error-link-name"></span>
        </div>
        <div class="links__field">
          <input type="text" id="link-url-input" placeholder="URL (contoh: github.com)" autocomplete="off">
          <span class="error-msg" id="error-link-url"></span>
        </div>
        <button id="btn-add-link">Tambah</button>
      </div>
      <div id="links-container" class="links__container"></div>
    </section>

  </main>

  <script src="js/app.js"></script>
</body>
</html>
```

### Hierarki Kelas CSS

```
.dashboard                  ← grid container utama
  .widget                   ← base style semua widget (card)
    .widget--greeting       ← modifier untuk widget greeting
    .widget--timer          ← modifier untuk widget timer
    .widget--todo           ← modifier untuk widget to-do
    .widget--links          ← modifier untuk widget quick links
  .widget__title            ← judul tiap widget
  .timer__display           ← tampilan angka timer besar
  .timer__controls          ← grup tombol timer
  .todo__input-group        ← grup input + tombol tambah task
  .todo__list               ← daftar <ul> task
  .todo__item               ← satu baris task <li>
  .todo__item--completed    ← modifier task yang sudah selesai
  .links__form              ← form tambah link
  .links__field             ← wrapper input + pesan error
  .links__container         ← grid kartu link
  .link-card                ← satu kartu link
  .error-msg                ← pesan error validasi
```

---

## Pendekatan CSS

### CSS Custom Properties (Variabel)

```css
:root {
  /* Warna */
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-primary: #38bdf8;
  --color-primary-dark: #0284c7;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-danger: #f87171;
  --color-success: #4ade80;
  --color-border: #334155;

  /* Tipografi */
  --font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-size-base: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 2rem;
  --font-size-clock: clamp(2.5rem, 8vw, 5rem);

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Border */
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;

  /* Shadow */
  --shadow-card: 0 4px 6px -1px rgba(0,0,0,0.3);
}
```

### Layout Responsif dengan CSS Grid

```css
/* Mobile-first: 1 kolom */
.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
  padding: var(--space-md);
  min-height: 100vh;
}

/* Tablet: 2 kolom */
@media (min-width: 640px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
    padding: var(--space-xl);
  }
}

/* Desktop: 2x2 grid */
@media (min-width: 1024px) {
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto auto;
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Wide screen: 4 kolom */
@media (min-width: 1440px) {
  .dashboard {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Strategi CSS Lainnya

- **Reset minimal**: `box-sizing: border-box`, margin/padding 0 pada elemen dasar.
- **Tema gelap**: warna latar belakang gelap (`--color-bg`) sebagai default, tidak ada toggle tema.
- **Transisi**: `transition: all 0.15s ease` pada tombol dan kartu untuk respons visual < 100ms.
- **Aksesibilitas**: `:focus-visible` outline yang jelas, kontras warna memenuhi WCAG AA.
- **Task selesai**: `.todo__item--completed span { text-decoration: line-through; opacity: 0.5; }`

---

## Penanganan Error

### Validasi Input

| Skenario | Penanganan |
|---|---|
| Task input kosong/whitespace | Tidak menambahkan task; input field tetap fokus |
| Edit task menjadi kosong | Tidak menyimpan; mengembalikan teks lama; keluar dari mode edit |
| Link name kosong | Menampilkan pesan error di `#error-link-name`; tidak menyimpan |
| Link URL kosong | Menampilkan pesan error di `#error-link-url`; tidak menyimpan |
| URL tanpa protokol | `normalizeUrl()` menambahkan `https://` secara otomatis |

### Penanganan localStorage

```javascript
// Wrapper aman untuk localStorage
function safeGetItem(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Gagal membaca localStorage[${key}]:`, e);
    return defaultValue;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Gagal menulis localStorage[${key}]:`, e);
    // Tampilkan notifikasi ringan ke pengguna jika storage penuh
  }
}
```

### Keamanan XSS

Semua teks yang dimasukkan pengguna (nama task, nama link) **tidak boleh** disisipkan langsung ke `innerHTML`. Gunakan `textContent` atau fungsi `escapeHtml()` untuk mencegah injeksi skrip.

---

## Strategi Pengujian

### Pendekatan Pengujian Ganda

Pengujian dilakukan dengan dua pendekatan yang saling melengkapi:

1. **Unit Test berbasis contoh** — memverifikasi perilaku spesifik dengan input konkret
2. **Property-based test** — memverifikasi properti universal yang berlaku untuk semua input valid

### Library yang Digunakan

- **Test runner**: [Vitest](https://vitest.dev/) (kompatibel dengan browser environment via jsdom)
- **Property-based testing**: [fast-check](https://fast-check.io/) — library PBT untuk JavaScript/TypeScript
- **Minimum iterasi per property test**: 100 iterasi

### Cakupan Unit Test

Setiap modul diuji secara terisolasi dengan mock DOM minimal:

| Modul | Skenario yang Diuji |
|---|---|
| `getGreetingText` | Setiap rentang jam (pagi, siang, sore, malam), nilai batas (5, 11, 12, 17, 18, 20, 21, 4) |
| `updateTimerDisplay` | Konversi 1500→"25:00", 0→"00:00", 90→"01:30", 61→"01:01" |
| `normalizeUrl` | URL dengan `https://`, dengan `http://`, tanpa protokol, string kosong |
| `addTask` / `loadTasks` | Tambah task, muat dari storage, task kosong ditolak |
| `toggleTask` | Toggle false→true, toggle true→false |
| `editTask` | Edit valid, edit dengan teks kosong (ditolak) |
| `deleteTask` | Hapus task yang ada, hapus task yang tidak ada (no-op) |
| `addLink` / `loadLinks` | Tambah link, muat dari storage, validasi field kosong |
| `deleteLink` | Hapus link yang ada |

### Cakupan Property-based Test

Setiap property test harus diberi tag komentar dengan format:
`// Feature: personal-dashboard, Property {N}: {deskripsi singkat}`

Konfigurasi fast-check: `fc.assert(fc.property(...), { numRuns: 100 })`

---

## Properti Kebenaran (Correctness Properties)

*Sebuah properti adalah karakteristik atau perilaku yang harus berlaku di semua eksekusi valid suatu sistem — pada dasarnya, pernyataan formal tentang apa yang seharusnya dilakukan sistem. Properti berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi mesin.*


### Properti 1: Format Waktu Selalu Zero-Padded

*Untuk semua* nilai jam (0–23), menit (0–59), dan detik (0–59) yang valid, fungsi format waktu SHALL menghasilkan string dengan tepat dua digit per komponen menggunakan zero-padding (contoh: jam 9, menit 5, detik 3 → "09:05:03").

**Validates: Requirements 1.1, 2.1**

---

### Properti 2: Sapaan Sesuai Rentang Jam

*Untuk semua* nilai jam valid (0–23), fungsi `getGreetingText(hour)` SHALL mengembalikan tepat satu dari empat teks sapaan sesuai rentang yang ditentukan:
- Jam 5–11 → "Selamat Pagi"
- Jam 12–17 → "Selamat Siang"
- Jam 18–20 → "Selamat Sore"
- Jam 21–23 dan 0–4 → "Selamat Malam"

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

---

### Properti 3: Reset Timer Selalu Mengembalikan ke Nilai Awal

*Untuk semua* state timer (berjalan atau berhenti, dengan sisa waktu berapapun), setelah `resetTimer()` dipanggil, nilai `remainingSeconds` SHALL selalu kembali ke 1500 (25:00) dan timer SHALL berhenti.

**Validates: Requirements 2.4**

---

### Properti 4: Task Valid Selalu Ditambahkan ke Daftar

*Untuk semua* string teks yang mengandung setidaknya satu karakter non-whitespace, memanggil `addTask(text)` SHALL menambahkan tepat satu task baru ke daftar, sehingga panjang daftar bertambah satu dan task tersebut dapat ditemukan di daftar.

**Validates: Requirements 3.2**

---

### Properti 5: Input Whitespace Ditolak oleh Validasi Task

*Untuk semua* string yang hanya terdiri dari karakter whitespace (spasi, tab, newline) atau string kosong, memanggil `addTask(text)` SHALL menolak penambahan dan daftar task SHALL tetap tidak berubah.

**Validates: Requirements 3.3**

---

### Properti 6: Toggle Task adalah Operasi Round-Trip

*Untuk semua* task dengan status `completed` apapun (true atau false), memanggil `toggleTask(id)` dua kali berturut-turut SHALL mengembalikan status `completed` task ke nilai semula.

**Validates: Requirements 3.4, 3.5**

---

### Properti 7: Edit Task Valid Memperbarui Teks

*Untuk semua* task yang ada dan semua string teks baru yang valid (non-whitespace), memanggil `editTask(id, newText)` SHALL memperbarui `task.text` menjadi `newText` dan nilai lama SHALL tidak lagi tersimpan.

**Validates: Requirements 3.7**

---

### Properti 8: Edit dengan Teks Kosong Tidak Mengubah Task

*Untuk semua* task yang ada dan semua string yang hanya berisi whitespace atau kosong, memanggil `editTask(id, emptyText)` SHALL menolak perubahan dan `task.text` SHALL tetap sama dengan nilai sebelumnya.

**Validates: Requirements 3.8**

---

### Properti 9: Hapus Task Menghilangkan Task dari Daftar

*Untuk semua* daftar task yang tidak kosong dan semua task yang ada di dalamnya, memanggil `deleteTask(id)` SHALL menghasilkan daftar yang tidak mengandung task dengan `id` tersebut, dan panjang daftar SHALL berkurang satu.

**Validates: Requirements 3.9**

---

### Properti 10: Persistensi Task adalah Round-Trip yang Sempurna

*Untuk semua* array task yang valid (termasuk array kosong), memanggil `saveTasks()` diikuti `loadTasks()` SHALL menghasilkan array yang identik secara struktural dengan array semula (semua field `id`, `text`, `completed`, `createdAt` terjaga).

**Validates: Requirements 3.10, 3.11**

---

### Properti 11: normalizeUrl Selalu Menghasilkan URL dengan Protokol

*Untuk semua* string URL yang tidak diawali dengan `http://` atau `https://`, memanggil `normalizeUrl(url)` SHALL menghasilkan string yang diawali dengan `https://` dan diikuti oleh URL asli.

*Untuk semua* string URL yang sudah diawali dengan `http://` atau `https://`, memanggil `normalizeUrl(url)` SHALL mengembalikan URL tanpa modifikasi.

**Validates: Requirements 4.5**

---

### Properti 12: Hapus Link Menghilangkan Link dari Daftar

*Untuk semua* daftar link yang tidak kosong dan semua link yang ada di dalamnya, memanggil `deleteLink(id)` SHALL menghasilkan daftar yang tidak mengandung link dengan `id` tersebut, dan panjang daftar SHALL berkurang satu.

**Validates: Requirements 4.7**

---

### Properti 13: Persistensi Link adalah Round-Trip yang Sempurna

*Untuk semua* array link yang valid (termasuk array kosong), memanggil `saveLinks()` diikuti `loadLinks()` SHALL menghasilkan array yang identik secara struktural dengan array semula (semua field `id`, `name`, `url`, `createdAt` terjaga).

**Validates: Requirements 4.8, 4.9**

---

### Properti 14: Jumlah Kartu Link Sesuai Panjang Array

*Untuk semua* array link dengan panjang N (termasuk N=0), memanggil `renderLinks()` SHALL menghasilkan tepat N elemen kartu link di dalam `#links-container`.

**Validates: Requirements 4.1**

