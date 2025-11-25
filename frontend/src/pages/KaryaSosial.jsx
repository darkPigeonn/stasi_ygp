import { useState, useEffect } from 'react';
import { Heart, Users, Gift, HandHeart, Home, Calendar, BookOpen, MessageCircle, Smile, Star, Sun, Coffee, Music, Camera, Flower2, Sparkles } from 'lucide-react';
import { karyaSosialAPI } from '../services/api';
import './KaryaSosial.css';

const KaryaSosial = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping
  const iconMap = {
    Heart: <Heart size={40} />,
    Users: <Users size={40} />,
    Gift: <Gift size={40} />,
    HandHeart: <HandHeart size={40} />,
    Home: <Home size={40} />,
    Calendar: <Calendar size={40} />,
    BookOpen: <BookOpen size={40} />,
    MessageCircle: <MessageCircle size={40} />,
    Smile: <Smile size={40} />,
    Star: <Star size={40} />,
    Sun: <Sun size={40} />,
    Coffee: <Coffee size={40} />,
    Music: <Music size={40} />,
    Camera: <Camera size={40} />,
    Flower2: <Flower2 size={40} />,
    Sparkles: <Sparkles size={40} />
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await karyaSosialAPI.getAll();
        const data = response.data || [];

        // Sort by displayOrder
        const sorted = data.sort((a, b) => a.displayOrder - b.displayOrder);
        setPrograms(sorted);
      } catch (error) {
        console.error('Error fetching karya sosial:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="karya-sosial-page">
      <div className="page-header">
        <div className="container">
          <h1>Kelompok Karya Sosial</h1>
          <p>Berbagi kasih kepada sesama yang membutuhkan</p>
        </div>
      </div>

      <div className="container">
        <div className="intro-text">
          <p>
            "Sesungguhnya segala sesuatu yang kamu lakukan untuk salah seorang dari saudara-Ku yang paling hina ini,
            kamu telah melakukannya untuk Aku." (Matius 25:40)
          </p>
          <p>
            Kelompok Karya Sosial Stasi Yohanes Gabriel Perboyre hadir sebagai wujud nyata kasih Kristus
            kepada mereka yang membutuhkan. Melalui berbagai program, kami berusaha menjangkau dan membantu
            saudara-saudari yang memerlukan perhatian dan bantuan.
          </p>
        </div>

        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat data program...</p>
        ) : programs.length > 0 ? (
          <div className="programs-grid">
            {programs.map((program, index) => (
              <div
                key={index}
                className="program-card"
                style={{
                  backgroundImage: program.image ? `url(http://localhost:5000${program.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}
              >
                {program.image && <div className="program-card-overlay"></div>}
                <div className="program-card-content">
                  <div className="program-icon">
                    {iconMap[program.icon] || <Heart size={40} />}
                  </div>
                  <h3>{program.name}</h3>
                  {program.description && (
                    <div
                      className="program-desc-html"
                      dangerouslySetInnerHTML={{ __html: program.description }}
                    />
                  )}
                  {program.activities && (
                    <div className="program-activities">
                      <strong>Kegiatan:</strong>
                      <div
                        className="activities-content-html"
                        dangerouslySetInnerHTML={{ __html: program.activities }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{textAlign: 'center', padding: '2rem'}}>Tidak ada program tersedia</p>
        )}

        <div className="donation-section">
          <h2>Berpartisipasi dalam Karya Sosial</h2>
          <div className="donation-grid">
            <div className="donation-card">
              <h3>Donasi Material</h3>
              <p>
                Anda dapat memberikan donasi berupa sembako, pakaian layak pakai, alat tulis,
                atau kebutuhan lainnya. Donasi dapat diserahkan di sekretariat stasi.
              </p>
            </div>
            <div className="donation-card">
              <h3>Donasi Dana</h3>
              <p>
                Donasi dana dapat diberikan melalui amplop karya sosial yang tersedia di gereja
                atau transfer ke rekening stasi dengan keterangan "Karya Sosial".
              </p>
            </div>
            <div className="donation-card">
              <h3>Menjadi Relawan</h3>
              <p>
                Bergabunglah sebagai relawan dalam kegiatan kunjungan dan pelayanan.
                Hubungi koordinator karya sosial untuk informasi lebih lanjut.
              </p>
            </div>
          </div>
        </div>

        <div className="contact-box">
          <h3>Kontak Karya Sosial</h3>
          <p><strong>Koordinator:</strong> Ibu Elizabeth Garcia</p>
          <p><strong>Telepon:</strong> 0812-3456-7890</p>
          <p><strong>Email:</strong> karyasosial@stasiyohanes.org</p>
          <p className="note">
            Jika Anda mengetahui ada umat atau masyarakat sekitar yang membutuhkan bantuan,
            silakan hubungi tim karya sosial kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KaryaSosial;
