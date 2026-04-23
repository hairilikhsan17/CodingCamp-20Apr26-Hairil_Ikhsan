# Rencana Implementasi: Personal Dashboard

## Ikhtisar

Implementasi aplikasi web statis satu halaman menggunakan HTML5, CSS3, dan Vanilla JavaScript murni. Tidak ada framework, tidak ada build tool untuk runtime — hanya Vitest + fast-check untuk pengujian. Setiap widget diimplementasikan sebagai modul fungsi mandiri di dalam satu file `js/app.js`.

## Tasks

- [-] 1. Setup struktur proyek dan konfigurasi pengujian
  - Buat direktori `css/` dan `js/` di root proyek
  - Buat file kosong `index.html`, `css/style.css`, `js/app.js` sebagai placeholder
  - Inisialisasi `package.json` dengan `npm init -y`
  - Instal dependensi pengujian: `npm install --save-dev vitest @vitest/coverage-v8 jsdom fast-check`
  - Buat file konfigurasi `vitest.config.js` dengan environment `jsdom`
  - Buat direktori `tests/` dan file `tests/app.test.js` sebagai placeholder
  - _Requirements: 5.3_

- [ ] 2. Implementasi `index.html` — Struktur HTML lengkap
  - Tulis struktur HTML semantik sesuai desain: `<!DOCTYPE html>`, `<head>`, `<body>`
  - Tambahkan `<meta charset>`, `<meta viewport>`, `<title>Personal Dashboard`
  - Tambahkan `<link rel="stylesheet" href="css/style.css">`
  - Implementasikan widget Greeting: `#greeting-text`, `#clock`, `#date-display`
  - Implementasikan widget Focus Timer: `#timer-display`, `#btn-start`, `#btn-stop` (disabled), `#btn-reset`
  - Implementasikan widget To-Do List: `#todo-input`, `#btn-add-task`, `#todo-list`
  - Implementasikan widget Quick Links: `#link-name-input`, `#link-url-input`, `#btn-add-link`, `#links-container`, `#error-link-name`, `#error-link-url`
  - Tambahkan `<script src="js/app.js">` sebelum `</body>`
  - _Requirements: 5.1, 5.3, 5.6_

- [ ] 3. Implementasi `css/style.css` — Variabel dan reset dasar
  - Definisikan semua CSS Custom Properties di `:root` (warna, tipografi, spacing, border, shadow)
  - Implementasikan reset minimal: `*, *::before, *::after { box-sizing: border-box }`, margin/padding 0 pada `body` dan elemen dasar
  - Set `body` dengan `background-color: var(--color-bg)`, `color: var(--color-text)`, `font-family: var(--font-family)`
  - _Requirements: 5.1, 5.4_

- [ ] 4. Implementasi CSS — Layout grid responsif `.dashboard`
  - Implementasikan `.dashboard` sebagai CSS Grid container dengan `grid-template-columns: 1fr` (mobile-first)
  - Tambahkan media query `@media (min-width: 640px)` untuk 2 kolom (tablet)
  - Tambahkan media query `@media (min-width: 1024px)` untuk 2×2 grid dengan `max-width: 1200px` dan `margin: 0 auto`
  - Tambahkan media query `@media (min-width: 1440px)` untuk 4 kolom (wide screen)
  - _Requirements: 5.4_

- [ ] 5. Implementasi CSS — Style widget dasar dan semua komponen
  - Implementasikan `.widget` (card base): `background`, `border-radius`, `padding`, `box-shadow`, `transition`
  - Implementasikan `.widget__title` untuk judul tiap widget
  - Implementasikan style widget Greeting: `.widget--greeting`, `#clock` dengan `font-size: var(--font-size-clock)`, `#greeting-text`, `#date-display`
  - Implementasikan style widget Timer: `.widget--timer`, `.timer__display`, `.timer__controls`, style tombol Mulai/Berhenti/Reset
  - Implementasikan style widget To-Do: `.widget--todo`, `.todo__input-group`, `.todo__list`, `.todo__item`, `.todo__item--completed` (strikethrough + opacity)
  - Implementasikan style widget Quick Links: `.widget--links`, `.links__form`, `.links__field`, `.links__container` (grid kartu), `.link-card`, `.error-msg`
  - Implementasikan `:focus-visible` outline untuk aksesibilitas (WCAG AA)
  - Implementasikan `transition: all 0.15s ease` pada tombol dan kartu interaktif
  - _Requirements: 3.4, 4.1, 5.4, 5.5_

