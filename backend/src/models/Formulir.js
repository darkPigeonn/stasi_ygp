const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Formulir = sequelize.define('Formulir', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Nama Formulir'
  },
  bookmark: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Bookmark/icon identifier for display'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
    comment: 'Status publikasi formulir'
  },
  kategoriFormulirId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kategori_formulirs',
      key: 'id'
    },
    comment: 'Foreign key ke kategori_formulirs'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Kategori formulir (legacy)'
  },
  document: {
    type: DataTypes.STRING(255),
    field: 'fileUrl',
    allowNull: false,
    comment: 'Upload Formulir - File URL (PDF)'
  },
  description: {
    type: DataTypes.TEXT,
    comment: 'Deskripsi formulir'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'formulirs',
  timestamps: true,
  underscored: false
});

module.exports = Formulir;
