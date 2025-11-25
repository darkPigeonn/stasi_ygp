const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Sejarah = sequelize.define('Sejarah', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Tahun'
  },
  category: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Kategori Sejarah'
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'Isi Sejarah - TinyMCE'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Urutan tampilan timeline'
  }
}, {
  tableName: 'sejarahs'
});

module.exports = Sejarah;
