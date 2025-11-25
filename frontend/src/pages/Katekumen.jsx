import { Download, Calendar, Book, Heart } from 'lucide-react';
import './KaryaSosial.css';

const Katekumen = () => {
  const stages = [
    {
      title: 'Tahap Pra-Katekumenat',
      duration: '3-6 bulan',
      description: 'Pengenalan awal tentang iman Katolik, pertemuan informal, dan berbagi pengalaman iman.',
      activities: ['Sharing iman', 'Pengenalan dasar ajaran Katolik', 'Refleksi pribadi']
    },
    {
      title: 'Tahap Katekumenat',
      duration: '12-18 bulan',
      description: 'Pembelajaran mendalam tentang ajaran Katolik, liturgi, dan kehidupan Gereja.',
      activities: ['Katekese mingguan', 'Pendalaman Kitab Suci', 'Praktik doa dan devosi', 'Partisipasi dalam Liturgi Sabda']
    },
    {
      title: 'Tahap Pemurnian dan Pencerahan',
      duration: '40 hari (Masa Prapaskah)',
      description: 'Persiapan intensif menjelang penerimaan sakramen-sakramen inisiasi.',
      activities: ['Retret khusus', 'Scrutinies', 'Pengakuan dosa pertama', 'Persiapan baptis']
    },
    {
      title: 'Perayaan Sakramen Inisiasi',
      duration: '1 hari (Vigili Paskah)',
      description: 'Penerimaan Sakramen Baptis, Krisma, dan Ekaristi Pertama.',
      activities: ['Sakramen Baptis', 'Sakramen Krisma', 'Ekaristi Pertama']
    },
    {
      title: 'Tahap Mistagogi',
      duration: '50 hari (Masa Paskah)',
      description: 'Pendalaman pengalaman sakramen dan integrasi dalam kehidupan Gereja.',
      activities: ['Refleksi pengalaman sakramen', 'Pengenalan pelayanan dalam Gereja', 'Pembinaan lanjutan']
    }
  ];

  const requirements = [
    'Calon berusia minimal 18 tahun',
    'Belum dibaptis dalam Gereja Katolik',
    'Memiliki keinginan sungguh untuk menjadi Katolik',
    'Bersedia mengikuti seluruh proses katekumenat',
    'Mendapat dukungan dari keluarga',
    'Memiliki sponsor/pendamping dari umat Katolik'
  ];

  return (
    <div className="karya-sosial-page">
      <div className="page-header">
        <div className="container">
          <h1>Katekumen</h1>
          <p>Pendampingan Calon Baptis Dewasa</p>
        </div>
      </div>

      <div className="container">
        <div className="intro-text">
          <p>
            Program Katekumenat adalah proses pembinaan dan pendampingan bagi orang dewasa
            yang berkeinginan untuk menjadi Katolik dan menerima sakramen-sakramen inisiasi
            (Baptis, Krisma, dan Ekaristi).
          </p>
          <p>
            Proses ini bukan hanya pembelajaran intelektual, tetapi perjalanan iman yang
            mengubah seluruh hidup seseorang untuk semakin mengenal dan mengasihi Kristus.
          </p>
        </div>

        <div className="stages-section">
          <h2>Tahapan Katekumenat</h2>
          <div className="stages-timeline">
            {stages.map((stage, index) => (
              <div key={index} className="stage-item">
                <div className="stage-number">{index + 1}</div>
                <div className="stage-content">
                  <h3>{stage.title}</h3>
                  <p className="stage-duration">Durasi: {stage.duration}</p>
                  <p className="stage-desc">{stage.description}</p>
                  <div className="stage-activities">
                    <strong>Kegiatan:</strong>
                    <ul>
                      {stage.activities.map((activity, actIndex) => (
                        <li key={actIndex}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="requirements-section">
          <h2>Persyaratan Pendaftaran</h2>
          <div className="requirements-list">
            {requirements.map((req, index) => (
              <div key={index} className="requirement-item">
                <span className="check-icon">✓</span>
                {req}
              </div>
            ))}
          </div>
        </div>

        <div className="pkks-info-grid">
          <div className="info-card">
            <Book size={40} />
            <h3>Materi Pembelajaran</h3>
            <p>
              Kitab Suci, Katekismus Gereja Katolik, Liturgi dan Sakramen,
              Doa dan Spiritualitas Katolik, Sejarah Gereja, Moral Katolik.
            </p>
          </div>

          <div className="info-card">
            <Heart size={40} />
            <h3>Pendampingan</h3>
            <p>
              Setiap katekumen akan didampingi oleh sponsor yang akan membantu
              dalam perjalanan iman dan menjadi saksi dalam perayaan sakramen.
            </p>
          </div>

          <div className="info-card">
            <Calendar size={40} />
            <h3>Jadwal Pertemuan</h3>
            <p>
              Pertemuan katekese dilaksanakan setiap hari Kamis, pukul 19:00 - 21:00 WIB
              dengan sharing, pembelajaran, dan doa bersama.
            </p>
          </div>
        </div>

        <div className="download-section">
          <h2>Formulir Pendaftaran</h2>
          <p>
            Silakan unduh formulir pendaftaran, isi dengan lengkap, dan serahkan ke sekretariat
            stasi untuk memulai proses katekumenat Anda.
          </p>
          <button className="download-btn">
            <Download size={20} />
            Unduh Formulir Pendaftaran Katekumen
          </button>
        </div>

        <div className="contact-box">
          <h3>Informasi dan Kontak</h3>
          <p><strong>Pembina Katekumen:</strong> Romo Yohanes Baptista</p>
          <p><strong>Koordinator:</strong> Bapak David Kim</p>
          <p><strong>Telepon:</strong> 0812-3456-7892</p>
          <p><strong>Email:</strong> katekumen@stasiyohanes.org</p>
          <p className="note">
            Untuk konsultasi awal atau informasi lebih lanjut, silakan hubungi koordinator
            atau datang langsung ke sekretariat stasi setiap hari Minggu setelah Misa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Katekumen;
