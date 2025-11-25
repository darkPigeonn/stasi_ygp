const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pengumuman = sequelize.define('Pengumuman', {
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
  category: {
    type: DataTypes.ENUM('Pernikahan', 'Tahbisan Imam', 'Tahbisan Diakon', 'Pengumuman Paroki', 'Pengumuman Stasi'),
    allowNull: false,
    comment: 'Kategori Pengumuman'
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Isi Pengumuman - TinyMCE'
  },
  images: {
    type: DataTypes.JSON,
    comment: 'Galeri Foto dengan caption - Upload lebih dari satu'
  },
  publishDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  isPriority: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Pengumuman Penting'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'pengumumans'
});

module.exports = Pengumuman;
