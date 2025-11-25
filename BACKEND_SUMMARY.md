# Backend API - Summary & Quick Reference

## 🎯 Backend telah selesai dibuat dengan fitur lengkap!

### ✅ Yang Sudah Dibuat

#### 1. **Database Models** (13 Models)
Semua model sesuai spesifikasi Excel:
- ✅ User (Authentication)
- ✅ Artikel (dengan slug & images)
- ✅ Pengumuman (dengan kategori & priority)
- ✅ Galeri (dengan Google Photo URL)
- ✅ DPS (Dewan Pastoral Stasi)
- ✅ Pastor (Gembala Kami & Pernah Berkarya)
- ✅ Wilayah & Lingkungan (dengan relasi)
- ✅ Kategorial
- ✅ Formulir
- ✅ Sejarah
- ✅ Profile (Settings website)
- ✅ IntensiMisa (dengan info rekening & QR)

#### 2. **Authentication System**
- ✅ JWT-based authentication
- ✅ Login/Register endpoints
- ✅ Password hashing dengan bcrypt
- ✅ Role-based authorization (Admin & Editor)
- ✅ Protected routes middleware

#### 3. **CRUD Operations**
- ✅ Generic CRUD controller untuk semua model
- ✅ Pagination support
- ✅ Search & filter
- ✅ Slug generation otomatis
- ✅ View counter untuk artikel

#### 4. **File Upload**
- ✅ Multer configuration
- ✅ Image upload (JPEG, PNG, GIF, WEBP)
- ✅ Document upload (PDF, DOC, XLSX)
- ✅ Multiple file upload support
- ✅ File validation & size limit (5MB)

#### 5. **API Routes**
Semua endpoint tersedia:
```
/api/auth/*          - Authentication
/api/artikel/*       - CRUD Artikel
/api/pengumuman/*    - CRUD Pengumuman
/api/galeri/*        - CRUD Galeri
/api/dps/*           - CRUD DPS/BGKS
/api/pastor/*        - CRUD Pastor
/api/wilayah/*       - CRUD Wilayah
/api/lingkungan/*    - CRUD Lingkungan
/api/kategorial/*    - CRUD Kategorial
/api/formulir/*      - CRUD Formulir
/api/sejarah/*       - CRUD Sejarah
/api/profile/*       - CRUD Profile
/api/intensi-misa/*  - CRUD Intensi Misa
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Database (XAMPP)
```sql
CREATE DATABASE stasi_yohanes;
```

### 3. Configure .env
```bash
cp .env.example .env
# Edit .env dengan konfigurasi MySQL Anda
```

### 4. Create Admin User
```bash
npm run create-admin
```

### 5. Run Server
```bash
npm run dev
```

Server: **http://localhost:5000**

## 📚 API Quick Reference

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@stasiyohanes.org",
  "password": "admin123"
}
```

### Get All Artikel
```bash
GET http://localhost:5000/api/artikel?page=1&limit=10
```

### Create Artikel (with file upload)
```bash
POST http://localhost:5000/api/artikel
Authorization: Bearer <your-token>
Content-Type: multipart/form-data

title: "Judul Artikel"
author: "Penulis"
publishDate: "2024-11-22"
content: "<p>Isi artikel</p>"
status: "published"
images: [file1.jpg, file2.jpg]
```

### Get by Slug
```bash
GET http://localhost:5000/api/artikel/slug/judul-artikel
```

### Update
```bash
PUT http://localhost:5000/api/artikel/1
Authorization: Bearer <your-token>
Content-Type: multipart/form-data
```

### Delete (Admin only)
```bash
DELETE http://localhost:5000/api/artikel/1
Authorization: Bearer <your-token>
```

## 📋 Database Schema Summary

### Artikel
| Field | Type | Description |
|-------|------|-------------|
| title | STRING | Judul artikel |
| slug | STRING | URL-friendly slug (auto-generated) |
| author | STRING | Nama penulis |
| publishDate | DATE | Tanggal publish |
| content | TEXT | Konten HTML (TinyMCE) |
| images | JSON | Array gambar |
| status | ENUM | draft/published |
| views | INTEGER | Jumlah views |

