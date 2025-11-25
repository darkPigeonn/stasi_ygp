const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DPS = sequelize.define('DPS', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('DPS', 'BGKS'),
    allowNull: false,
    comment: 'DPS/BGKS'
  },
  position: {
    type: DataTypes.STRING(100),
    field: 'position',
    allowNull: false,
    comment: 'Jabatan - bisa tambah jabatan'
  },
  subPosition: {
    type: DataTypes.STRING(100),
    field: 'sub_position',
    comment: 'Sub Jabatan - bisa tambah sub jabatan'
  },
  baptismName: {
    type: DataTypes.STRING(100),
    field: 'baptism_name',
    allowNull: false,
    comment: 'Nama Baptis'
  },
  fullName: {
    type: DataTypes.STRING(150),
    field: 'full_name',
    allowNull: false,
    comment: 'Nama Lengkap'
  },
  photo: {
    type: DataTypes.STRING(255),
    field: 'photo',
    comment: 'Photo URL'
  },
  order: {
    type: DataTypes.INTEGER,
    field: 'order',
    defaultValue: 0,
    comment: 'Urutan tampilan'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true
  }
}, {
  tableName: 'dps'
});

module.exports = DPS;
