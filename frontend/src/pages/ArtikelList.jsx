import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { artikelAPI } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imagePlaceholder';
import './ContentList.css';

const ArtikelList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await artikelAPI.getAll({ status: 'published' });

        // Parse images for each article if it's a JSON string
        const articlesData = (response.data || []).map(article => {
          if (article.images && typeof article.images === 'string') {
            try {
              article.images = JSON.parse(article.images);
            } catch (e) {
              console.error('Error parsing images:', e);
              article.images = [];
            }
          }
          return article;
        });

        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="content-list-page">
      <div className="page-header">
        <div className="container">
          <h1>Artikel</h1>
          <p>Baca artikel dan refleksi terbaru dari komunitas kami</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat artikel...</p>
        ) : articles.length > 0 ? (
          <div className="content-grid">
            {articles.map((article) => {
              // Handle images: can be array of strings or array of objects with url property
              let firstImage = null;
              if (article.images && article.images.length > 0) {
                const img = article.images[0];
                firstImage = typeof img === 'string' ? img : (img.url || null);
              }

              return (
                <Link key={article.id} to={`/artikel/${article.slug}`} className="content-card">
                  <div className="content-image">
                    <img
                      src={getImageUrl(firstImage)}
                      alt={article.title}
                      onError={(e) => handleImageError(e, 'Artikel')}
                    />
                  </div>
                  <div className="content-body">
                    <h2>{article.title}</h2>
                    <div className="content-meta">
                      <span className="meta-item">
                        <Calendar size={16} />
                        {new Date(article.publishDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="meta-item">
                        <User size={16} />
                        {article.author}
                      </span>
                    </div>
                    <p>{article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                    <span className="read-more">Baca Selengkapnya →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p style={{textAlign: 'center', padding: '2rem'}}>Tidak ada artikel tersedia</p>
        )}
      </div>
    </div>
  );
};

export default ArtikelList;
