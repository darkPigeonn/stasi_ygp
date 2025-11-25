const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Galeri = sequelize.define('Galeri', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    comment: 'Galeri Foto dengan caption - Upload lebih dari satu'
  },
  googlePhotoUrl: {
    type: DataTypes.STRING(500),
    comment: 'Link URL Google Photo - Redirect Google Photo'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'galeris'
});

module.exports = Galeri;
