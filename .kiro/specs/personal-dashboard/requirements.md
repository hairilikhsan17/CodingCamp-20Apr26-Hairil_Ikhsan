# Dokumen Requirements

## Pendahuluan

Personal Dashboard adalah aplikasi web yang berjalan sepenuhnya di browser tanpa memerlukan backend. Aplikasi ini dibangun menggunakan HTML, CSS, dan Vanilla JavaScript murni, dengan semua data pengguna disimpan secara lokal menggunakan Browser Local Storage API.

Tujuan utama aplikasi ini adalah menyediakan halaman tab baru atau halaman awal yang personal, fungsional, dan ringan — menampilkan waktu dan tanggal terkini, timer fokus (Pomodoro), daftar tugas harian, serta tautan cepat ke situs favorit pengguna.

## Glosarium

- **Dashboard**: Halaman utama aplikasi yang menampilkan semua widget secara bersamaan.
- **Widget**: Komponen fungsional mandiri di dalam Dashboard (misalnya: Greeting, Focus Timer, To-Do List, Quick Links).
- **Greeting**: Widget yang menampilkan waktu, tanggal, dan sapaan berdasarkan waktu hari.
- **Focus_Timer**: Widget timer hitung mundur 25 menit untuk sesi kerja terfokus.
- **Todo_List**: Widget pengelola daftar tugas harian pengguna.
- **Quick_Links**: Widget yang menampilkan tautan cepat ke situs web favorit pengguna.
- **Local_Storage**: API penyimpanan data browser yang menyimpan data secara persisten di sisi klien.
- **Task**: Satu item tugas di dalam Todo_List, memiliki teks deskripsi dan status selesai/belum.
- **Link**: Satu item tautan di dalam Quick_Links, memiliki label nama dan URL tujuan.
- **Sesi_Fokus**: Satu periode hitung mundur 25 menit yang dijalankan oleh Focus_Timer.

---

## Requirements

### Requirement 1: Tampilan Waktu dan Sapaan (Greeting)

**User Story:** Sebagai pengguna, saya ingin melihat waktu, tanggal, dan sapaan yang sesuai saat membuka dashboard, agar saya langsung mengetahui konteks waktu saat ini.

#### Acceptance Criteria

1. THE Dashboard SHALL menampilkan jam digital yang menunjukkan waktu saat ini dalam format HH:MM:SS.
2. THE Dashboard SHALL menampilkan tanggal saat ini dalam format hari, tanggal bulan tahun (contoh: Senin, 14 Juli 2025).
3. WHEN waktu saat ini berada antara pukul 05:00 dan 11:59, THE Greeting SHALL menampilkan teks sapaan "Selamat Pagi".
4. WHEN waktu saat ini berada antara pukul 12:00 dan 17:59, THE Greeting SHALL menampilkan teks sapaan "Selamat Siang".
5. WHEN waktu saat ini berada antara pukul 18:00 dan 20:59, THE Greeting SHALL menampilkan teks sapaan "Selamat Sore".
6. WHEN waktu saat ini berada antara pukul 21:00 dan 04:59, THE Greeting SHALL menampilkan teks sapaan "Selamat Malam".
7. THE Greeting SHALL memperbarui tampilan jam setiap 1 detik tanpa memerlukan reload halaman.

---

### Requirement 2: Timer Fokus (Focus Timer)

**User Story:** Sebagai pengguna, saya ingin menggunakan timer hitung mundur 25 menit, agar saya dapat bekerja dengan teknik Pomodoro dan menjaga fokus.

#### Acceptance Criteria

1. THE Focus_Timer SHALL menampilkan hitung mundur dengan format MM:SS, dimulai dari 25:00.
2. WHEN pengguna menekan tombol "Mulai", THE Focus_Timer SHALL memulai hitung mundur dari nilai waktu yang sedang ditampilkan.
3. WHEN pengguna menekan tombol "Berhenti", THE Focus_Timer SHALL menghentikan hitung mundur dan mempertahankan nilai waktu saat ini.
4. WHEN pengguna menekan tombol "Reset", THE Focus_Timer SHALL menghentikan hitung mundur dan mengembalikan tampilan ke 25:00.
5. WHEN hitung mundur mencapai 00:00, THE Focus_Timer SHALL menghentikan timer secara otomatis dan menampilkan notifikasi bahwa sesi fokus telah selesai.
6. WHILE Focus_Timer sedang berjalan, THE Focus_Timer SHALL menonaktifkan tombol "Mulai" agar tidak dapat ditekan kembali.
7. WHILE Focus_Timer sedang berhenti atau belum dimulai, THE Focus_Timer SHALL menonaktifkan tombol "Berhenti".

---

### Requirement 3: Daftar Tugas (To-Do List)

**User Story:** Sebagai pengguna, saya ingin mengelola daftar tugas harian saya langsung dari dashboard, agar saya dapat melacak pekerjaan yang perlu diselesaikan.

#### Acceptance Criteria

