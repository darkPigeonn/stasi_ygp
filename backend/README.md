# Backend API - Stasi Yohanes Gabriel Perboyre

REST API backend untuk Website Profile Stasi Yohanes Gabriel Perboyre menggunakan Node.js, Express, dan MySQL (XAMPP).

## 📋 Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## 🔧 Requirements

- Node.js (v16 or higher)
- XAMPP (MySQL & Apache)
- npm or yarn

## 📦 Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development

# XAMPP MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stasi_yohanes
DB_USER=root
DB_PASSWORD=

# JWT Secret (change in production)
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Frontend URL
FRONTEND_URL=http://localhost:5174
```

## 🗄️ Database Setup

### 1. Start XAMPP
- Buka XAMPP Control Panel
- Start Apache dan MySQL

### 2. Create Database
Buka phpMyAdmin (http://localhost/phpmyadmin) atau MySQL CLI:

```sql
CREATE DATABASE stasi_yohanes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Auto Create Tables
Tables akan otomatis dibuat saat server pertama kali dijalankan (Sequelize sync).

### 4. Create Admin User
Setelah database terbuat, create admin user pertama:

```bash
npm run create-admin
```

**Default Admin Credentials:**
- Email: `admin@stasiyohanes.org`
- Password: `admin123`

⚠️ **PENTING:** Ganti password setelah login pertama kali!

## 🚀 Running the Application

### Development Mode (with nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server akan berjalan di: **http://localhost:5000**

### Health Check
Test server: **http://localhost:5000/api/health**

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@stasiyohanes.org",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@stasiyohanes.org",
    "role": "admin"
  }
}
```

#### 2. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 3. Update Password
```http
PUT /api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "admin123",
  "newPassword": "newpassword123"
}
```

#### 4. Register New User (Admin Only)
```http
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "editor1",
  "email": "editor@stasiyohanes.org",
  "password": "password123",
  "role": "editor"
}
```

### CRUD Endpoints

All CRUD endpoints follow the same pattern:

#### Get All Resources
```http
GET /api/{resource}?page=1&limit=10&status=published&search=keyword
```

**Resources:**
- `/api/artikel`
- `/api/pengumuman`
- `/api/galeri`
- `/api/dps`
- `/api/pastor`
- `/api/wilayah`
- `/api/lingkungan`
- `/api/kategorial`
- `/api/formulir`
- `/api/sejarah`
- `/api/profile`
- `/api/intensi-misa`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (draft/published)
- `search` - Search by title

**Response:**
```json
{
  "success": true,
  "count": 50,
  "totalPages": 5,
  "currentPage": 1,
  "data": [...]
}
```

#### Get Single Resource
```http
GET /api/{resource}/{id}
```

#### Get by Slug (for Artikel & Pengumuman)
```http
GET /api/{resource}/slug/{slug}
```

#### Create Resource
```http
POST /api/{resource}
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Fields depend on resource type
```

#### Update Resource
```http
PUT /api/{resource}/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Delete Resource (Admin Only)
```http
DELETE /api/{resource}/{id}
Authorization: Bearer <token>
```

### Specific Endpoint Examples

#### Create Artikel
```http
POST /api/artikel
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "Judul Artikel"
author: "Penulis"
publishDate: "2024-11-22"
content: "<p>Isi artikel dengan HTML</p>"
status: "published"
images: [file1.jpg, file2.jpg] // Multiple files
```

#### Create Pengumuman
```http
POST /api/pengumuman
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "Judul Pengumuman"
category: "Pengumuman Stasi"
content: "<p>Isi pengumuman</p>"
publishDate: "2024-11-22"
isPriority: true
status: "published"
images: [file1.jpg] // With captions in JSON
```

#### Create DPS/BGKS
```http
POST /api/dps
Authorization: Bearer <token>
Content-Type: multipart/form-data

type: "DPS/DPP"
position: "Ketua"
subPosition: ""
baptismName: "Yohanes"
fullName: "Yohanes Doe"
photo: file.jpg
order: 1
```

#### Create Pastor
```http
POST /api/pastor
Authorization: Bearer <token>
Content-Type: multipart/form-data

pastorType: "Gembala Kami"
priestType: "Romo Paroki/Stasi"
name: "Romo John Doe"
nickname: "Romo John"
ordinationDate: "2010-05-15"
serveFrom: 2022
serveTo: null // or year number
photo: file.jpg
biography: "Biografi singkat"
```

