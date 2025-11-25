const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KaryaSosial = sequelize.define('KaryaSosial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Nama Program Karya Sosial'
  },
  description: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    comment: 'HTML content for description'
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'Heart',
    comment: 'Icon name (Lucide React)'
  },
  activities: {
    type: DataTypes.TEXT('long'),
    comment: 'HTML content for activities'
  },
  image: {
    type: DataTypes.STRING(255),
    comment: 'Gambar program'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Urutan tampilan'
  }
}, {
  tableName: 'karya_sosials',
  timestamps: true,
  underscored: false
});

module.exports = KaryaSosial;