- [ ] 6. Implementasi `js/app.js` — Utilitas dan inisialisasi
  - Implementasikan fungsi `generateId(prefix)`: mengembalikan `"${prefix}_${Date.now()}_${rand4hex}"`
  - Implementasikan fungsi `escapeHtml(str)`: menggunakan `document.createTextNode` untuk mencegah XSS
  - Implementasikan fungsi `safeGetItem(key, defaultValue)`: wrapper `localStorage.getItem` dengan try-catch dan `JSON.parse`
  - Implementasikan fungsi `safeSetItem(key, value)`: wrapper `localStorage.setItem` dengan try-catch dan `JSON.stringify`
  - Tambahkan event listener `DOMContentLoaded` yang memanggil keempat fungsi init: `greetingInit()`, `focusTimerInit()`, `todoInit()`, `quickLinksInit()`
  - _Requirements: 5.1_

- [ ] 7. Implementasi modul Greeting
  - [ ] 7.1 Implementasikan fungsi `getGreetingText(hour)`
    - Kembalikan "Selamat Pagi" untuk jam 5–11
    - Kembalikan "Selamat Siang" untuk jam 12–17
    - Kembalikan "Selamat Sore" untuk jam 18–20
    - Kembalikan "Selamat Malam" untuk jam 21–23 dan 0–4
    - _Requirements: 1.3, 1.4, 1.5, 1.6_

  - [ ]* 7.2 Tulis property test untuk `getGreetingText` — Properti 2
    - **Properti 2: Sapaan Sesuai Rentang Jam**
    - Gunakan `fc.integer({ min: 0, max: 23 })` sebagai arbitrary
    - Verifikasi setiap jam menghasilkan tepat satu dari empat teks sapaan yang valid
    - Verifikasi pemetaan rentang jam sesuai spesifikasi
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

  - [ ] 7.3 Implementasikan fungsi `updateClock()`
    - Baca `new Date()` untuk mendapatkan jam, menit, detik, dan tanggal
    - Format jam sebagai HH:MM:SS dengan zero-padding (contoh: "09:05:03")
    - Format tanggal dalam Bahasa Indonesia (contoh: "Senin, 14 Juli 2025") menggunakan `toLocaleDateString('id-ID', {...})`
    - Perbarui `#clock`, `#date-display`, dan `#greeting-text` di DOM
    - _Requirements: 1.1, 1.2, 1.7_

  - [ ]* 7.4 Tulis property test untuk format waktu — Properti 1
    - **Properti 1: Format Waktu Selalu Zero-Padded**
    - Gunakan `fc.integer({ min: 0, max: 23 })`, `fc.integer({ min: 0, max: 59 })`, `fc.integer({ min: 0, max: 59 })` sebagai arbitrary
    - Ekstrak logika format waktu ke fungsi `formatTime(h, m, s)` yang dapat diuji secara terisolasi
    - Verifikasi setiap komponen selalu menghasilkan tepat 2 digit
    - **Validates: Requirements 1.1, 2.1**

  - [ ] 7.5 Implementasikan fungsi `greetingInit()`
    - Panggil `updateClock()` sekali saat inisialisasi
    - Daftarkan `setInterval(updateClock, 1000)` untuk pembaruan setiap detik
    - _Requirements: 1.7_

