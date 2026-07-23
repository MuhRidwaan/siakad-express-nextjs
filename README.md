# 🎓 SIAKAD Full-Stack (Express.js + Next.js)

Aplikasi **Sistem Informasi Akademik (SIAKAD)** berbasis Web Full-Stack menggunakan **Express.js (TypeScript)** untuk Backend REST API dan **Next.js (App Router + Bootstrap 5)** untuk Frontend.

---

## 🛠️ Tech Stack

- **Backend**: Express.js (TypeScript), MySQL (`mysql2`), JWT Auth, Bcrypt, Multer (Upload), `tsx`
- **Frontend**: Next.js (TypeScript), Bootstrap 5 & Bootstrap Icons, Context API
- **Database**: MySQL

---

## ✨ Fitur Utama

- **Authentication & Security**: Login, Register, Hashing Password (`bcrypt`), JWT Token, Role-Based Access Control (`Admin`, `Operator`, `Viewer`).
- **Manajemen Mahasiswa**: CRUD Data Mahasiswa, Upload Foto Profil, Filter Prodi/Angkatan, Search, & Pagination.
- **Manajemen Program Studi**: CRUD Data Program Studi.
- **Manajemen User (Admin)**: Pengelolaan akun pengguna & fitur Reset Password acak.

---

## 🚀 Panduan Instalasi & Penggunaan

### 📌 Prasyarat (Prerequisites)
Pastikan perangkat Anda sudah terinstal:
- [Node.js](https://nodejs.org/) (versi 18+ direkomendasikan)
- [MySQL Database](https://www.mysql.com/) (atau via XAMPP / Laragon / phpMyAdmin)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone Repository
```bash
git clone https://github.com/MuhRidwaan/siakad-express-nextjs.git
cd siakad-express-nextjs
```

---

### 2️⃣ Setup Database MySQL
1. Buka phpMyAdmin / MySQL CLI / DBeaver.
2. Buat database baru bernama **`akademik_db`**.
3. Import file SQL schema yang berada di folder:
   ```text
   backend/database/schema.sql
   ```
   *(Atau jalankan query di `schema.sql` pada SQL Editor phpMyAdmin)*.

---

### 3️⃣ Setup Backend (Express.js)
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file **`.env`** di dalam folder `backend/` (bisa salin dari `.env.example`):
   ```bash
   cp .env.example .env
   ```
   *Isi konfigurasi `.env` backend:*
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=akademik_db
   JWT_SECRET=your_jwt_secret_key_12345
   JWT_EXPIRES_IN=7d
   ```
   *(Sesuaikan `DB_USER` dan `DB_PASSWORD` dengan konfigurasi MySQL Anda)*.

4. Jalankan Server Backend:
   ```bash
   npm run dev
   ```
   Backend akan berjalan di: **`http://localhost:5000`**

---

### 4️⃣ Setup Frontend (Next.js)
1. Buka terminal baru dan masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file **`.env.local`** di dalam folder `frontend/` (bisa salin dari `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
   *Isi konfigurasi `.env.local` frontend:*
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000/uploads
   ```

4. Jalankan Development Server Frontend:
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di: **`http://localhost:3000`**

---

## 🔑 Penggunaan Aplikasi

1. Buka browser di **`http://localhost:3000`**.
2. Anda akan diarahkan ke halaman **Login**.
3. Jika belum memiliki akun, klik **Daftar Sekarang** (`http://localhost:3000/register`).
4. Buat akun baru dengan pilihan Role:
   - **Admin**: Memiliki akses penuh (termasuk Manajemen User & Hapus Data).
   - **Operator**: Diberi akses Tambah & Edit Data.
   - **Viewer**: Hanya dapat melihat data.
5. Selamat menguji aplikasi! 🎉
