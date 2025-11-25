const User = require('./User');
const Artikel = require('./Artikel');
const Pengumuman = require('./Pengumuman');
const Galeri = require('./Galeri');
const DPS = require('./DPS');
const Pastor = require('./Pastor');
const Wilayah = require('./Wilayah');
const Lingkungan = require('./Lingkungan');
const Kategorial = require('./Kategorial');
const Formulir = require('./Formulir');
const KategoriFormulir = require('./KategoriFormulir');
const Sejarah = require('./Sejarah');
const Profile = require('./Profile');
const IntensiMisa = require('./IntensiMisa');
const KaryaSosial = require('./KaryaSosial');
const Jabatan = require('./Jabatan');
const SubJabatan = require('./SubJabatan');
const Slider = require('./Slider');

// Define relationships
Wilayah.hasMany(Lingkungan, {
  foreignKey: 'wilayahId',
  as: 'lingkungans'
});

Lingkungan.belongsTo(Wilayah, {
  foreignKey: 'wilayahId',
  as: 'wilayah'
});

KategoriFormulir.hasMany(Formulir, {
  foreignKey: 'kategoriFormulirId',
  as: 'formulirs'
});

Formulir.belongsTo(KategoriFormulir, {
  foreignKey: 'kategoriFormulirId',
  as: 'kategoriFormulir'
});

module.exports = {
  User,
  Artikel,
  Pengumuman,
  Galeri,
  DPS,
  Pastor,
  Wilayah,
  Lingkungan,
  Kategorial,
  Formulir,
  KategoriFormulir,
  Sejarah,
  Profile,
  IntensiMisa,
  KaryaSosial,
  Jabatan,
  SubJabatan,
  Slider
};