- [ ] 8. Implementasi modul Focus Timer
  - [ ] 8.1 Implementasikan state dan fungsi `updateTimerDisplay(seconds)`
    - Definisikan state lokal: `let intervalId = null`, `let remainingSeconds = 1500`, `const TOTAL_SECONDS = 1500`
    - Konversi detik ke format MM:SS: `Math.floor(seconds / 60)` dan `seconds % 60`, keduanya zero-padded
    - Perbarui elemen `#timer-display` di DOM
    - _Requirements: 2.1_

  - [ ]* 8.2 Tulis unit test untuk `updateTimerDisplay`
    - Test konversi: 1500 → "25:00", 0 → "00:00", 90 → "01:30", 61 → "01:01"
    - _Requirements: 2.1_

  - [ ] 8.3 Implementasikan fungsi `startTimer()`, `stopTimer()`, `resetTimer()`, dan `tick()`
    - `startTimer()`: set `intervalId = setInterval(tick, 1000)`, nonaktifkan `#btn-start`, aktifkan `#btn-stop`
    - `stopTimer()`: panggil `clearInterval(intervalId)`, set `intervalId = null`, perbarui state tombol
    - `resetTimer()`: panggil `stopTimer()`, set `remainingSeconds = TOTAL_SECONDS`, panggil `updateTimerDisplay(TOTAL_SECONDS)`
    - `tick()`: kurangi `remainingSeconds` sebesar 1, panggil `updateTimerDisplay`, jika 0 panggil `onTimerComplete()`
    - `onTimerComplete()`: panggil `stopTimer()`, tampilkan notifikasi sesi selesai
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 8.4 Tulis property test untuk `resetTimer` — Properti 3
    - **Properti 3: Reset Timer Selalu Mengembalikan ke Nilai Awal**
    - Gunakan `fc.integer({ min: 0, max: 1500 })` dan `fc.boolean()` untuk mensimulasikan berbagai state timer
    - Verifikasi `remainingSeconds === 1500` dan `intervalId === null` setelah `resetTimer()`
    - **Validates: Requirements 2.4**

  - [ ] 8.5 Implementasikan fungsi `focusTimerInit()`
    - Pasang event listener `click` pada `#btn-start` → `startTimer()`
    - Pasang event listener `click` pada `#btn-stop` → `stopTimer()`
    - Pasang event listener `click` pada `#btn-reset` → `resetTimer()`
    - Panggil `updateTimerDisplay(TOTAL_SECONDS)` untuk tampilan awal
    - _Requirements: 2.2, 2.3, 2.4_

- [ ] 9. Checkpoint — Pastikan semua tests lulus sejauh ini
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 10. Implementasi modul To-Do List — Fungsi inti
  - [ ] 10.1 Implementasikan `loadTasks()` dan `saveTasks()`
    - `loadTasks()`: gunakan `safeGetItem("pd_tasks", [])` untuk memuat array task dari localStorage
    - `saveTasks()`: gunakan `safeSetItem("pd_tasks", tasks)` untuk menyimpan array task
    - _Requirements: 3.10, 3.11_

  - [ ]* 10.2 Tulis property test untuk persistensi task — Properti 10
    - **Properti 10: Persistensi Task adalah Round-Trip yang Sempurna**
    - Gunakan `fc.array(fc.record({ id: fc.string(), text: fc.string(), completed: fc.boolean(), createdAt: fc.integer() }))` sebagai arbitrary
    - Verifikasi `loadTasks(saveTasks(arr))` menghasilkan array yang identik secara struktural
    - **Validates: Requirements 3.10, 3.11**

  - [ ] 10.3 Implementasikan `addTask(text)`
    - Validasi: jika `text.trim() === ""`, batalkan dan kembalikan tanpa perubahan
    - Buat objek task baru: `{ id: generateId("task"), text: text.trim(), completed: false, createdAt: Date.now() }`
    - Push ke array `tasks`, panggil `saveTasks()`, panggil `renderTasks()`
    - Kosongkan `#todo-input` setelah berhasil menambahkan
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 10.4 Tulis property test untuk `addTask` — Properti 4 dan 5
    - **Properti 4: Task Valid Selalu Ditambahkan ke Daftar**
    - Gunakan `fc.string().filter(s => s.trim().length > 0)` sebagai arbitrary untuk teks valid
    - Verifikasi panjang array bertambah satu dan task dapat ditemukan di daftar
    - **Validates: Requirements 3.2**
    - **Properti 5: Input Whitespace Ditolak oleh Validasi Task**
    - Gunakan `fc.stringOf(fc.constantFrom(' ', '\t', '\n'))` sebagai arbitrary untuk whitespace
    - Verifikasi array task tidak berubah setelah `addTask(whitespaceString)`
    - **Validates: Requirements 3.3**

  - [ ] 10.5 Implementasikan `toggleTask(id)`
    - Temukan task dengan `id` yang sesuai di array `tasks`
    - Balik nilai `task.completed` (true → false, false → true)
    - Panggil `saveTasks()` dan `renderTasks()`
    - _Requirements: 3.4, 3.5_

  - [ ]* 10.6 Tulis property test untuk `toggleTask` — Properti 6
    - **Properti 6: Toggle Task adalah Operasi Round-Trip**
    - Gunakan `fc.boolean()` sebagai arbitrary untuk status `completed` awal
    - Verifikasi memanggil `toggleTask(id)` dua kali berturut-turut mengembalikan status ke nilai semula
    - **Validates: Requirements 3.4, 3.5**

  - [ ] 10.7 Implementasikan `editTask(id, newText)`
    - Validasi: jika `newText.trim() === ""`, batalkan dan kembalikan tanpa perubahan (pertahankan teks lama)
    - Temukan task dengan `id` yang sesuai, perbarui `task.text = newText.trim()`
    - Panggil `saveTasks()` dan `renderTasks()`
    - _Requirements: 3.7, 3.8_

  - [ ]* 10.8 Tulis property test untuk `editTask` — Properti 7 dan 8
    - **Properti 7: Edit Task Valid Memperbarui Teks**
    - Gunakan `fc.string().filter(s => s.trim().length > 0)` sebagai arbitrary untuk teks baru yang valid
    - Verifikasi `task.text` diperbarui dan teks lama tidak lagi tersimpan
    - **Validates: Requirements 3.7**
    - **Properti 8: Edit dengan Teks Kosong Tidak Mengubah Task**
    - Gunakan `fc.stringOf(fc.constantFrom(' ', '\t', '\n'))` sebagai arbitrary
    - Verifikasi `task.text` tetap sama dengan nilai sebelumnya
    - **Validates: Requirements 3.8**

  - [ ] 10.9 Implementasikan `deleteTask(id)`
    - Filter array `tasks` untuk menghapus task dengan `id` yang sesuai: `tasks = tasks.filter(t => t.id !== id)`
    - Panggil `saveTasks()` dan `renderTasks()`
    - _Requirements: 3.9_

  - [ ]* 10.10 Tulis property test untuk `deleteTask` — Properti 9
    - **Properti 9: Hapus Task Menghilangkan Task dari Daftar**
    - Gunakan `fc.array(fc.record({...}), { minLength: 1 })` sebagai arbitrary untuk daftar tidak kosong
    - Verifikasi task dengan `id` tersebut tidak ada di daftar setelah `deleteTask(id)` dan panjang array berkurang satu
    - **Validates: Requirements 3.9**

