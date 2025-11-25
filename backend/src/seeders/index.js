const { sequelize } = require('../config/database');
const User = require('../models/User');
const Artikel = require('../models/Artikel');
const Pengumuman = require('../models/Pengumuman');
const Galeri = require('../models/Galeri');
const DPS = require('../models/DPS');
const Pastor = require('../models/Pastor');
const Wilayah = require('../models/Wilayah');
const Lingkungan = require('../models/Lingkungan');
const Kategorial = require('../models/Kategorial');
const Formulir = require('../models/Formulir');
const Sejarah = require('../models/Sejarah');
const Profile = require('../models/Profile');
const IntensiMisa = require('../models/IntensiMisa');

// Import seeder data
const usersData = require('./data/users');
const artikelsData = require('./data/artikels');
const pengumumansData = require('./data/pengumumans');
const galerisData = require('./data/galeris');
const dpsData = require('./data/dps');
const pastorsData = require('./data/pastors');
const wilayahsData = require('./data/wilayahs');
const lingkungansData = require('./data/lingkungans');
const kategorialsData = require('./data/kategorials');
const formulirsData = require('./data/formulirs');
const sejarahsData = require('./data/sejarahs');
const profileData = require('./data/profile');
const intensiMisaData = require('./data/intensi-misa');

async function seedDatabase() {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    // Test koneksi database
    await sequelize.authenticate();
    console.log('✅ Database connection established.\n');

    // WARNING: Clear existing data (hati-hati!)
    console.log('⚠️  Clearing existing data...');

    try {
      // Disable foreign key checks temporarily
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

      // Truncate tables in any order (FK checks disabled)
      await sequelize.query('TRUNCATE TABLE lingkungans');
      await sequelize.query('TRUNCATE TABLE wilayahs');
      await sequelize.query('TRUNCATE TABLE intensi_misas');
      await sequelize.query('TRUNCATE TABLE profiles');
      await sequelize.query('TRUNCATE TABLE sejarahs');
      await sequelize.query('TRUNCATE TABLE formulirs');
      await sequelize.query('TRUNCATE TABLE kategoriales');
      await sequelize.query('TRUNCATE TABLE pastors');
      await sequelize.query('TRUNCATE TABLE dps');
      await sequelize.query('TRUNCATE TABLE galeris');
      await sequelize.query('TRUNCATE TABLE pengumumans');
      await sequelize.query('TRUNCATE TABLE artikels');
      await sequelize.query('TRUNCATE TABLE users');

      // Re-enable foreign key checks
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

      console.log('✅ Existing data cleared.\n');
    } catch (clearError) {
      console.log('⚠️  Skipping clear (tables might be empty): ' + clearError.message + '\n');
      // Re-enable FK checks even if error
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    // Seed data dalam urutan yang benar
    console.log('📝 Seeding Users...');
    await User.bulkCreate(usersData, { individualHooks: true });
    console.log(`   ✅ ${usersData.length} users created\n`);

    console.log('📝 Seeding Artikels...');
    await Artikel.bulkCreate(artikelsData);
    console.log(`   ✅ ${artikelsData.length} artikels created\n`);

    console.log('📝 Seeding Pengumumans...');
    await Pengumuman.bulkCreate(pengumumansData);
    console.log(`   ✅ ${pengumumansData.length} pengumumans created\n`);

    console.log('📝 Seeding Galeris...');
    await Galeri.bulkCreate(galerisData);
    console.log(`   ✅ ${galerisData.length} galeris created\n`);

    console.log('📝 Seeding DPS/BGKS...');
    await DPS.bulkCreate(dpsData);
    console.log(`   ✅ ${dpsData.length} DPS records created\n`);

    console.log('📝 Seeding Pastors...');
    await Pastor.bulkCreate(pastorsData);
    console.log(`   ✅ ${pastorsData.length} pastors created\n`);

    console.log('📝 Seeding Wilayahs...');
    const wilayahs = await Wilayah.bulkCreate(wilayahsData);
    console.log(`   ✅ ${wilayahs.length} wilayahs created\n`);

    console.log('📝 Seeding Lingkungans...');
    await Lingkungan.bulkCreate(lingkungansData);
    console.log(`   ✅ ${lingkungansData.length} lingkungans created\n`);

    console.log('📝 Seeding Kategorials...');
    await Kategorial.bulkCreate(kategorialsData);
    console.log(`   ✅ ${kategorialsData.length} kategorials created\n`);

    console.log('📝 Seeding Formulirs...');
    await Formulir.bulkCreate(formulirsData);
    console.log(`   ✅ ${formulirsData.length} formulirs created\n`);

    console.log('📝 Seeding Sejarahs...');
    await Sejarah.bulkCreate(sejarahsData);
    console.log(`   ✅ ${sejarahsData.length} sejarahs created\n`);

    console.log('📝 Seeding Profile...');
    await Profile.create(profileData);
    console.log(`   ✅ Profile created\n`);

    console.log('📝 Seeding Intensi Misa...');
    await IntensiMisa.create(intensiMisaData);
    console.log(`   ✅ Intensi Misa created\n`);

    console.log('🎉 Database seeding completed successfully!\n');

    // Summary
    console.log('📊 Seeding Summary:');
    console.log('   - Users:', await User.count());
    console.log('   - Artikels:', await Artikel.count());
    console.log('   - Pengumumans:', await Pengumuman.count());
    console.log('   - Galeris:', await Galeri.count());
    console.log('   - DPS:', await DPS.count());
    console.log('   - Pastors:', await Pastor.count());
    console.log('   - Wilayahs:', await Wilayah.count());
    console.log('   - Lingkungans:', await Lingkungan.count());
    console.log('   - Kategorials:', await Kategorial.count());
    console.log('   - Formulirs:', await Formulir.count());
    console.log('   - Sejarahs:', await Sejarah.count());
    console.log('   - Profile:', await Profile.count());
    console.log('   - Intensi Misa:', await IntensiMisa.count());
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
