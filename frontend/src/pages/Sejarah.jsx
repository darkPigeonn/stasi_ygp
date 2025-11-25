import { useState, useEffect } from 'react';
import { sejarahAPI, profileAPI } from '../services/api';
import './Sejarah.css';

const Sejarah = () => {
  const [timeline, setTimeline] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sejarah timeline
        const sejarahResponse = await sejarahAPI.getAll();
        const sorted = (sejarahResponse.data || []).sort((a, b) => a.order - b.order);
        setTimeline(sorted);

        // Fetch profile data
        const profileResponse = await profileAPI.get();
        setProfile(profileResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sejarah-page">
      <div className="page-header">
        <div className="container">
          <h1>Sejarah Stasi</h1>
          <p>Perjalanan Iman Stasi Yohanes Gabriel Perboyre</p>
        </div>
      </div>

      <div className="container">
        {profile?.aboutSaint && (
          <div className="intro-section">
            <h2>Tentang Santo Yohanes Gabriel Perboyre</h2>
            <div dangerouslySetInnerHTML={{ __html: profile.aboutSaint }} />
          </div>
        )}

        <div className="timeline-section">
          <h2 className="section-title">Perjalanan Sejarah Stasi</h2>
          {loading ? (
            <p style={{textAlign: 'center', padding: '2rem'}}>Memuat data sejarah...</p>
          ) : timeline.length > 0 ? (
            <div className="timeline">
              {timeline.map((item, index) => (
                <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="timeline-marker">
                    <div className="timeline-year">{item.year}</div>
                  </div>
                  <div className="timeline-content">
                    <h3>{item.category}</h3>
                    <div dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{textAlign: 'center', padding: '2rem'}}>Tidak ada data sejarah tersedia</p>
          )}
        </div>

        {(profile?.vision || profile?.mission) && (
          <div className="vision-mission">
            <div className="vm-grid">
              {profile?.vision && (
                <div className="vm-card">
                  <h2>Visi</h2>
                  <div dangerouslySetInnerHTML={{ __html: profile.vision }} />
                </div>
              )}
              {profile?.mission && (
                <div className="vm-card">
                  <h2>Misi</h2>
                  <div dangerouslySetInnerHTML={{ __html: profile.mission }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sejarah;