1. THE Todo_List SHALL menyediakan kolom input teks dan tombol "Tambah" untuk menambahkan Task baru.
2. WHEN pengguna memasukkan teks dan menekan tombol "Tambah" atau menekan tombol Enter, THE Todo_List SHALL menambahkan Task baru ke dalam daftar dengan status belum selesai.
3. IF pengguna menekan tombol "Tambah" dengan kolom input kosong, THEN THE Todo_List SHALL tidak menambahkan Task dan tetap menampilkan kolom input dalam keadaan kosong.
4. WHEN pengguna menekan tombol centang pada sebuah Task, THE Todo_List SHALL mengubah status Task tersebut menjadi selesai dan menampilkan teks dengan garis coret (strikethrough).
5. WHEN pengguna menekan tombol centang pada Task yang sudah selesai, THE Todo_List SHALL mengubah status Task tersebut kembali menjadi belum selesai.
6. WHEN pengguna menekan tombol "Edit" pada sebuah Task, THE Todo_List SHALL mengaktifkan mode edit yang memungkinkan pengguna mengubah teks Task tersebut.
7. WHEN pengguna menyimpan hasil edit, THE Todo_List SHALL memperbarui teks Task dengan nilai yang baru.
8. IF pengguna menyimpan hasil edit dengan teks kosong, THEN THE Todo_List SHALL tidak menyimpan perubahan dan mengembalikan teks Task ke nilai sebelumnya.
9. WHEN pengguna menekan tombol "Hapus" pada sebuah Task, THE Todo_List SHALL menghapus Task tersebut dari daftar secara permanen.
10. WHEN terjadi perubahan pada daftar Task (tambah, edit, selesai, hapus), THE Todo_List SHALL menyimpan seluruh daftar Task ke Local_Storage secara otomatis.
11. WHEN halaman Dashboard dimuat, THE Todo_List SHALL memuat dan menampilkan seluruh Task yang tersimpan di Local_Storage.

---

### Requirement 4: Tautan Cepat (Quick Links)

**User Story:** Sebagai pengguna, saya ingin menyimpan dan mengakses tautan ke situs web favorit saya dari dashboard, agar saya dapat membuka situs tersebut dengan cepat.

#### Acceptance Criteria

1. THE Quick_Links SHALL menampilkan tombol atau kartu untuk setiap Link yang tersimpan.
2. THE Quick_Links SHALL menyediakan formulir untuk menambahkan Link baru yang terdiri dari kolom input nama dan kolom input URL.
3. WHEN pengguna mengisi nama dan URL lalu menekan tombol "Tambah", THE Quick_Links SHALL menambahkan Link baru ke dalam daftar.
4. IF pengguna menekan tombol "Tambah" dengan salah satu atau kedua kolom input kosong, THEN THE Quick_Links SHALL tidak menambahkan Link dan menampilkan pesan kesalahan yang menginformasikan kolom mana yang belum diisi.
5. IF pengguna memasukkan URL yang tidak diawali dengan "http://" atau "https://", THEN THE Quick_Links SHALL menambahkan awalan "https://" secara otomatis sebelum menyimpan Link.
6. WHEN pengguna menekan sebuah Link, THE Quick_Links SHALL membuka URL tujuan di tab baru browser.
7. WHEN pengguna menekan tombol "Hapus" pada sebuah Link, THE Quick_Links SHALL menghapus Link tersebut dari daftar secara permanen.
8. WHEN terjadi perubahan pada daftar Link (tambah, hapus), THE Quick_Links SHALL menyimpan seluruh daftar Link ke Local_Storage secara otomatis.
9. WHEN halaman Dashboard dimuat, THE Quick_Links SHALL memuat dan menampilkan seluruh Link yang tersimpan di Local_Storage.

---

### Requirement 5: Struktur dan Performa Aplikasi

**User Story:** Sebagai pengguna, saya ingin aplikasi yang cepat, bersih, dan mudah digunakan tanpa konfigurasi apapun, agar pengalaman menggunakan dashboard terasa menyenangkan.

#### Acceptance Criteria

1. THE Dashboard SHALL dapat dijalankan langsung di browser modern (Chrome, Firefox, Edge, Safari) hanya dengan membuka file HTML tanpa memerlukan server atau instalasi tambahan.
2. THE Dashboard SHALL memuat seluruh antarmuka dalam waktu kurang dari 2 detik pada koneksi lokal.
3. THE Dashboard SHALL menggunakan tepat 1 file CSS di dalam folder `css/` dan tepat 1 file JavaScript di dalam folder `js/`.
4. THE Dashboard SHALL menampilkan antarmuka yang responsif dan dapat digunakan dengan baik pada lebar layar minimal 320px hingga 1920px.
5. WHEN pengguna berinteraksi dengan elemen interaktif (tombol, input), THE Dashboard SHALL memberikan respons visual dalam waktu kurang dari 100ms.
6. THE Dashboard SHALL menampilkan semua Widget dalam satu halaman tanpa memerlukan navigasi antar halaman.
