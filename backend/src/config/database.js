const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: 60000,
    },
    logging: process.env.NODE_ENV === 'development' ? false : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
      evict: 10000,
      handleDisconnects: true
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    retry: {
      max: 3
    }
  }
);

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MySQL database...');
    console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
    console.log(`   Database: ${process.env.DB_NAME}`);

    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    // Skip sync karena tabel sudah dibuat via SQL manual
    console.log('✅ Models loaded successfully.\n');
  } catch (error) {
    console.error('\n❌ Unable to connect to the database!');
    console.error('   Error:', error.message);
    console.error('\n📋 Checklist:');
    console.error('   1. XAMPP MySQL sudah running?');
    console.error('   2. Database "stasi_yohanes" sudah dibuat?');
    console.error('   3. Konfigurasi .env sudah benar?\n');
    // Don't exit, let it retry
    throw error;
  }
};

module.exports = { sequelize, connectDB };
