import { useState, useEffect } from 'react';
import { pastorAPI, getImageUrl } from '../services/api';
import './OrgPages.css';

const Pastor = () => {
  const [currentPastors, setCurrentPastors] = useState([]);
  const [formerPastors, setFormerPastors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPastors = async () => {
      try {
        setLoading(true);
        const response = await pastorAPI.getAll();
        const pastors = response.data || [];

        // Separate current and former pastors
        const current = pastors.filter(p => p.pastorType === 'Gembala Kami');
        const former = pastors.filter(p => p.pastorType === 'Pernah Berkarya');

        setCurrentPastors(current);
        setFormerPastors(former);
      } catch (error) {
        console.error('Error fetching pastors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPastors();
  }, []);

  return (
    <div className="org-page">
      <div className="page-header">
        <div className="container">
          <h1>Pastor</h1>
          <p>Gembala yang melayani umat Stasi Yohanes Gabriel Perboyre</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat data pastor...</p>
        ) : (
          <>
            <div className="pastor-current">
              <h2 className="section-title">Pastor Saat Ini</h2>
              {currentPastors.length > 0 ? (
                currentPastors.map((pastor) => (
                  <div key={pastor.id} className="pastor-card-large">
                    <img
                      src={pastor.photo ? getImageUrl(pastor.photo) : 'https://via.placeholder.com/300x300/1e3a8a/ffffff?text=Pastor'}
                      alt={pastor.name}
                    />
                    <div className="pastor-info">
                      <h3>{pastor.name}</h3>
                      <p className="pastor-title">{pastor.priestType}</p>
                      {pastor.nickname && <p className="pastor-nickname">({pastor.nickname})</p>}
                      <p className="pastor-period">
                        {pastor.serveFrom} - {pastor.serveTo || 'Sekarang'}
                      </p>
                      {pastor.ordinationDate && (
                        <p className="pastor-ordination">
                          Tahbisan: {new Date(pastor.ordinationDate).getFullYear()}
                        </p>
                      )}
                      {pastor.biography && <p className="pastor-bio">{pastor.biography}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p>Tidak ada data pastor saat ini</p>
              )}
            </div>

            <div className="pastor-former">
              <h2 className="section-title">Pastor yang Pernah Berkarya</h2>
              {formerPastors.length > 0 ? (
                <div className="pastor-timeline">
                  {formerPastors.map((pastor) => (
                    <div key={pastor.id} className="pastor-timeline-item">
                      <div className="pastor-period-badge">
                        {pastor.serveFrom} - {pastor.serveTo}
                      </div>
                      <div className="pastor-timeline-content">
                        <h3>{pastor.name}</h3>
                        {pastor.nickname && <p className="pastor-nickname">({pastor.nickname})</p>}
                        <p className="pastor-type">{pastor.priestType}</p>
                        {pastor.biography && <p>{pastor.biography}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Tidak ada data pastor yang pernah berkarya</p>
              )}
            </div>
          </>
        )}

        <div className="info-box">
          <h3>Kontak Pastor</h3>
          <p>
            Untuk keperluan pastoral seperti sakramen baptis, pernikahan, sakramen orang sakit,
            atau konsultasi rohani, umat dapat menghubungi sekretariat paroki atau langsung
            bertemu dengan pastor setelah Misa.
          </p>
          <p>
            <strong>Waktu Konsultasi:</strong> Setiap Selasa dan Kamis, pukul 16:00 - 18:00 WIB
            (dengan perjanjian terlebih dahulu)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pastor;
