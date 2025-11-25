import { useState, useEffect } from 'react';
import { MapPin, Users } from 'lucide-react';
import { wilayahAPI, lingkunganAPI } from '../services/api';
import { getImageUrl } from '../utils/imagePlaceholder';
import './OrgPages.css';

const Wilayah = () => {
  const [wilayah, setWilayah] = useState([]);
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchWilayah = async () => {
      try {
        setLoading(true);
        const response = await wilayahAPI.getAll();
        const wilayahData = response.data || [];

        // Fetch lingkungan for each wilayah
        const wilayahWithLingkungan = await Promise.all(
          wilayahData.map(async (wil) => {
            try {
              const lingkunganResponse = await lingkunganAPI.getByWilayah(wil.id);
              return {
                ...wil,
                lingkungan: lingkunganResponse.data || []
              };
            } catch (error) {
              console.error(`Error fetching lingkungan for wilayah ${wil.id}:`, error);
              return {
                ...wil,
                lingkungan: []
              };
            }
          })
        );

        setWilayah(wilayahWithLingkungan);
        // Set first wilayah as selected by default
        if (wilayahWithLingkungan.length > 0) {
          setSelectedWilayah(wilayahWithLingkungan[0]);
        }
      } catch (error) {
        console.error('Error fetching wilayah:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWilayah();
  }, []);

  return (
    <div className="org-page">
      <div className="page-header">
        <div className="container">
          <h1>Wilayah & Lingkungan</h1>
          <p>Struktur organisasi umat berdasarkan wilayah geografis</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat data wilayah...</p>
        ) : wilayah.length > 0 ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <MapPin size={40} />
                <div>
                  <h3>{wilayah.length}</h3>
                  <p>Wilayah</p>
                </div>
              </div>
              <div className="stat-card">
                <Users size={40} />
                <div>
                  <h3>{wilayah.reduce((acc, wil) => acc + (wil.lingkungan || []).length, 0)}</h3>
                  <p>Lingkungan</p>
                </div>
              </div>
            </div>

            <div className="wilayah-layout">
              {/* Sidebar Daftar Wilayah */}
              <aside className="wilayah-sidebar">
                <h2 className="sidebar-title">DAFTAR WILAYAH</h2>
                {wilayah.map((wil, index) => (
                  <button
                    key={index}
                    className={`wilayah-sidebar-item ${selectedWilayah?.id === wil.id ? 'active' : ''}`}
                    onClick={() => setSelectedWilayah(wil)}
                  >
                    WILAYAH {index + 1}
                  </button>
                ))}
              </aside>

              {/* Main Content Area */}
              <div className="wilayah-content">
                {selectedWilayah && (
                  <>
                    {/* Wilayah Header */}
                    <div className="wilayah-detail-header">
                      <h2>Wilayah {wilayah.findIndex(w => w.id === selectedWilayah.id) + 1} - {selectedWilayah.name}</h2>
                      <p className="wilayah-chairman">Ketua Wilayah: {selectedWilayah.chairman}</p>
                    </div>

                    {/* Map and Lingkungan Layout */}
                    <div className="wilayah-map-lingkungan-layout">
                      {/* Map Image */}
                      {selectedWilayah.mapImage && (
                        <div className="wilayah-map">
                          <img
                            src={getImageUrl(selectedWilayah.mapImage)}
                            alt={`Peta ${selectedWilayah.name}`}
                            onClick={() => setSelectedImage(getImageUrl(selectedWilayah.mapImage))}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      )}

                      {/* Lingkungan List */}
                      <div className="lingkungan-list">
                        {(selectedWilayah.lingkungan || []).map((ling, lingIndex) => (
                      <div key={lingIndex} className="lingkungan-detail">
                        <h3 className="lingkungan-title">Lingkungan {lingIndex + 1} - {ling.name}</h3>
                        <p className="lingkungan-chairman">Ketua Lingkungan: {ling.chairman || 'Belum ditentukan'}</p>

                        {(ling.boundaryNorth || ling.boundaryEast || ling.boundarySouth || ling.boundaryWest) && (
                          <div className="lingkungan-boundaries">
                            <strong>Batas Lingkungan</strong>
                            {ling.boundaryNorth && (
                              <div className="boundary-item">
                                <span className="boundary-label">Utara</span>
                                <span className="boundary-value">: {ling.boundaryNorth}</span>
                              </div>
                            )}
                            {ling.boundaryEast && (
                              <div className="boundary-item">
                                <span className="boundary-label">Timur</span>
                                <span className="boundary-value">: {ling.boundaryEast}</span>
                              </div>
                            )}
                            {ling.boundarySouth && (
                              <div className="boundary-item">
                                <span className="boundary-label">Selatan</span>
                                <span className="boundary-value">: {ling.boundarySouth}</span>
                              </div>
                            )}
                            {ling.boundaryWest && (
                              <div className="boundary-item">
                                <span className="boundary-label">Barat</span>
                                <span className="boundary-value">: {ling.boundaryWest}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <p style={{textAlign: 'center', padding: '2rem'}}>Tidak ada data wilayah tersedia</p>
        )}

        <div className="info-box">
          <h3>Tentang Sistem Wilayah dan Lingkungan</h3>
          <p>
            Stasi Yohanes Gabriel Perboyre mengorganisasikan umat berdasarkan wilayah geografis
            untuk memudahkan pelayanan pastoral dan membangun persaudaraan yang lebih erat.
          </p>
          <p>
            Setiap wilayah terdiri dari beberapa lingkungan. Lingkungan adalah unit terkecil
            dalam organisasi umat, di mana keluarga-keluarga Katolik dalam satu area berkumpul
            untuk beribadah, berbagi, dan saling mendukung.
          </p>
          <h4>Kegiatan Lingkungan</h4>
          <ul>
            <li>Ibadat lingkungan bulanan</li>
            <li>Doa rosario bersama</li>
            <li>Perayaan hari raya dan syukuran</li>
            <li>Kunjungan pastoral</li>
            <li>Kegiatan sosial dan persaudaraan</li>
          </ul>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="image-modal"
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          <img
            src={selectedImage}
            alt="Peta Wilayah"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Wilayah;
