const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wilayah = sequelize.define('Wilayah', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nama Wilayah'
  },
  chairman: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Ketua Wilayah'
  },
  mapImage: {
    type: DataTypes.STRING(255),
    comment: 'Upload Peta'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'wilayahs'
});

module.exports = Wilayah;
