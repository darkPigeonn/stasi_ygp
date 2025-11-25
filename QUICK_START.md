# Quick Start Guide

## Menjalankan Frontend Prototype

### 1. Pastikan Node.js sudah terinstall
```bash
node --version
npm --version
```

### 2. Masuk ke folder frontend
```bash
cd frontend
```

### 3. Install dependencies (hanya sekali)
```bash
npm install
```

### 4. Jalankan development server
```bash
npm run dev
```

### 5. Buka browser
Akses `http://localhost:5173` atau port yang ditampilkan di terminal

## Navigasi Website

### Menu Utama
- **Beranda** (`/`) - Homepage dengan slider, kalender liturgi, jadwal misa, dan pengumuman
- **Artikel** (`/artikel`) - Daftar artikel dan detail artikel
- **Pengumuman** (`/pengumuman`) - Daftar pengumuman dan detail pengumuman
- **Sejarah** (`/sejarah`) - Timeline sejarah stasi
- **Pengurus** (`/pengurus`) - DPS dan DPP
- **Pastor** (`/pastor`) - Pastor saat ini dan yang pernah berkarya
- **Wilayah** (`/wilayah`) - Wilayah dan lingkungan
- **Kategorial** (`/kategorial`) - Kelompok kategorial (OMK, Bapak, Ibu, Lansia, Remaja, Anak)
- **Karya Sosial** (`/karya-sosial`) - Program karya sosial
- **PKKS** (`/pkks`) - Persiapan Komuni Kudus Pertama
- **Katekumen** (`/katekumen`) - Program katekumen

## Fitur yang Sudah Diimplementasikan

✅ Responsive design (desktop, tablet, mobile)
✅ Navigation dengan dropdown menu
✅ Hero slider otomatis
✅ Grid layout untuk artikel dan pengumuman
✅ Timeline untuk sejarah
✅ Tab navigation untuk kategorial
✅ Kalender liturgi
✅ Jadwal misa dan agenda
✅ Footer dengan informasi kontak
✅ Smooth transitions dan animations

## Catatan Penting

### Data Sementara
Saat ini semua data adalah **mock data** (data contoh). Untuk implementasi penuh, diperlukan:
1. Backend API dengan database
2. Admin panel untuk CRUD operations
3. Integrasi dengan API Kalender Liturgi
4. Form submission handling

### Gambar Placeholder
Logo dan gambar menggunakan placeholder. Untuk production:
1. Ganti `logo.svg` di folder `public/` dengan logo asli stasi
2. Tambahkan gambar-gambar real di berbagai section
3. Optimize gambar untuk web (compress, resize)

### Customisasi
Untuk mengubah warna tema, edit file CSS:
- Primary color: `#3b82f6` (biru)
- Dark primary: `#1e3a8a` (biru tua)
- Background: `#f8f9fa` (abu-abu terang)

## Build untuk Production

```bash
npm run build
```

Hasil build akan ada di folder `dist/` yang siap untuk di-deploy ke hosting.

## Troubleshooting

### Port sudah digunakan
Jika port 5173 sudah digunakan, Vite akan otomatis mencoba port lain (5174, 5175, dst)

### Dependencies error
Hapus folder `node_modules` dan `package-lock.json`, lalu install ulang:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build error
Pastikan semua dependencies sudah terinstall dengan benar:
```bash
npm install
npm run build
```

## Next Steps

1. **Review prototype** - Periksa semua halaman dan fitur
2. **Feedback** - Kumpulkan feedback dari tim dan umat
3. **Content** - Siapkan konten real (text, gambar, video)
4. **Backend development** - Mulai develop backend dan CMS
5. **Testing** - Test di berbagai device dan browser
6. **Deployment** - Deploy ke hosting untuk production