- [ ] 11. Implementasi modul To-Do List — Render dan event listener
  - [ ] 11.1 Implementasikan `renderTasks()`
    - Kosongkan `#todo-list` (`innerHTML = ""`)
    - Untuk setiap task di array `tasks`, buat elemen `<li class="todo__item">` (tambahkan `todo__item--completed` jika `completed === true`)
    - Gunakan `escapeHtml()` untuk teks task sebelum disisipkan ke DOM
    - Tambahkan tombol centang (toggle), tombol "Edit", dan tombol "Hapus" pada setiap item
    - Mode edit: klik "Edit" mengganti teks dengan `<input>` inline dan tombol "Simpan"
    - _Requirements: 3.4, 3.6_

  - [ ] 11.2 Implementasikan `todoInit()`
    - Inisialisasi array `tasks` dengan memanggil `loadTasks()`
    - Panggil `renderTasks()` untuk tampilan awal
    - Pasang event listener `click` pada `#btn-add-task` → `addTask(#todo-input.value)`
    - Pasang event listener `keydown` pada `#todo-input` → jika `event.key === "Enter"`, panggil `addTask()`
    - _Requirements: 3.1, 3.2, 3.11_

- [ ] 12. Implementasi modul Quick Links — Fungsi inti
  - [ ] 12.1 Implementasikan `loadLinks()` dan `saveLinks()`
    - `loadLinks()`: gunakan `safeGetItem("pd_links", [])` untuk memuat array link dari localStorage
    - `saveLinks()`: gunakan `safeSetItem("pd_links", links)` untuk menyimpan array link
    - _Requirements: 4.8, 4.9_

  - [ ]* 12.2 Tulis property test untuk persistensi link — Properti 13
    - **Properti 13: Persistensi Link adalah Round-Trip yang Sempurna**
    - Gunakan `fc.array(fc.record({ id: fc.string(), name: fc.string(), url: fc.string(), createdAt: fc.integer() }))` sebagai arbitrary
    - Verifikasi `loadLinks(saveLinks(arr))` menghasilkan array yang identik secara struktural
    - **Validates: Requirements 4.8, 4.9**

  - [ ] 12.3 Implementasikan `normalizeUrl(url)`
    - Jika `url` tidak diawali `http://` atau `https://`, tambahkan `https://` di depan
    - Jika sudah diawali `http://` atau `https://`, kembalikan tanpa modifikasi
    - _Requirements: 4.5_

  - [ ]* 12.4 Tulis property test untuk `normalizeUrl` — Properti 11
    - **Properti 11: normalizeUrl Selalu Menghasilkan URL dengan Protokol**
    - Gunakan `fc.webUrl()` dan `fc.string()` sebagai arbitrary untuk berbagai format URL
    - Verifikasi URL tanpa protokol selalu mendapat awalan `https://`
    - Verifikasi URL dengan `http://` atau `https://` tidak dimodifikasi
    - **Validates: Requirements 4.5**

  - [ ] 12.5 Implementasikan `addLink(name, url)`
    - Validasi: jika `name.trim() === ""`, tampilkan pesan error di `#error-link-name` dan batalkan
    - Validasi: jika `url.trim() === ""`, tampilkan pesan error di `#error-link-url` dan batalkan
    - Panggil `normalizeUrl(url.trim())` untuk normalisasi URL
    - Buat objek link baru: `{ id: generateId("link"), name: name.trim(), url: normalizedUrl, createdAt: Date.now() }`
    - Push ke array `links`, panggil `saveLinks()`, panggil `renderLinks()`
    - Kosongkan form input setelah berhasil menambahkan
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [ ] 12.6 Implementasikan `deleteLink(id)`
    - Filter array `links` untuk menghapus link dengan `id` yang sesuai: `links = links.filter(l => l.id !== id)`
    - Panggil `saveLinks()` dan `renderLinks()`
    - _Requirements: 4.7_

  - [ ]* 12.7 Tulis property test untuk `deleteLink` — Properti 12
    - **Properti 12: Hapus Link Menghilangkan Link dari Daftar**
    - Gunakan `fc.array(fc.record({...}), { minLength: 1 })` sebagai arbitrary untuk daftar tidak kosong
    - Verifikasi link dengan `id` tersebut tidak ada di daftar setelah `deleteLink(id)` dan panjang array berkurang satu
    - **Validates: Requirements 4.7**

