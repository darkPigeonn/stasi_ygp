-- Database Schema untuk Stasi Yohanes Gabriel Perboyre
-- Jalankan di phpMyAdmin atau MySQL CLI

USE stasi_yohanes;

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'editor') DEFAULT 'editor',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: artikels
CREATE TABLE IF NOT EXISTS `artikels` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `author` VARCHAR(100) NOT NULL COMMENT 'Ditulis Oleh',
  `publish_date` DATE NOT NULL COMMENT 'Tanggal',
  `content` LONGTEXT NOT NULL COMMENT 'Isi Artikel - TinyMCE',
  `images` JSON COMMENT 'Galeri Foto - bisa lebih dari satu',
  `status` ENUM('draft', 'published') DEFAULT 'draft',
  `views` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: pengumumans
CREATE TABLE IF NOT EXISTS `pengumumans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` ENUM('Pernikahan', 'Tahbisan Imam', 'Tahbisan Diakon', 'Pengumuman Paroki', 'Pengumuman Stasi') NOT NULL COMMENT 'Kategori Pengumuman',
  `content` LONGTEXT NOT NULL COMMENT 'Isi Pengumuman - TinyMCE',
  `images` JSON COMMENT 'Galeri Foto dengan caption',
  `publish_date` DATE NOT NULL,
  `is_priority` TINYINT(1) DEFAULT 0 COMMENT 'Pengumuman Penting',
  `status` ENUM('draft', 'published') DEFAULT 'draft',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: galeris
CREATE TABLE IF NOT EXISTS `galeris` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `images` JSON COMMENT 'Galeri Foto dengan caption',
  `google_photo_url` VARCHAR(500) COMMENT 'Link URL Google Photo',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: dps
CREATE TABLE IF NOT EXISTS `dps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('DPS/DPP', 'BGKS/BGKP') NOT NULL COMMENT 'DPS/BGKS',
  `position` VARCHAR(100) NOT NULL COMMENT 'Jabatan',
  `sub_position` VARCHAR(100) COMMENT 'Sub Jabatan',
  `baptism_name` VARCHAR(100) NOT NULL COMMENT 'Nama Baptis',
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Nama Lengkap',
  `photo` VARCHAR(255) COMMENT 'Photo URL',
  `order` INT DEFAULT 0 COMMENT 'Urutan tampilan',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: pastors
CREATE TABLE IF NOT EXISTS `pastors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pastor_type` ENUM('Gembala Kami', 'Pernah Berkarya') NOT NULL COMMENT 'Pastor',
  `priest_type` ENUM('Romo Paroki/Stasi', 'Romo Rekan') NOT NULL COMMENT 'Tipe Pastor',
  `name` VARCHAR(150) NOT NULL COMMENT 'Nama Pastor',
  `nickname` VARCHAR(100) COMMENT 'Nama Panggilan',
  `ordination_date` DATE COMMENT 'Tahbisan Imamat',
  `serve_from` INT COMMENT 'Berkarya Dari - Tahun',
  `serve_to` INT COMMENT 'Berkarya Sampai - Tahun',
  `photo` VARCHAR(255) COMMENT 'Foto',
  `biography` TEXT COMMENT 'Biografi singkat',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: wilayahs
CREATE TABLE IF NOT EXISTS `wilayahs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Nama Wilayah',
  `chairman` VARCHAR(150) NOT NULL COMMENT 'Ketua Wilayah',
  `map_image` VARCHAR(255) COMMENT 'Upload Peta',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: lingkungans
CREATE TABLE IF NOT EXISTS `lingkungans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `wilayah_id` INT NOT NULL COMMENT 'Nama Wilayah - FK',
  `name` VARCHAR(150) NOT NULL COMMENT 'Nama Lingkungan',
  `chairman` VARCHAR(150) NOT NULL COMMENT 'Ketua Lingkungan',
  `boundary_north` VARCHAR(255) COMMENT 'Batas Utara',
  `boundary_east` VARCHAR(255) COMMENT 'Batas Timur',
  `boundary_south` VARCHAR(255) COMMENT 'Batas Selatan',
  `boundary_west` VARCHAR(255) COMMENT 'Batas Barat',
  `family_count` INT DEFAULT 0 COMMENT 'Jumlah Keluarga',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`wilayah_id`) REFERENCES `wilayahs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: kategoriales
