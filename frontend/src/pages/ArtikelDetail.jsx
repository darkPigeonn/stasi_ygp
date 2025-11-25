import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { artikelAPI } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imagePlaceholder';
import './ContentDetail.css';

const ArtikelDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await artikelAPI.getBySlug(slug);
        const articleData = response.data;

        // Parse images if it's a JSON string
        if (articleData.images && typeof articleData.images === 'string') {
          try {
            articleData.images = JSON.parse(articleData.images);
          } catch (e) {
            console.error('Error parsing images:', e);
            articleData.images = [];
          }
        }

        setArticle(articleData);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Gagal memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="content-detail-page">
        <div className="container">
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="content-detail-page">
        <div className="container">
          <p style={{textAlign: 'center', padding: '2rem'}}>{error || 'Artikel tidak ditemukan'}</p>
          <div style={{textAlign: 'center'}}>
            <Link to="/artikel" className="btn btn-primary">
              <ArrowLeft size={16} />
              Kembali ke Daftar Artikel
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
          <Link to="/artikel" className="back-link">
            <ArrowLeft size={20} />
            Kembali ke Artikel
          </Link>
        </div>
      </div>

      <div className="container">
        <article className="content-detail">
          <h1 className="content-title">{article.title}</h1>

          <div className="content-meta">
            <span className="meta-item">
              <Calendar size={16} />
              {new Date(article.publishDate || article.publish_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="meta-item">
              <User size={16} />
              {article.author || 'Admin'}
            </span>
          </div>

          {article.images && article.images.length > 0 && (
            <div className="content-images">
              {article.images.map((image, index) => {
                const imagePath = typeof image === 'string' ? image : (image.url || null);
                return (
                  <img
                    key={index}
                    src={getImageUrl(imagePath)}
                    alt={`${article.title} - ${index + 1}`}
                    onError={(e) => handleImageError(e, 'Artikel')}
                  />
                );
              })}
            </div>
          )}

          <div className="content-text" dangerouslySetInnerHTML={{ __html: article.content }} />

          <div className="content-footer">
            <Link to="/artikel" className="btn btn-primary">
              <ArrowLeft size={16} />
              Kembali ke Daftar Artikel
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArtikelDetail;
