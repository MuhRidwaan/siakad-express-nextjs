-- Database Schema for SIAKAD (akademik_db)

CREATE DATABASE IF NOT EXISTS akademik_db;
USE akademik_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'operator', 'viewer') NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: prodi
CREATE TABLE IF NOT EXISTS prodi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_prodi VARCHAR(50) NOT NULL UNIQUE,
    nama_prodi VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    prodi_id INT NOT NULL,
    angkatan INT NOT NULL,
    foto VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prodi_id) REFERENCES prodi(id) ON DELETE CASCADE
);

-- Seed Data 3 User Default (Password: "password")
INSERT INTO users (nama, email, password, role) VALUES
('Administrator', 'admin@gmail.com', '$2b$10$4orUZLtXaUyqH6P49DxKGOjvACKKQhjmUwRopdzG0BgTdkISsR5Vy', 'admin'),
('Operator Staff', 'operator@gmail.com', '$2b$10$4orUZLtXaUyqH6P49DxKGOjvACKKQhjmUwRopdzG0BgTdkISsR5Vy', 'operator'),
('Guest Viewer', 'viewer@gmail.com', '$2b$10$4orUZLtXaUyqH6P49DxKGOjvACKKQhjmUwRopdzG0BgTdkISsR5Vy', 'viewer')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Seed Data Contoh Prodi
INSERT INTO prodi (kode_prodi, nama_prodi) VALUES 
('IF', 'Teknik Informatika'),
('SI', 'Sistem Informasi')
ON DUPLICATE KEY UPDATE kode_prodi=VALUES(kode_prodi);

-- Insert 25 Data Dummy Mahasiswa 
INSERT INTO mahasiswa (nim, nama, prodi_id, angkatan, foto) VALUES
('2100101', 'Ahmad Rizky Pratama', 1, 2021, NULL),
('2100102', 'Siti Nurhaliza', 2, 2021, NULL),
('2100103', 'Budi Santoso', 1, 2021, NULL),
('2100104', 'Dewi Anggraini', 2, 2021, NULL),
('2200105', 'Eko Prasetyo', 1, 2022, NULL),
('2200106', 'Fitriani Putri', 2, 2022, NULL),
('2200107', 'Gilang Ramadhan', 1, 2022, NULL),
('2200108', 'Hani Anisa', 2, 2022, NULL),
('2200109', 'Indra Wijaya', 1, 2022, NULL),
('2300110', 'Jihan Fahira', 2, 2023, NULL),
('2300111', 'Kevin Sanjaya', 1, 2023, NULL),
('2300112', 'Larasati Dewi', 2, 2023, NULL),
('2300113', 'Muhammad Akbar', 1, 2023, NULL),
('2300114', 'Nadia Syifa', 2, 2023, NULL),
('2300115', 'Oki Setiawan', 1, 2023, NULL),
('2400116', 'Putri Ayu Lestari', 2, 2024, NULL),
('2400117', 'Qori Agil', 1, 2024, NULL),
('2400118', 'Rian Hidayat', 2, 2024, NULL),
('2400119', 'Siska Amelia', 1, 2024, NULL),
('2400120', 'Taufik Hidayat', 2, 2024, NULL),
('2400121', 'Utami Rahmawati', 1, 2024, NULL),
('2400122', 'Vino G. Bastian', 2, 2024, NULL),
('2400123', 'Winda Lestari', 1, 2024, NULL),
('2400124', 'Xavier Alexander', 2, 2024, NULL),
('2400125', 'Yudha Pratama', 1, 2024, NULL);