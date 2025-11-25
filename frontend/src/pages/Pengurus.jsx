import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { dpsAPI } from '../services/api';
import './OrgPages.css';

const Pengurus = () => {
  const [dpsList, setDpsList] = useState([]);
  const [bgksList, setBgksList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDPS = async () => {
      try {
        setLoading(true);
        const response = await dpsAPI.getAll({ limit: 100 });
        const allDPS = response.data || [];

        // Separate DPS and BGKS
        const dps = allDPS.filter(d => d.type === 'DPS');
        const bgks = allDPS.filter(d => d.type === 'BGKS');

        // Sort by order
        setDpsList(dps.sort((a, b) => a.order - b.order));
        setBgksList(bgks.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error fetching DPS:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDPS();
  }, []);

  return (
    <div className="org-page">
      <div className="page-header">
        <div className="container">
          <h1>Pengurus Gereja</h1>
          <p>Dewan Pastoral Stasi dan Badan Gereja Katolik Stasi</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat data pengurus...</p>
        ) : (
          <div className="org-grid">
            <div className="org-section">
              <div className="org-header">
                <Users size={40} />
                <h2>Dewan Pastoral Stasi (DPS)</h2>
                <p>Badan Gereja Katolik Stasi (BGKS)</p>
              </div>
              <div className="org-list">
                {dpsList.length > 0 ? (
                  dpsList.map((person) => (
                    <div key={person.id} className="org-card">
                      {person.photo ? (
                        <img src={person.photo} alt={person.fullName} className="org-avatar-img" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        <div className="org-avatar">
                          {person.baptismName ? person.baptismName.substring(0, 2).toUpperCase() : person.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="org-info">
                        <h3>{person.baptismName} {person.fullName}</h3>
                        <p>{person.position}</p>
                        {person.subPosition && <p style={{fontSize: '0.9em', color: '#666'}}>{person.subPosition}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Tidak ada data DPS</p>
                )}
              </div>
            </div>

            <div className="org-section">
              <div className="org-header">
                <Users size={40} />
                <h2>Badan Gereja Katolik Stasi (BGKS)</h2>
                <p>Badan Gereja Katolik Paroki (BGKP)</p>
              </div>
              <div className="org-list">
                {bgksList.length > 0 ? (
                  bgksList.map((person) => (
                    <div key={person.id} className="org-card">
                      {person.photo ? (
                        <img src={person.photo} alt={person.fullName} className="org-avatar-img" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover'}} />
                      ) : (
                        <div className="org-avatar">
                          {person.baptismName ? person.baptismName.substring(0, 2).toUpperCase() : person.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="org-info">
                        <h3>{person.baptismName} {person.fullName}</h3>
                        <p>{person.position}</p>
                        {person.subPosition && <p style={{fontSize: '0.9em', color: '#666'}}>{person.subPosition}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Tidak ada data BGKS</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="info-box">
          <h3>Tugas dan Tanggung Jawab</h3>
          <div className="info-grid">
            <div>
              <h4>Dewan Pastoral Stasi (DPS)</h4>
              <ul>
                <li>Membantu pastor dalam mengelola kegiatan pastoral stasi</li>
                <li>Mengkoordinasikan berbagai kelompok dan kegiatan di stasi</li>
                <li>Mengelola keuangan dan aset stasi</li>
                <li>Menjadi jembatan komunikasi antara umat dan pastor</li>
              </ul>
            </div>
            <div>
              <h4>Badan Gereja Katolik Stasi (BGKS)</h4>
              <ul>
                <li>Fokus pada karya sosial dan kepedulian terhadap sesama</li>
                <li>Mengelola program-program bantuan untuk yang membutuhkan</li>
                <li>Mengkoordinasikan kegiatan bakti sosial</li>
                <li>Membangun kemitraan dengan lembaga sosial lainnya</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengurus;