CREATE TABLE IF NOT EXISTS `kategoriales` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL UNIQUE COMMENT 'Nama Kategorial',
  `content` LONGTEXT NOT NULL COMMENT 'Isi Kategorial - TinyMCE',
  `schedule` VARCHAR(255) COMMENT 'Jadwal Pertemuan',
  `contact` VARCHAR(255) COMMENT 'Kontak Person',
  `image` VARCHAR(255) COMMENT 'Gambar kategorial',
  `order` INT DEFAULT 0 COMMENT 'Urutan tampilan',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: formulirs
CREATE TABLE IF NOT EXISTS `formulirs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL COMMENT 'Nama Formulir',
  `category` VARCHAR(100) NOT NULL COMMENT 'Kategori Formulir',
  `file_url` VARCHAR(255) NOT NULL COMMENT 'Upload Formulir - File URL',
  `description` TEXT COMMENT 'Deskripsi formulir',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: sejarahs
CREATE TABLE IF NOT EXISTS `sejarahs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `year` INT NOT NULL COMMENT 'Tahun',
  `category` VARCHAR(150) NOT NULL COMMENT 'Kategori Sejarah',
  `content` LONGTEXT NOT NULL COMMENT 'Isi Sejarah - TinyMCE',
  `order` INT DEFAULT 0 COMMENT 'Urutan tampilan timeline',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: profiles
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `stasi_name` VARCHAR(200) NOT NULL COMMENT 'Nama Stasi/Paroki',
  `paroki_name` VARCHAR(200) COMMENT 'Nama Paroki Induk',
  `logo` VARCHAR(255) COMMENT 'Logo Stasi/Paroki',
  `address` TEXT NOT NULL COMMENT 'Alamat - TinyMCE',
  `phone1` VARCHAR(20) COMMENT 'No Tlp 1',
  `phone2` VARCHAR(20) COMMENT 'No Tlp 2',
  `phone3` VARCHAR(20) COMMENT 'No Tlp 3',
  `email` VARCHAR(100) COMMENT 'Email',
  `office_hours` TEXT COMMENT 'Jam buka sekretariat',
  `mass_schedule` JSON COMMENT 'Jadwal Misa - Array of objects',
  `social_media` JSON COMMENT 'Social Media URLs',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: intensi_misas
CREATE TABLE IF NOT EXISTS `intensi_misas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `contact_wa` VARCHAR(255) NOT NULL COMMENT 'CP Intensi Misa - WhatsApp',
  `format` TEXT COMMENT 'Format Intensi',
  `deadline` TEXT COMMENT 'Batas Penyampaian',
  `offering` TEXT COMMENT 'Persembahan Intensi Misa',
  `qr_code` VARCHAR(255) COMMENT 'Upload QR',
  `church_account_name` VARCHAR(150) COMMENT 'Persembahan Gereja - Atas Nama',
  `church_bank_name` VARCHAR(100) COMMENT 'Persembahan Gereja - Nama Bank',
  `church_account_number` VARCHAR(50) COMMENT 'Persembahan Gereja - No Rekening',
  `church_qr_code` VARCHAR(255) COMMENT 'Persembahan Gereja - QR Code',
  `social_account_name` VARCHAR(150) COMMENT 'Persembahan Karya Sosial - Atas Nama',
  `social_bank_name` VARCHAR(100) COMMENT 'Persembahan Karya Sosial - Nama Bank',
  `social_account_number` VARCHAR(50) COMMENT 'Persembahan Karya Sosial - No Rekening',
  `social_qr_code` VARCHAR(255) COMMENT 'Persembahan Karya Sosial - QR Code',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for better performance
CREATE INDEX idx_artikels_status ON artikels(status);
CREATE INDEX idx_artikels_publish_date ON artikels(publish_date);
CREATE INDEX idx_pengumumans_status ON pengumumans(status);
CREATE INDEX idx_pengumumans_category ON pengumumans(category);
CREATE INDEX idx_pengumumans_priority ON pengumumans(is_priority);
CREATE INDEX idx_lingkungans_wilayah_id ON lingkungans(wilayah_id);

-- Insert default data (opsional)
-- INSERT INTO profiles (stasi_name, paroki_name, address, email)
-- VALUES ('Stasi Yohanes Gabriel Perboyre', 'Paroki Santo Yakobus Kelapa Gading', '<p>Alamat stasi</p>', 'info@stasiyohanes.org');
