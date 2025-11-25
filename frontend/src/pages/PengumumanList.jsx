import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bell } from 'lucide-react';
import { pengumumanAPI } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imagePlaceholder';
import './ContentList.css';

const PengumumanList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        setLoading(true);
        const response = await pengumumanAPI.getAll({ status: 'published' });

        // Parse images for each pengumuman if it's a JSON string
        const pengumumansData = (response.data || []).map(pengumuman => {
          if (pengumuman.images && typeof pengumuman.images === 'string') {
            try {
              pengumuman.images = JSON.parse(pengumuman.images);
            } catch (e) {
              console.error('Error parsing images:', e);
              pengumuman.images = [];
            }
          }
          return pengumuman;
        });

        setAnnouncements(pengumumansData);
      } catch (error) {
        console.error('Error fetching pengumuman:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPengumuman();
  }, []);

  return (
    <div className="content-list-page">
      <div className="page-header">
        <div className="container">
          <h1>Pengumuman</h1>
          <p>Informasi terkini dan pengumuman penting dari stasi</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat pengumuman...</p>
        ) : announcements.length > 0 ? (
          <div className="content-grid">
            {announcements.map((announcement) => {
              // Handle images: can be array of strings or array of objects with url property
              let firstImage = null;
              if (announcement.images && announcement.images.length > 0) {
                const img = announcement.images[0];
                firstImage = typeof img === 'string' ? img : (img.url || null);
              }

              return (
                <Link key={announcement.id} to={`/pengumuman/${announcement.slug}`} className={`content-card ${announcement.isPriority || announcement.is_priority ? 'priority' : ''}`}>
                  {(announcement.isPriority || announcement.is_priority) && (
                    <div className="priority-badge">
                      <Bell size={16} />
                      Penting
                    </div>
                  )}
                  <div className="content-image">
                    <img
                      src={getImageUrl(firstImage)}
                      alt={announcement.title}
                      onError={(e) => handleImageError(e, 'Pengumuman')}
                    />
                  </div>
                  <div className="content-body">
                    <h2>{announcement.title}</h2>
                    <div className="content-meta">
                      <span className="meta-item">
                        <Calendar size={16} />
                        {new Date(announcement.publishDate || announcement.publish_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="meta-item">
                        Kategori: {announcement.category}
                      </span>
                    </div>
                    <p>{announcement.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                    <span className="read-more">Baca Selengkapnya →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p style={{textAlign: 'center', padding: '2rem'}}>Tidak ada pengumuman tersedia</p>
        )}
      </div>
    </div>
  );
};

export default PengumumanList;
