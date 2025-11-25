# Setup Database MySQL (XAMPP)

## Langkah-langkah Setup Database

### 1. Start XAMPP
1. Buka XAMPP Control Panel
2. Klik **Start** pada **Apache** dan **MySQL**
3. Pastikan kedua service berwarna hijau (running)

### 2. Buka phpMyAdmin
1. Klik tombol **Admin** pada MySQL di XAMPP Control Panel

   ATAU

2. Buka browser dan akses: **http://localhost/phpmyadmin**

### 3. Create Database
1. Klik tab **"Databases"** di menu atas
2. Di bagian "Create database":
   - Database name: `stasi_yohanes`
   - Collation: `utf8mb4_unicode_ci`
3. Klik **"Create"**

### 4. Import SQL Schema

#### Opsi A: Import via phpMyAdmin (RECOMMENDED)
1. Setelah database dibuat, klik database **stasi_yohanes** di sidebar kiri
2. Klik tab **"Import"** di menu atas
3. Klik **"Choose File"**
4. Pilih file: `backend/database_schema.sql`
5. Scroll ke bawah dan klik **"Import"** atau **"Go"**
6. Tunggu sampai selesai (akan muncul pesan sukses)

#### Opsi B: Copy-Paste SQL
1. Klik database **stasi_yohanes** di sidebar kiri
2. Klik tab **"SQL"** di menu atas
3. Buka file `backend/database_schema.sql` dengan text editor
4. Copy semua isi file
5. Paste ke dalam text area SQL di phpMyAdmin
6. Klik **"Go"**

### 5. Verify Tables Created
Setelah import berhasil, Anda akan melihat 13 tabel:
- ✅ users
- ✅ artikels
- ✅ pengumumans
- ✅ galeris
- ✅ dps
- ✅ pastors
- ✅ wilayahs
- ✅ lingkungans
- ✅ kategoriales
- ✅ formulirs
- ✅ sejarahs
- ✅ profiles
- ✅ intensi_misas

### 6. Verify Database URL
Buka: **http://localhost/phpmyadmin/index.php?route=/database/structure&db=stasi_yohanes**

Anda harus melihat semua tabel di sana!

### 7. Create Admin User
Kembali ke terminal/command prompt:
```bash
cd backend
npm run create-admin
```

Output:
```
✅ Admin user created successfully!
   Email: admin@stasiyohanes.org
   Password: admin123
   ⚠️  Please change the password after first login!
```

### 8. Test Backend Server
```bash
npm run dev
```

Expected output:
```
🔄 Connecting to MySQL database...
   Host: localhost:3306
   Database: stasi_yohanes

✅ Database connection established successfully.

🔄 Synchronizing database models...
✅ Database models synchronized.

🚀 Server running in development mode on port 5000
📡 API URL: http://localhost:5000/api
📊 Health check: http://localhost:5000/api/health
```

### 9. Test API
Buka browser: **http://localhost:5000/api/health**

Response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-11-22T..."
}
```

## Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solusi:**
1. Cek password MySQL di XAMPP
2. Update `.env` file:
   ```
   DB_PASSWORD=your_mysql_password
   ```

### Error: "Database 'stasi_yohanes' doesn't exist"
**Solusi:**
1. Pastikan database sudah dibuat di phpMyAdmin
2. Cek nama database di `.env` sudah benar

### Error: "ECONNREFUSED"
**Solusi:**
1. Pastikan MySQL di XAMPP sudah running (hijau)
2. Restart MySQL di XAMPP Control Panel
3. Coba restart backend server: `npm run dev`

### Error: "Table ... doesn't exist"
**Solusi:**
1. Import ulang `database_schema.sql` via phpMyAdmin
2. Atau jalankan manual query di SQL tab phpMyAdmin

### Port 3306 already in use
**Solusi:**
1. Cek apakah ada MySQL lain yang running
2. Tutup MySQL service lain
3. Atau ubah port di XAMPP config

## Struktur Database

### Table: users
Menyimpan data admin dan editor yang dapat login ke sistem.

### Table: artikels
Menyimpan artikel/berita dengan images, slug, dan status publish.

### Table: pengumumans
Pengumuman dengan kategori, priority flag, dan images.

### Table: galeris
Galeri foto dengan support Google Photos link.

### Table: dps
Dewan Pastoral Stasi (DPS/BGKS).

### Table: pastors
Data pastor (current & former) dengan photo dan biography.

### Table: wilayahs & lingkungans
Struktur wilayah dan lingkungan dengan relasi (FK).

### Table: kategoriales
Kelompok kategorial (OMK, Bapak, Ibu, dll).

### Table: formulirs
Upload formulir (PDF, DOC) untuk download umat.

### Table: sejarahs
Timeline sejarah stasi.

### Table: profiles
Settings website (nama stasi, logo, alamat, dll).

### Table: intensi_misas
Info intensi misa dan rekening donasi.

## Next Steps

1. ✅ Database created
2. ✅ Tables imported
3. ✅ Admin user created
4. ✅ Backend server running
5. ➡️ Test API with Postman/Thunder Client
6. ➡️ Integrate with Frontend
7. ➡️ Build Admin Panel UI

---

**Database siap digunakan!** 🎉

Akses phpMyAdmin: **http://localhost/phpmyadmin**
Database: **stasi_yohanes**
Tables: **13 tables**
