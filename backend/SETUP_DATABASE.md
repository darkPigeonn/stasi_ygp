# Setup Database - Langkah demi Langkah

## 📋 Prasyarat

1. **XAMPP sudah terinstall**
2. **MySQL di XAMPP sudah running** (Start di XAMPP Control Panel)
3. **phpMyAdmin bisa diakses** di `http://localhost/phpmyadmin`

## 🔧 Langkah Setup Database

### Step 1: Buat Database

1. Buka **phpMyAdmin** di browser: `http://localhost/phpmyadmin`
2. Klik tab **"Databases"** di menu atas
3. Di kolom "Create database":
   - Nama database: `stasi_yohanes`
   - Collation: pilih `utf8mb4_unicode_ci`
4. Klik tombol **"Create"**

![Create Database](https://i.imgur.com/example-create-db.png)

### Step 2: Jalankan Schema SQL

**Metode 1: Via phpMyAdmin (RECOMMENDED)**

1. Setelah database dibuat, klik nama database **"stasi_yohanes"** di sidebar kiri
2. Klik tab **"SQL"** di menu atas
3. Buka file `backend/database_schema.sql` dengan text editor
4. **Copy semua isi file** (Ctrl+A, Ctrl+C)
5. **Paste** di kotak SQL query di phpMyAdmin
6. Klik tombol **"Go"** di kanan bawah
7. Tunggu sampai muncul pesan sukses "X rows affected"

**Metode 2: Import File SQL**

1. Klik database **"stasi_yohanes"** di sidebar kiri
2. Klik tab **"Import"** di menu atas
3. Klik tombol **"Choose File"**
4. Pilih file `backend/database_schema.sql`
5. Scroll ke bawah, klik **"Import"** (atau "Go")
6. Tunggu sampai selesai

### Step 3: Verifikasi Tabel

Setelah schema dijalankan, verifikasi bahwa tabel sudah dibuat:

1. Klik database **"stasi_yohanes"** di sidebar
2. Anda harus melihat **13 tabel**:
   - ✅ users
   - ✅ artikels
   - ✅ pengumumans
   - ✅ galeris
   - ✅ dps
   - ✅ pastors
   - ✅ wilayahs
   - ✅ lingkungans
   - ✅ kategorials
   - ✅ formulirs
   - ✅ sejarahs
   - ✅ profiles
   - ✅ intensi_misas

### Step 4: Jalankan Seeder

Setelah tabel dibuat, jalankan seeder untuk mengisi data sample:

```bash
cd backend
npm run seed
```

Output yang diharapkan:

```
🌱 Starting database seeding...

✅ Database connection established.

⚠️  Clearing existing data...
✅ Existing data cleared.

📝 Seeding Users...
   ✅ 3 users created

📝 Seeding Artikels...
   ✅ 6 artikels created

📝 Seeding Pengumumans...
   ✅ 5 pengumumans created

... (dan seterusnya)

🎉 Database seeding completed successfully!

📊 Seeding Summary:
   - Users: 3
   - Artikels: 6
   - Pengumumans: 5
   - Galeris: 4
   - DPS: 14
   - Pastors: 6
   - Wilayahs: 4
   - Lingkungans: 9
   - Kategorials: 7
   - Formulirs: 10
   - Sejarahs: 9
   - Profile: 1
   - Intensi Misa: 1
```

## ✅ Verifikasi Data di phpMyAdmin

1. Buka phpMyAdmin: `http://localhost/phpmyadmin`
2. Klik database **"stasi_yohanes"**
3. Klik tabel **"users"**
4. Klik tab **"Browse"**
5. Anda harus melihat **3 users**: admin, editor1, editor2

Lakukan hal yang sama untuk tabel lainnya untuk memastikan data sudah terisi.

## 🔐 Login Credentials

Setelah seeding selesai, Anda bisa login dengan:

**Admin:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@stasiyohanes.org`

**Editor:**
- Username: `editor1`
- Password: `editor123`
- Email: `editor1@stasiyohanes.org`

## ⚠️ Troubleshooting

### Error: Access denied for user 'root'@'localhost'

**Solusi:**
1. Periksa file `.env` di folder `backend`
2. Pastikan:
   ```
   DB_USER=root
   DB_PASSWORD=
   ```
   (Password kosong untuk XAMPP default)

### Error: Database 'stasi_yohanes' doesn't exist

**Solusi:**
1. Pastikan Anda sudah membuat database di Step 1
2. Periksa ejaan nama database (harus: `stasi_yohanes`)

### Error: Table doesn't exist

**Solusi:**
1. Jalankan ulang `database_schema.sql` di phpMyAdmin (Step 2)
2. Pastikan tidak ada error saat menjalankan SQL

### MySQL tidak bisa start di XAMPP

**Solusi:**
1. Port 3306 mungkin sudah dipakai aplikasi lain
2. Klik "Config" di XAMPP Control Panel > my.ini
3. Cari baris `port=3306`, ubah ke port lain (misal: 3307)
4. Jangan lupa update `.env`:
   ```
   DB_PORT=3307
   ```

## 🔄 Reset Database (Mulai dari Awal)

Jika ingin reset semua data dan mulai dari awal:

### Cara 1: Drop & Recreate Database

1. Buka phpMyAdmin
2. Klik database "stasi_yohanes"
3. Klik tab "Operations"
4. Scroll ke bawah, klik "Drop the database (DROP)"
5. Konfirmasi
6. Ulangi dari **Step 1** di atas

### Cara 2: Jalankan Seeder Ulang

Seeder otomatis akan menghapus semua data lama:

```bash
cd backend
npm run seed
```

**PERINGATAN:** Ini akan menghapus SEMUA data di database!

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:
1. Screenshot error yang muncul
2. Cek apakah MySQL di XAMPP sudah running (lampu hijau)
3. Cek file `.env` apakah konfigurasi database sudah benar
4. Lihat dokumentasi di `SEEDER_README.md`

## 🎯 Next Steps

Setelah database setup selesai:

1. **Jalankan Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Jalankan Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Login:**
   - Buka `http://localhost:5174`
   - Login dengan admin credentials
   - Mulai explore website!

---

**Happy Coding! 🚀**
