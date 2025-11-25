module.exports = {
  stasiName: 'Stasi Yohanes Gabriel Perboyre',
  parokiName: 'Paroki Santo Yakobus Kelapa Gading',
  logo: '/uploads/logo-stasi.png',
  address: '<p><strong>Alamat:</strong><br>Jl. Boulevard Barat Raya No. 123<br>Kelapa Gading, Jakarta Utara 14240<br>DKI Jakarta, Indonesia</p>',
  phone1: '021-4567890',
  phone2: '021-4567891',
  phone3: '0812-3456-7890',
  email: 'info@stasiyohanes.org',
  officeHours: '<ul><li>Senin - Jumat: 09.00 - 17.00 WIB</li><li>Sabtu: 09.00 - 12.00 WIB</li><li>Minggu & Hari Libur: Tutup</li></ul>',
  massSchedule: JSON.stringify([
    {
      day: 'Minggu',
      time: '06.00 WIB',
      type: 'Misa Pagi',
      language: 'Bahasa Indonesia'
    },
    {
      day: 'Minggu',
      time: '08.00 WIB',
      type: 'Misa Keluarga',
      language: 'Bahasa Indonesia'
    },
    {
      day: 'Sabtu',
      time: '18.00 WIB',
      type: 'Misa Sore',
      language: 'Bahasa Indonesia'
    },
    {
      day: 'Senin - Jumat',
      time: '18.30 WIB',
      type: 'Misa Harian',
      language: 'Bahasa Indonesia'
    },
    {
      day: 'Jumat Pertama',
      time: '18.30 WIB',
      type: 'Misa Jumat Pertama',
      language: 'Bahasa Indonesia',
      note: 'Dilanjutkan Adorasi Sakramen Mahakudus'
    }
  ]),
  socialMedia: JSON.stringify({
    facebook: 'https://facebook.com/stasiyohanes',
    instagram: 'https://instagram.com/stasiyohanes',
    youtube: 'https://youtube.com/@stasiyohanes',
    twitter: 'https://twitter.com/stasiyohanes',
    whatsapp: 'https://wa.me/6281234567890'
  })
};