#### Create Wilayah & Lingkungan
```http
POST /api/wilayah
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: "Wilayah 1"
chairman: "Ketua Wilayah 1"
mapImage: map.jpg

POST /api/lingkungan
Authorization: Bearer <token>
Content-Type: application/json

{
  "wilayahId": 1,
  "name": "Lingkungan Santo Petrus",
  "chairman": "Ketua Lingkungan",
  "boundaryNorth": "Utara berbatasan dengan...",
  "boundaryEast": "Timur berbatasan dengan...",
  "boundarySouth": "Selatan berbatasan dengan...",
  "boundaryWest": "Barat berbatasan dengan...",
  "familyCount": 25
}
```

#### Update Profile
```http
PUT /api/profile/1
Authorization: Bearer <token>
Content-Type: multipart/form-data

stasiName: "Stasi Yohanes Gabriel Perboyre"
parokiName: "Paroki Santo Yakobus Kelapa Gading"
address: "<p>Alamat lengkap</p>"
phone1: "021-1234567"
email: "info@stasiyohanes.org"
logo: file.jpg
massSchedule: [{"type":"Misa Mingguan","day":"Minggu","time":"07:00 & 17:00"}]
socialMedia: {"instagram":"url","youtube":"url","facebook":"url"}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── models/
│   │   ├── User.js
│   │   ├── Artikel.js
│   │   ├── Pengumuman.js
│   │   ├── Galeri.js
│   │   ├── DPS.js
│   │   ├── Pastor.js
│   │   ├── Wilayah.js
│   │   ├── Lingkungan.js
│   │   ├── Kategorial.js
│   │   ├── Formulir.js
│   │   ├── Sejarah.js
│   │   ├── Profile.js
│   │   ├── IntensiMisa.js
│   │   └── index.js             # Model relationships
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── crudController.js    # Generic CRUD controller
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── crud.js              # CRUD routes
│   ├── utils/
│   │   ├── jwt.js               # JWT helpers
│   │   ├── slugify.js           # Slug generator
│   │   └── createAdmin.js       # Admin seeder
│   └── server.js                # Express app entry point
├── uploads/
│   ├── images/                  # Uploaded images
│   └── documents/               # Uploaded documents
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json
└── README.md
```

## 🔐 Authorization Levels

- **Public**: Read-only access to all content
- **Editor**: Create and update content
- **Admin**: Full access including delete and user management

## 📝 Model Specifications

### Artikel
- title, slug, author, publishDate, content (TinyMCE)
- images (JSON array), status, views

### Pengumuman
- title, slug, category, publishDate, content (TinyMCE)
- images (JSON with captions), isPriority, status

### Galeri
- title, images (JSON with captions), googlePhotoUrl

### DPS
- type (DPS/DPP, BGKS/BGKP), position, subPosition
- baptismName, fullName, photo, order

### Pastor
- pastorType (Gembala Kami, Pernah Berkarya)
- priestType (Romo Paroki/Stasi, Romo Rekan)
- name, nickname, ordinationDate, serveFrom, serveTo
- photo, biography

### Wilayah & Lingkungan
- Wilayah: name, chairman, mapImage
- Lingkungan: wilayahId, name, chairman, boundaries (N/E/S/W), familyCount

### Kategorial
- name, content (TinyMCE), schedule, contact, image, order

### Formulir
- name, category, fileUrl, description

### Sejarah
- year, category, content (TinyMCE), order

### Profile
- stasiName, parokiName, logo, address
- phone1/2/3, email, officeHours
- massSchedule (JSON), socialMedia (JSON)

### IntensiMisa
- contactWA, format, deadline, offering, qrCode
- Church account (name, bank, number, QR)
- Social account (name, bank, number, QR)

## 🐛 Troubleshooting

### Cannot connect to database
1. Pastikan XAMPP MySQL sudah running
2. Check database name di phpMyAdmin
3. Verify credentials di `.env`

### File upload error
1. Check folder `uploads/` sudah ada
2. Verify file size tidak melebihi 5MB
3. Check file format sesuai (images: jpg/png, docs: pdf/doc)

### Port already in use
Change PORT in `.env` file to another port (e.g., 5001)

## 📞 Support

Untuk bantuan teknis, hubungi tim IT Stasi Yohanes Gabriel Perboyre.
