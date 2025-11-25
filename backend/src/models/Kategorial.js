const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Kategorial = sequelize.define('Kategorial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    comment: 'Nama Kategorial'
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Isi Kategorial - TinyMCE'
  },
  schedule: {
    type: DataTypes.STRING(255),
    comment: 'Jadwal Pertemuan'
  },
  contact: {
    type: DataTypes.STRING(255),
    comment: 'Kontak Person'
  },
  image: {
    type: DataTypes.STRING(255),
    comment: 'Gambar kategorial'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Urutan tampilan'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'kategoriales',
  timestamps: true,
  underscored: false
});

module.exports = Kategorial;
