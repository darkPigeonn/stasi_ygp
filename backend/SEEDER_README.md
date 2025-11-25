# Database Seeder - Stasi Yohanes Gabriel Perboyre

## 📋 Deskripsi

Seeder ini digunakan untuk mengisi database dengan data sample yang realistis untuk keperluan development dan testing. Data yang di-seed mencakup semua tabel dalam sistem.

## 🗂️ Struktur File

```
backend/
└── src/
    └── seeders/
        ├── index.js              # Main seeder script
        └── data/
            ├── users.js          # Data user (admin & editor)
            ├── artikels.js       # Data artikel
            ├── pengumumans.js    # Data pengumuman
            ├── galeris.js        # Data galeri
            ├── dps.js            # Data DPS/BGKS
            ├── pastors.js        # Data pastor
            ├── wilayahs.js       # Data wilayah
            ├── lingkungans.js    # Data lingkungan
            ├── kategorials.js    # Data kategorial
            ├── formulirs.js      # Data formulir
            ├── sejarahs.js       # Data sejarah
            ├── profile.js        # Data profile stasi
            └── intensi-misa.js   # Data intensi misa
```

## ⚙️ Cara Menggunakan

### 1. Pastikan Database Sudah Dibuat

Pastikan database `stasi_yohanes` sudah dibuat di phpMyAdmin:

```sql
CREATE DATABASE stasi_yohanes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Jalankan Schema SQL

Jalankan file `database_schema.sql` terlebih dahulu untuk membuat tabel:

```bash
# Via MySQL CLI
mysql -u root -p stasi_yohanes < database_schema.sql

# Atau via phpMyAdmin
# Import file database_schema.sql
```

### 3. Jalankan Seeder

```bash
cd backend
npm run seed
```

atau

```bash
npm run seed:fresh
```

## 📊 Data yang Di-seed

### Users (3 records)
- **Admin**:
  - Username: `admin`
  - Email: `admin@stasiyohanes.org`
  - Password: `admin123`
  - Role: `admin`

- **Editor 1**:
  - Username: `editor1`
  - Email: `editor1@stasiyohanes.org`
  - Password: `editor123`
  - Role: `editor`

- **Editor 2**:
  - Username: `editor2`
  - Email: `editor2@stasiyohanes.org`
  - Password: `editor123`
  - Role: `editor`

### Artikels (6 records)
- 5 artikel published
- 1 artikel draft
- Topik: Paskah, Bakti Sosial, Retret, Hari Raya Santo, Katekese

### Pengumumans (5 records)
- Kategori: Pernikahan, Tahbisan Diakon, Pengumuman Stasi, Pengumuman Paroki
- 2 pengumuman prioritas

### Galeris (4 records)
- Galeri Paskah 2024
- Galeri Bakti Sosial Ramadhan
- Galeri Hari Raya Santo Pelindung
- Galeri Retret Kaum Muda

### DPS & BGKS (14 records)
- 7 DPS/DPP: Ketua, Wakil, Sekretaris, Bendahara, + Seksi-seksi
- 7 BGKS/BGKP: Ketua, Wakil, Sekretaris, Bendahara, + Anggota

### Pastors (6 records)
- 2 Gembala Kami (current)
- 4 Pernah Berkarya (historical)

### Wilayahs (4 records)
- Wilayah Santa Maria
- Wilayah Santo Yoseph
- Wilayah Santo Paulus
- Wilayah Santo Fransiskus

### Lingkungans (9 records)
- 3 lingkungan di Wilayah 1
- 2 lingkungan di Wilayah 2
- 2 lingkungan di Wilayah 3
- 2 lingkungan di Wilayah 4

### Kategorials (7 records)
- Mudika
- OMK
- Wanita Katolik
- Pria Katolik
- Lansia
- Bina Iman Anak
- Legio Maria

### Formulirs (10 records)
- Formulir Sakramen (Baptis, Komuni, Krisma, Nikah)
- Formulir Administrasi
- Formulir Katekese & Liturgi

### Sejarahs (9 records)
- Timeline dari 1985 - 2024
- Pendirian, Pembangunan, Renovasi, Era Digital

### Profile (1 record)
- Informasi lengkap stasi
- Jadwal misa
- Kontak & alamat
- Social media

### Intensi Misa (1 record)
- Format intensi
- Kontak person
- Rekening persembahan

## ⚠️ Perhatian

### PERINGATAN: Data Akan Dihapus!

Seeder ini akan **menghapus semua data existing** di database sebelum mengisi data baru.

**JANGAN JALANKAN DI PRODUCTION DATABASE!**

### Backup Data

Jika Anda memiliki data penting, lakukan backup terlebih dahulu:

```bash
# Backup via mysqldump
mysqldump -u root -p stasi_yohanes > backup_$(date +%Y%m%d).sql

# Atau via phpMyAdmin Export
```

## 🔧 Troubleshooting

### Error: Unable to connect to database

**Solusi:**
1. Pastikan XAMPP MySQL sudah running
2. Periksa konfigurasi `.env`:
   - `DB_HOST=localhost`
   - `DB_PORT=3306`
   - `DB_NAME=stasi_yohanes`
   - `DB_USER=root`
   - `DB_PASSWORD=` (kosong untuk default XAMPP)

### Error: Table doesn't exist

**Solusi:**
1. Jalankan `database_schema.sql` terlebih dahulu
2. Pastikan semua tabel sudah dibuat dengan benar

### Error: Foreign key constraint fails

**Solusi:**
- Seeder sudah mengatur urutan insert yang benar
- Pastikan tidak ada perubahan pada struktur foreign key

### Error: Duplicate entry

**Solusi:**
- Seeder akan clear semua data dulu sebelum insert
- Jika masih error, coba hapus data manual atau drop & recreate database

## 📝 Customisasi Data Seeder

Untuk mengubah atau menambah data seeder, edit file di folder `src/seeders/data/`:

1. Buka file yang ingin diubah (misal: `artikels.js`)
2. Tambah, edit, atau hapus data sesuai kebutuhan
3. Pastikan format data sesuai dengan model
4. Jalankan seeder ulang: `npm run seed`

### Contoh: Menambah User Baru

Edit file `src/seeders/data/users.js`:

```javascript
module.exports = [
  // ... existing users
  {
    username: 'editor3',
    email: 'editor3@stasiyohanes.org',
    password: 'editor123',
    role: 'editor',
    isActive: true
  }
];
```

## 🎯 Best Practices

1. **Development**: Jalankan seeder setiap kali reset database untuk development
2. **Testing**: Gunakan seeder untuk membuat environment testing yang konsisten
3. **Production**: JANGAN pernah jalankan seeder di production!
4. **Backup**: Selalu backup sebelum menjalankan seeder
5. **Custom Data**: Simpan custom data di file terpisah jika perlu

## 📞 Bantuan

Jika ada masalah atau pertanyaan, hubungi tim developer atau buat issue di repository project.

## 📄 License

Internal use only - Stasi Yohanes Gabriel Perboyre
