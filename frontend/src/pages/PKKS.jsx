import { Download, Calendar, Book, Users } from 'lucide-react';
import './KaryaSosial.css';

const PKKS = () => {
  const requirements = [
    'Anak berusia minimal 7 tahun',
    'Sudah dibaptis (jika belum, dapat mendaftar katekumen anak)',
    'Fotokopi akta kelahiran',
    'Fotokopi surat baptis',
    'Pas foto ukuran 3x4 (2 lembar)',
    'Kesediaan orang tua untuk mendampingi'
  ];

  const schedule = [
    { month: 'Juli', topic: 'Pengenalan Ekaristi' },
    { month: 'Agustus', topic: 'Dosa dan Pertobatan' },
    { month: 'September', topic: 'Sakramen Tobat' },
    { month: 'Oktober', topic: 'Persiapan Komuni Pertama' },
    { month: 'November', topic: 'Retret dan Pengakuan Dosa' },
    { month: 'Desember', topic: 'Perayaan Komuni Pertama' }
  ];

  return (
    <div className="karya-sosial-page">
      <div className="page-header">
        <div className="container">
          <h1>PKKS</h1>
          <p>Persiapan Komuni Kudus Pertama</p>
        </div>
      </div>

      <div className="container">
        <div className="intro-text">
          <p>
            Persiapan Komuni Kudus Pertama (PKKS) adalah program katekese untuk mempersiapkan
            anak-anak menerima Sakramen Ekaristi yang pertama kali. Melalui program ini,
            anak-anak belajar tentang makna Ekaristi dan mempersiapkan diri untuk menerima
            Tubuh dan Darah Kristus.
          </p>
        </div>

        <div className="pkks-info-grid">
          <div className="info-card">
            <Book size={40} />
            <h3>Materi Pembelajaran</h3>
            <p>
              Anak-anak akan belajar tentang Ekaristi, sakramen-sakramen, doa-doa dasar,
              dan cara hidup sebagai murid Kristus.
            </p>
          </div>

          <div className="info-card">
            <Users size={40} />
            <h3>Peran Orang Tua</h3>
            <p>
              Orang tua berperan penting dalam mendampingi dan mendukung anak dalam
              persiapan mereka menuju Komuni Pertama.
            </p>
          </div>

          <div className="info-card">
            <Calendar size={40} />
            <h3>Durasi Program</h3>
            <p>
              Program berlangsung selama 6 bulan dengan pertemuan setiap minggu
              dan retret menjelang Komuni Pertama.
            </p>
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

        <div className="schedule-section">
          <h2>Jadwal Pembelajaran</h2>
          <p className="schedule-note">
            Pertemuan dilaksanakan setiap hari Minggu, pukul 10:00 - 11:30 WIB
          </p>
          <div className="schedule-grid">
            {schedule.map((item, index) => (
              <div key={index} className="schedule-card">
                <div className="schedule-month">{item.month}</div>
                <div className="schedule-topic">{item.topic}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="download-section">
          <h2>Formulir Pendaftaran</h2>
          <p>
            Silakan unduh formulir pendaftaran, isi dengan lengkap, dan serahkan ke sekretariat
            stasi bersama dengan dokumen persyaratan.
          </p>
          <button className="download-btn">
            <Download size={20} />
            Unduh Formulir Pendaftaran PKKS
          </button>
        </div>

        <div className="contact-box">
          <h3>Informasi dan Kontak</h3>
          <p><strong>Pembina PKKS:</strong> Ibu Linda Taylor</p>
          <p><strong>Telepon:</strong> 0812-3456-7891</p>
          <p><strong>Email:</strong> pkks@stasiyohanes.org</p>
          <p className="note">
            Untuk informasi lebih lanjut tentang PKKS, silakan hubungi pembina atau
            datang ke sekretariat stasi setiap hari Minggu setelah Misa pagi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PKKS;