### Pengumuman
| Field | Type | Description |
|-------|------|-------------|
| title | STRING | Judul pengumuman |
| slug | STRING | URL slug |
| category | ENUM | Pernikahan, Tahbisan Imam, dll |
| content | TEXT | Konten HTML |
| images | JSON | Array gambar dengan caption |
| isPriority | BOOLEAN | Pengumuman penting |
| status | ENUM | draft/published |

### DPS
| Field | Type | Description |
|-------|------|-------------|
| type | ENUM | DPS/DPP atau BGKS/BGKP |
| position | STRING | Jabatan |
| subPosition | STRING | Sub jabatan |
| baptismName | STRING | Nama baptis |
| fullName | STRING | Nama lengkap |
| photo | STRING | Path foto |
| order | INTEGER | Urutan tampilan |

### Pastor
| Field | Type | Description |
|-------|------|-------------|
| pastorType | ENUM | Gembala Kami/Pernah Berkarya |
| priestType | ENUM | Romo Paroki/Rekan |
| name | STRING | Nama pastor |
| nickname | STRING | Nama panggilan |
| ordinationDate | DATE | Tanggal tahbisan |
| serveFrom | INTEGER | Tahun mulai berkarya |
| serveTo | INTEGER | Tahun selesai (null jika aktif) |
| photo | STRING | Path foto |
| biography | TEXT | Biografi |

### Wilayah & Lingkungan
**Wilayah:**
- name, chairman, mapImage

**Lingkungan:**
- wilayahId (FK), name, chairman
- boundaries (North, East, South, West)
- familyCount

### Profile (Website Settings)
- stasiName, parokiName, logo
- address, phones (1,2,3), email
- officeHours, massSchedule (JSON)
- socialMedia (JSON)

### IntensiMisa (Payment Info)
- contactWA, format, deadline, offering
- Church account (name, bank, number, QR)
- Social account (name, bank, number, QR)

## 🔧 Testing dengan Postman/Thunder Client

### 1. Login & Get Token
```http
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@stasiyohanes.org",
  "password": "admin123"
}
```

Save token dari response!

### 2. Use Token in Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Test File Upload
```http
POST {{baseUrl}}/api/artikel
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Form data:
title: Test Artikel
author: Admin
publishDate: 2024-11-22
content: <p>Test content</p>
status: published
images: [select file from computer]
```

## 📁 File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js           # Sequelize config
│   ├── models/                   # 13 Database models
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── crudController.js     # Generic CRUD
│   ├── middleware/
│   │   ├── auth.js               # JWT middleware
│   │   └── upload.js             # Multer config
│   ├── routes/
│   │   ├── auth.js
│   │   └── crud.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── slugify.js
│   │   └── createAdmin.js
│   └── server.js
├── uploads/
│   ├── images/
│   └── documents/
└── package.json
```

## 🎯 Next Steps

### Frontend Integration
1. Create API service layer di frontend
2. Setup axios untuk HTTP requests
3. Implement authentication flow
4. Connect CRUD operations ke backend

### Admin Panel (Future)
1. Build admin dashboard UI
2. Implement CRUD forms
3. File upload UI
4. User management

### Deployment
1. Setup production database
2. Configure environment variables
3. Deploy backend ke hosting (Railway/Render)
4. Setup HTTPS & domain

## 📞 Support & Documentation

- **Backend README**: `backend/README.md` (lengkap dengan API docs)
- **Main README**: `README.md` (installation guide)
- **API Base URL**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

---

✅ **Backend sudah 100% siap digunakan!**

Semua endpoint CRUD sudah berfungsi dengan:
- ✅ Authentication & Authorization
- ✅ File Upload
- ✅ Database Models sesuai spesifikasi
- ✅ Error Handling
- ✅ Input Validation
- ✅ Pagination & Search
- ✅ Slug generation
- ✅ View counter

Tinggal integrasikan dengan frontend dan buat admin panel UI! 🚀
