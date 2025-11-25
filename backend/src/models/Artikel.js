const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Artikel = sequelize.define('Artikel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  author: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ditulis Oleh'
  },
  publishDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Tanggal'
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Isi Artikel - TinyMCE'
  },
  images: {
    type: DataTypes.JSON,
    comment: 'Galeri Foto - bisa lebih dari satu'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'artikels'
});

module.exports = Artikel;
