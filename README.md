# Website Profile Stasi Yohanes Gabriel Perboyre

Website profile untuk Stasi Yohanes Gabriel Perboyre, Paroki Santo Yakobus Kelapa Gading.

## Deskripsi

Website ini terdiri dari dua bagian utama:
- **Frontend (Landing Page)**: Website publik yang dapat diakses oleh umat dan pengunjung
- **Backend (CMS)**: Sistem manajemen konten untuk admin mengelola website

## Teknologi yang Digunakan

### Frontend
- **React** - Library JavaScript untuk membangun user interface
- **Vite** - Build tool yang cepat dan modern
- **React Router** - Routing untuk aplikasi single-page
- **Lucide React** - Icon library
- **CSS3** - Styling dengan responsive design

### Backend
- **Node.js + Express** - RESTful API server
- **MySQL (XAMPP)** - Database dengan Sequelize ORM
- **JWT** - Authentication & Authorization
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## Struktur Menu Website

### Menu Utama
1. **Beranda**
   - Hero slider
   - Kalender liturgi
   - Jadwal misa
   - Agenda mendatang
   - Pengumuman terbaru
   - Booth formulir

2. **Artikel & Formulir**
   - Artikel
   - Pengumuman
   - Galeri Stasi (redirect ke Google Photos)
   - Formulir

3. **Tentang Kami**
   - Sejarah (timeline format)
   - DPS BGKS/DPP BGKP
   - Pastor
   - Wilayah & Lingkungan

4. **Kategorial**
   - Orang Muda Katolik (OMK)
   - Kelompok Bapak-Bapak
   - Kelompok Ibu-Ibu
   - Kelompok Lansia
   - Kelompok Remaja
   - Kelompok Anak-Anak

5. **Karya Sosial**
   - Kelompok Karya Sosial
   - PKKS (Persiapan Komuni Kudus Pertama)
   - Katekumen

## Instalasi dan Menjalankan Aplikasi

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- npm atau yarn
- XAMPP (untuk MySQL database)

### Instalasi Frontend

1. Clone repository
```bash
git clone <repository-url>
cd website_stasi
```

2. Install dependencies frontend
```bash
cd frontend
npm install
```

3. Jalankan development server
```bash
npm run dev
```

4. Buka browser dan akses `http://localhost:5174`

### Instalasi Backend

1. Install dependencies backend
```bash
cd backend
npm install
```

2. Setup XAMPP MySQL
   - Buka XAMPP Control Panel
   - Start Apache dan MySQL
   - Buka phpMyAdmin: `http://localhost/phpmyadmin`
   - Create database: `stasi_yohanes`

3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` sesuaikan dengan konfigurasi MySQL Anda

4. Create admin user
```bash
npm run create-admin
```

5. Jalankan backend server
```bash
npm run dev
```

6. Backend berjalan di `http://localhost:5000`

**Default Admin Login:**
- Email: `admin@stasiyohanes.org`
- Password: `admin123`

⚠️ **Ganti password setelah login pertama!**

### Build Frontend untuk Production

```bash
cd frontend
npm run build
```

File hasil build akan berada di folder `dist/`

### Menjalankan Backend Production

```bash
cd backend
npm start
```

## Fitur Website

### Halaman Beranda
- ✅ Hero slider dengan 3 slide
- ✅ Quick links ke halaman utama
- ✅ Kalender liturgi
- ✅ Jadwal misa dengan link streaming (YouTube, Instagram)
- ✅ Agenda mendatang
- ✅ Pengumuman terbaru
- ✅ Booth formulir (Intensi Misa, Persembahan, PKKS, Katekumen)

### Halaman Artikel & Pengumuman
- ✅ Grid layout untuk list artikel/pengumuman
- ✅ Detail page dengan slide foto
- ✅ Metadata (tanggal, penulis)
- ✅ Responsive design

### Halaman Tentang Kami
- ✅ Sejarah dengan timeline interaktif
- ✅ Visi dan Misi
- ✅ DPS dan DPP dengan foto dan jabatan
- ✅ Pastor (saat ini dan yang pernah berkarya)
- ✅ Wilayah dan lingkungan dengan statistik

### Halaman Kategorial
- ✅ Tab navigation untuk berbagai kelompok
- ✅ Detail informasi setiap kelompok
- ✅ Kegiatan dan jadwal pertemuan
- ✅ Kontak person

### Halaman Karya Sosial
- ✅ Program-program karya sosial
- ✅ Informasi PKKS (persyaratan, jadwal)
- ✅ Informasi Katekumen (tahapan, persyaratan)
- ✅ Form download untuk pendaftaran

## Referensi Desain

Website ini terinspirasi dari:
- [https://www.marinusyohanes.org/](https://www.marinusyohanes.org/)
- [https://smtb.net/](https://smtb.net/)

## Pengembangan Selanjutnya

### Backend & CMS
- [ ] Setup Node.js + Express backend
- [ ] Database schema design
- [ ] RESTful API endpoints
- [ ] Admin authentication
- [ ] Admin panel untuk CRUD content
- [ ] Upload dan manage gambar
- [ ] Manajemen users

### Fitur Tambahan
- [ ] Integrasi dengan API Kalender Liturgi
- [ ] Form submissions (Intensi Misa, Persembahan, dll)
- [ ] Search functionality
- [ ] Newsletter subscription
- [ ] Multi-language support (Indonesia/English)
- [ ] Dark mode

### Optimisasi
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Progressive Web App (PWA)
- [ ] Analytics integration

## Struktur Folder

```
website_stasi/
├── frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── ArtikelList.jsx
│   │   │   ├── ArtikelDetail.jsx
│   │   │   ├── PengumumanList.jsx
│   │   │   ├── PengumumanDetail.jsx
│   │   │   ├── ContentList.css
│   │   │   ├── ContentDetail.css
│   │   │   ├── Sejarah.jsx
│   │   │   ├── Sejarah.css
│   │   │   ├── Pengurus.jsx
│   │   │   ├── Pastor.jsx
│   │   │   ├── Wilayah.jsx
│   │   │   ├── OrgPages.css
│   │   │   ├── Kategorial.jsx
│   │   │   ├── Kategorial.css
│   │   │   ├── KaryaSosial.jsx
│   │   │   ├── PKKS.jsx
│   │   │   ├── Katekumen.jsx
│   │   │   └── KaryaSosial.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/ (akan dikembangkan)
└── README.md
```

## Kontribusi

Untuk berkontribusi pada proyek ini, silakan hubungi tim IT Stasi Yohanes Gabriel Perboyre.

## Lisensi

© 2024 Stasi Yohanes Gabriel Perboyre. All rights reserved.

## Kontak

- **Email**: info@stasiyohanes.org
- **Telepon**: (021) 1234-5678
- **Alamat**: Jl. Boulevard Raya, Kelapa Gading, Jakarta Utara
