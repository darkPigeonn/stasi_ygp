const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  stasiName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Nama Stasi/Paroki',
    field: 'stasi_name'
  },
  parokiName: {
    type: DataTypes.STRING(200),
    comment: 'Nama Paroki Induk',
    field: 'paroki_name'
  },
  logo: {
    type: DataTypes.STRING(255),
    comment: 'Logo Stasi/Paroki - Upload'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Alamat - TinyMCE'
  },
  phone1: {
    type: DataTypes.STRING(20),
    comment: 'No Tlp 1'
  },
  phone2: {
    type: DataTypes.STRING(20),
    comment: 'No Tlp 2'
  },
  phone3: {
    type: DataTypes.STRING(20),
    comment: 'No Tlp 3'
  },
  email: {
    type: DataTypes.STRING(100),
    comment: 'Email'
  },
  officeHours: {
    type: DataTypes.TEXT,
    comment: 'Jam buka sekretariat Stasi/Paroki - TinyMCE',
    field: 'office_hours'
  },
  massSchedule: {
    type: DataTypes.JSON,
    comment: 'Jadwal Misa - Array of objects',
    field: 'mass_schedule'
  },
  socialMedia: {
    type: DataTypes.JSON,
    comment: 'Social Media - Instagram, Youtube, Facebook URLs',
    field: 'social_media'
  },
  aboutSaint: {
    type: DataTypes.TEXT('long'),
    comment: 'Tentang Santo Pelindung - HTML content'
  },
  vision: {
    type: DataTypes.TEXT('long'),
    comment: 'Visi Stasi - HTML content'
  },
  mission: {
    type: DataTypes.TEXT('long'),
    comment: 'Misi Stasi - HTML content'
  }
}, {
  tableName: 'profiles',
  underscored: false,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Profile;
