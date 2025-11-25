const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const IntensiMisa = sequelize.define('IntensiMisa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contactWA: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'contact_wa',
    comment: 'CP Intensi Misa - https://wa.me/<nomor_telepon>'
  },
  format: {
    type: DataTypes.TEXT,
    comment: 'Format Intensi - TinyMCE'
  },
  deadline: {
    type: DataTypes.TEXT,
    comment: 'Batas Penyampaian - TinyMCE'
  },
  offering: {
    type: DataTypes.TEXT,
    comment: 'Persembahan Intensi Misa - TinyMCE'
  },
  qrCode: {
    type: DataTypes.STRING(255),
    comment: 'Upload QR'
  },
  // Persembahan Gereja
  churchAccountName: {
    type: DataTypes.STRING(150),
    comment: 'Persembahan Umat Untuk Gereja - Atas Nama'
  },
  churchBankName: {
    type: DataTypes.STRING(100),
    comment: 'Persembahan Umat Untuk Gereja - Nama Bank'
  },
  churchAccountNumber: {
    type: DataTypes.STRING(50),
    comment: 'Persembahan Umat Untuk Gereja - No Rekening'
  },
  churchQRCode: {
    type: DataTypes.STRING(255),
    field: 'church_qr_code',
    comment: 'Persembahan Umat Untuk Gereja - Upload QR no Rekening'
  },
  // Persembahan Karya Sosial
  socialAccountName: {
    type: DataTypes.STRING(150),
    comment: 'Persembahan Umat Untuk Karya Sosial - Atas Nama'
  },
  socialBankName: {
    type: DataTypes.STRING(100),
    comment: 'Persembahan Umat Untuk Karya Sosial - Nama Bank'
  },
  socialAccountNumber: {
    type: DataTypes.STRING(50),
    comment: 'Persembahan Umat Untuk Karya Sosial - No Rekening'
  },
  socialQRCode: {
    type: DataTypes.STRING(255),
    field: 'social_qr_code',
    comment: 'Persembahan Umat Untuk Karya Sosial - Upload QR no Rekening'
  }
}, {
  tableName: 'intensi_misas'
});

module.exports = IntensiMisa;
