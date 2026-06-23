# 📢 E-Report: Sistem Informasi Pengaduan Masyarakat Berbasis Web (SPA)

[![CodeIgniter](https://img.shields.io/badge/Framework-CodeIgniter%204-orange?style=for-the-badge&logo=codeigniter)](https://codeigniter.com/)
[![Vue.js](https://img.shields.io/badge/Library-Vue.js%203-green?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue?style=for-the-badge&logo=mysql&logoColor=white)](https://www.phpmyadmin.net/)

**E-Report** adalah aplikasi pelaporan keluhan dan aspirasi publik yang mengusung arsitektur modern **Single Page Application (SPA)** di sisi *frontend* dan **RESTful API** di sisi *backend*. Sistem ini dirancang untuk memotong birokrasi, sehingga masyarakat dapat mengirimkan aduan secara instan dan administrator dapat mengelola serta menindaklanjuti data secara efisien melalui satu dasbor terpadu.

Aplikasi ini dibangun untuk memenuhi komponen penilaian **UAS Pemrograman Web**.

---

## 🧭 Alur & Arsitektur Sistem

Sistem ini memisahkan secara total antara hak akses publik dan hak akses administrator guna menjaga integritas data:

1. **Sisi Publik (Masyarakat):** Warga membuka halaman utama (`index.html`) untuk melihat aduan yang sedang berjalan dan menulis laporan baru tanpa perlu melalui proses registrasi/login yang rumit.
2. **Sisi Administrator:** Petugas mengakses portal khusus (`admin.html`) menggunakan token autentikasi berbasis sesi statis untuk melakukan verifikasi, pemantauan, dan pembersihan data dari database phpMyAdmin.

---

## 🛠️ Spesifikasi Teknologi (Tech Stack)

### 1. Client-Side (Frontend SPA)
* **Pondasi:** HTML5 (Semantic Tags) & JavaScript (ES6+ Asynchronous Fetching).
* **UI/UX Framework:** **Tailwind CSS v3** untuk desain antarmuka bergaya *Dark Mode* yang modern, bersih, dan responsif di berbagai ukuran layar (Mobile & Desktop).
* **Reaktivitas:** **Vue.js 3 (via CDN)** untuk mengikat data (*data-binding*) secara dua arah dan memperbarui UI secara instan tanpa memuat ulang halaman (*zero-reload*).
* **HTTP Client:** **Axios** untuk menangani komunikasi asinkron (`GET`, `POST`, `OPTIONS`) ke server backend.

### 2. Server-Side (Backend API)
* **Framework:** **CodeIgniter 4.x** sebagai penyedia layanan RESTful Web Services berbasis PHP.
* **Database Driver:** CodeIgniter Query Builder untuk interaksi database yang aman dari celah SQL Injection.
* **Web Server Lokal:** Apache melalui bundle XAMPP.

---

## 🗄️ Rancangan Basis Data (Database Schema)

Sistem terhubung ke basis data bernama `uas_ereport`. Struktur penyimpanan difokuskan pada tabel utama pemampung aspirasi sebagai berikut:

### Tabel: `kategori_aduan`
Tabel ini bertugas mencatat entitas laporan yang dikirimkan oleh publik.

| Nama Bidang (Field) | Tipe Data | Atribut / Constraints | Fungsionalitas |
| :--- | :--- | :--- | :--- |
| `id` | INT(11) | PRIMARY KEY, AUTO_INCREMENT | Generator ID unik otomatis untuk setiap aduan. |
| `nama_kategori` | VARCHAR(100) | NOT NULL | Menyimpan jenis kategori (misal: Infrastruktur, Fasilitas). |
| `deskripsi` | TEXT | NULL | Menyimpan detail isi keluhan/laporan dari warga. |

---

## 🌐 Dokumentasi API Endpoints

Semua endpoint API beroperasi di bawah pangkalan URL: `http://localhost:8080/api/`

### 1. Autentikasi Admin
* **Endpoint:** `api/login`
* **Method:** `POST`
* **Payload (JSON):** `{"email": "...", "password": "..."}`
* **Fungsi:** Memverifikasi kredensial administrator dan mengembalikan token otorisasi.

### 2. Manajemen Pengaduan (Umum)
* **Endpoint:** `api/pengaduan`
* **Method:** `GET`
* **Fungsi:** Mengambil seluruh baris data dari tabel `kategori_aduan` untuk ditampilkan ke tabel.

### 3. Pembuatan Aduan Baru (Publik)
* **Endpoint:** `api/pengaduan/create`
* **Method:** `POST`
* **Payload (JSON):** `{"kategori": "...", "isi_laporan": "..."}`
* **Fungsi:** Memasukkan data keluhan masyarakat langsung ke phpMyAdmin.

### 4. Penghapusan Aduan (Admin Only)
* **Endpoint:** `api/pengaduan/delete/{id}`
* **Method:** `POST`
* **Fungsi:** Menghapus baris aduan tertentu berdasarkan parameter ID unik.

---

## 🔒 Kebijakan Keamanan & Penanganan CORS

Aplikasi ini mengimplementasikan regulasi **CORS (Cross-Origin Resource Sharing)** yang ketat pada sisi server untuk mencegah pemblokiran request lintas origin oleh browser (`http://localhost` ke `http://localhost:8080`).

* **Preflight Requests Handler:** Setiap request mutasi data (`POST`) akan diawali dengan pengecekan `OPTIONS` oleh browser. Router backend dikonfigurasi untuk langsung menyetujui Preflight ini dengan status `200 OK` sebelum mengeksekusi fungsi utama.
* **Global Filters Exclusion:** Middleware/Filter keamanan autentikasi (`AuthFilter`) dipasang secara global namun dikecualikan (`except`) khusus untuk rute `api/login` dan `api/pengaduan/create` agar masyarakat umum tetap bisa mengirim laporan tanpa hambatan login.

---

## 🔧 Langkah Pengujian & Instalasi Lokal

### Langkah 1: Pengaturan Basis Data (MySQL)
1. Aktifkan modul **Apache** dan **MySQL** pada control panel XAMPP Anda.
2. Masuk ke halaman `http://localhost/phpmyadmin/`.
3. Buat database baru bernama **`uas_ereport`**.
4. Buat tabel bernama **`kategori_aduan`** dengan struktur kolom: `id` (int, AI, PK), `nama_kategori` (varchar), dan `deskripsi` (text).

### Langkah 2: Konfigurasi & Menjalankan Backend CI4
1. Taruh folder backend CodeIgniter 4 Anda di direktori lokal komputer.
2. Pastikan file `.env` sudah terkonfigurasi dengan benar menuju database `uas_ereport`.
3. Buka terminal/command prompt di dalam root folder backend tersebut, lalu eksekusi perintah:
   ```bash
   php spark serve
