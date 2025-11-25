import { useState, useEffect } from 'react';
import { Users, Calendar, Target } from 'lucide-react';
import { kategorialAPI } from '../services/api';
import './Kategorial.css';

const Kategorial = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [kategoriales, setKategoriales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKategoriales = async () => {
      try {
        setLoading(true);
        const response = await kategorialAPI.getAll();
        const data = response.data || [];

        // Sort by order field
        const sorted = data.sort((a, b) => a.order - b.order);
        setKategoriales(sorted);

        if (sorted.length > 0) {
          setActiveTab(0);
        }
      } catch (error) {
        console.error('Error fetching kategoriales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKategoriales();
  }, []);

  return (
    <div className="kategorial-page">
      <div className="page-header">
        <div className="container">
          <h1>Kelompok Kategorial</h1>
          <p>Berbagai kelompok berdasarkan usia dan tahap kehidupan</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat data kategorial...</p>
        ) : kategoriales.length > 0 ? (
          <>
            <div className="kategorial-tabs">
              {kategoriales.map((kat, index) => (
                <button
                  key={index}
                  className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  {kat.name}
                </button>
              ))}
            </div>

            <div className="kategorial-content">
              {kategoriales.map((kat, index) => (
                <div
                  key={index}
                  className={`kategorial-tab-content ${activeTab === index ? 'active' : ''}`}
                >
                  {kat.image && (
                    <div className="kategorial-image">
                      <img src={`http://localhost:5000${kat.image}`} alt={kat.name} />
                    </div>
                  )}

                  <div className="kategorial-info">
                    <h2>{kat.name}</h2>

                    <div className="kategorial-section">
                      <div
                        className="kategorial-content-html"
                        dangerouslySetInnerHTML={{ __html: kat.content }}
                      />
                    </div>

                    <div className="kategorial-meta">
                      {kat.schedule && (
                        <div className="meta-item">
                          <Calendar size={20} />
                          <div>
                            <strong>Jadwal Pertemuan</strong>
                            <p>{kat.schedule}</p>
                          </div>
                        </div>
                      )}
                      {kat.contact && (
                        <div className="meta-item">
                          <Users size={20} />
                          <div>
                            <strong>Kontak</strong>
                            <p>{kat.contact}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{textAlign: 'center', padding: '2rem'}}>Tidak ada data kategorial tersedia</p>
        )}

        <div className="info-box">
          <h3>Bergabung dengan Kelompok Kategorial</h3>
          <p>
            Kelompok kategorial adalah wadah untuk memperdalam iman sesuai dengan tahap kehidupan masing-masing.
            Setiap umat diundang untuk aktif dalam kelompok yang sesuai dengan usianya.
          </p>
          <p>
            Untuk informasi lebih lanjut atau pendaftaran, silakan hubungi kontak yang tertera
            atau datang langsung ke sekretariat stasi setelah Misa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Kategorial;
