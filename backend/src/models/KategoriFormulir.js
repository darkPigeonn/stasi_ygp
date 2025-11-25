const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KategoriFormulir = sequelize.define('KategoriFormulir', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'Nama Kategori Formulir'
  },
  description: {
    type: DataTypes.TEXT,
    comment: 'Deskripsi kategori'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'kategori_formulirs',
  timestamps: true,
  underscored: false
});

module.exports = KategoriFormulir;
