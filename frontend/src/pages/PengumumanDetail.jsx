import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Bell } from 'lucide-react';
import { pengumumanAPI } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imagePlaceholder';
import './ContentDetail.css';

const PengumumanDetail = () => {
  const { slug } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await pengumumanAPI.getBySlug(slug);
        const announcementData = response.data;

        // Parse images if it's a JSON string
        if (announcementData.images && typeof announcementData.images === 'string') {
          try {
            announcementData.images = JSON.parse(announcementData.images);
          } catch (e) {
            console.error('Error parsing images:', e);
            announcementData.images = [];
          }
        }

        setAnnouncement(announcementData);
      } catch (error) {
        console.error('Error fetching announcement:', error);
        setError('Gagal memuat pengumuman');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [slug]);

  if (loading) {
    return (
      <div className="content-detail-page">
        <div className="container">
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat pengumuman...</p>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="content-detail-page">
        <div className="container">
          <p style={{textAlign: 'center', padding: '2rem'}}>{error || 'Pengumuman tidak ditemukan'}</p>
          <div style={{textAlign: 'center'}}>
            <Link to="/pengumuman" className="btn btn-primary">
              <ArrowLeft size={16} />
              Kembali ke Daftar Pengumuman
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-detail-page">
      <div className="page-header">
        <div className="container">
          <Link to="/pengumuman" className="back-link">
            <ArrowLeft size={20} />
            Kembali ke Pengumuman
          </Link>
        </div>
      </div>

      <div className="container">
        <article className="content-detail">
          {(announcement.isPriority || announcement.is_priority) && (
            <div className="priority-badge-large">
              <Bell size={20} />
              Pengumuman Penting
            </div>
          )}

          <h1 className="content-title">{announcement.title}</h1>

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

          {announcement.images && announcement.images.length > 0 && (
            <div className="content-images">
              {announcement.images.map((image, index) => {
                const imagePath = typeof image === 'string' ? image : (image.url || null);
                return (
                  <img
                    key={index}
                    src={getImageUrl(imagePath)}
                    alt={`${announcement.title} - ${index + 1}`}
                    onError={(e) => handleImageError(e, 'Pengumuman')}
                  />
                );
              })}
            </div>
          )}

          <div className="content-text" dangerouslySetInnerHTML={{ __html: announcement.content }} />

          <div className="content-footer">
            <Link to="/pengumuman" className="btn btn-primary">
              <ArrowLeft size={16} />
              Kembali ke Daftar Pengumuman
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PengumumanDetail;
