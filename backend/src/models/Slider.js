const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Slider = sequelize.define('Slider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Judul Slider'
  },
  subtitle: {
    type: DataTypes.STRING(255),
    comment: 'Sub Judul Slider'
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Path gambar slider - recommended 1920x600px'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Urutan tampil slider',
    field: 'display_order'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Status aktif slider',
    field: 'is_active'
  },
  linkUrl: {
    type: DataTypes.STRING(255),
    comment: 'URL tujuan jika slider diklik (opsional)',
    field: 'link_url'
  }
}, {
  tableName: 'sliders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Slider;