- [ ] 13. Implementasi modul Quick Links — Render dan event listener
  - [ ] 13.1 Implementasikan `renderLinks()`
    - Kosongkan `#links-container` (`innerHTML = ""`)
    - Untuk setiap link di array `links`, buat elemen kartu `.link-card`
    - Gunakan `escapeHtml()` untuk nama link sebelum disisipkan ke DOM
    - Tambahkan event listener `click` pada kartu → `window.open(link.url, "_blank")`
    - Tambahkan tombol "Hapus" pada setiap kartu dengan event listener → `deleteLink(link.id)`
    - _Requirements: 4.1, 4.6_

  - [ ]* 13.2 Tulis property test untuk `renderLinks` — Properti 14
    - **Properti 14: Jumlah Kartu Link Sesuai Panjang Array**
    - Gunakan `fc.array(fc.record({ id: fc.string(), name: fc.string(), url: fc.string(), createdAt: fc.integer() }))` sebagai arbitrary
    - Verifikasi jumlah elemen `.link-card` di `#links-container` selalu sama dengan panjang array input
    - **Validates: Requirements 4.1**

  - [ ] 13.3 Implementasikan `quickLinksInit()`
    - Inisialisasi array `links` dengan memanggil `loadLinks()`
    - Panggil `renderLinks()` untuk tampilan awal
    - Pasang event listener `click` pada `#btn-add-link` → `addLink(#link-name-input.value, #link-url-input.value)`
    - Bersihkan pesan error saat pengguna mulai mengetik di field input
    - _Requirements: 4.2, 4.3, 4.9_

- [ ] 14. Checkpoint akhir — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

## Catatan

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Checkpoint memastikan validasi inkremental di setiap tahap
- Property tests memvalidasi properti kebenaran universal (14 properti)
- Unit tests memvalidasi contoh spesifik dan kasus tepi
- Semua teks pengguna HARUS melalui `escapeHtml()` sebelum disisipkan ke `innerHTML` untuk mencegah XSS
- Gunakan `textContent` sebagai alternatif `innerHTML` di mana memungkinkan
