const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Pastor = sequelize.define('Pastor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pastorType: {
    type: DataTypes.ENUM('Gembala Kami', 'Pernah Berkarya'),
    allowNull: false,
    comment: 'Pastor'
  },
  priestType: {
    type: DataTypes.ENUM('Romo Paroki/Stasi', 'Romo Rekan'),
    allowNull: false,
    comment: 'Tipe Pastor'
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'Nama Pastor'
  },
  nickname: {
    type: DataTypes.STRING(100),
    comment: 'Nama Panggilan'
  },
  ordinationDate: {
    type: DataTypes.DATEONLY,
    comment: 'Tahbisan Imamat - Hanya Gembala Kami'
  },
  serveFrom: {
    type: DataTypes.INTEGER,
    comment: 'Berkarya Dari - Tahun'
  },
  serveTo: {
    type: DataTypes.INTEGER,
    comment: 'Berkarya Sampai - Tahun / Sekarang'
  },
  photo: {
    type: DataTypes.STRING(255),
    comment: 'Foto - Hanya Gembala Kami'
  },
  biography: {
    type: DataTypes.TEXT,
    comment: 'Biografi singkat'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'pastors'
});

module.exports = Pastor;
