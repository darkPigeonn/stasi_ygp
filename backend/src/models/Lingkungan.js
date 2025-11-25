const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lingkungan = sequelize.define('Lingkungan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  wilayahId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'wilayahs',
      key: 'id'
    },
    comment: 'Nama Wilayah - Dropdown Wilayah'
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Nama Lingkungan'
  },
  chairman: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Ketua Lingkungan'
  },
  boundaryNorth: {
    type: DataTypes.STRING(255),
    comment: 'Batas Lingkungan - Utara'
  },
  boundaryEast: {
    type: DataTypes.STRING(255),
    comment: 'Batas Lingkungan - Timur'
  },
  boundarySouth: {
    type: DataTypes.STRING(255),
    comment: 'Batas Lingkungan - Selatan'
  },
  boundaryWest: {
    type: DataTypes.STRING(255),
    comment: 'Batas Lingkungan - Barat'
  },
  familyCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Jumlah Keluarga'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'lingkungans'
});

module.exports = Lingkungan;
