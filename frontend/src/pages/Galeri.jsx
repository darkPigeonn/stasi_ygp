import { useState, useEffect } from 'react';
import { Image, ExternalLink } from 'lucide-react';
import { galeriAPI } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imagePlaceholder';
import './Galeri.css';

const Galeri = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response = await galeriAPI.getAll();
        const data = response.data || [];

        // Filter only active galleries and parse images JSON if it's a string
        const parsedData = data
          .filter(gallery => gallery.is_active || gallery.isActive)
          .map(gallery => {
            let images = gallery.images;
            if (typeof images === 'string') {
              try {
                images = JSON.parse(images);
                if (typeof images === 'string') {
                  images = JSON.parse(images);
                }
              } catch (e) {
                console.error('Error parsing images:', e);
                images = [];
              }
            }
            return {
              ...gallery,
              images: images || [],
              googlePhotoUrl: gallery.google_photo_url || gallery.googlePhotoUrl
            };
          });

        setGalleries(parsedData);
      } catch (error) {
        console.error('Error fetching galleries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const openLightbox = (gallery, index) => {
    setSelectedGallery(gallery);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedGallery(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedGallery && selectedGallery.images) {
      setSelectedImageIndex((prev) =>
        prev === selectedGallery.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedGallery && selectedGallery.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? selectedGallery.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="galeri-page">
      <div className="page-header">
        <div className="container">
          <h1>Galeri Foto</h1>
          <p>Dokumentasi kegiatan Stasi Yohanes Gabriel Perboyre</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat galeri...</p>
        ) : galleries.length > 0 ? (
          <div className="galleries-grid">
            {galleries.map((gallery) => (
              <div key={gallery.id} className="gallery-card">
                <div className="gallery-header">
                  <h2>
                    <Image size={24} />
                    {gallery.title}
                  </h2>
                  {gallery.googlePhotoUrl && (
                    <a
                      href={gallery.googlePhotoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="google-photos-link"
                    >
                      <ExternalLink size={16} />
                      Lihat di Google Photos
                    </a>
                  )}
                </div>

                <div className="gallery-images">
                  {gallery.images && gallery.images.length > 0 ? (
                    gallery.images.map((img, index) => {
                      const imageUrl = typeof img === 'string' ? img : (img.url || null);
                      const caption = typeof img === 'object' ? img.caption : null;

                      return (
                        <div
                          key={index}
                          className="gallery-image"
                          onClick={() => openLightbox(gallery, index)}
                        >
                          <img
                            src={getImageUrl(imageUrl)}
                            alt={caption || gallery.title}
                            onError={(e) => handleImageError(e, 'Galeri')}
                          />
                          {caption && (
                            <div className="image-caption">{caption}</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p>Tidak ada foto</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{textAlign: 'center', padding: '2rem'}}>Tidak ada galeri tersedia</p>
        )}
      </div>

      {/* Lightbox */}
      {selectedGallery && selectedGallery.images && selectedGallery.images.length > 0 && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>×</button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const currentImg = selectedGallery.images[selectedImageIndex];
              const imageUrl = typeof currentImg === 'string' ? currentImg : (currentImg?.url || null);
              const caption = typeof currentImg === 'object' ? currentImg?.caption : null;

              return (
                <>
                  <img
                    src={getImageUrl(imageUrl)}
                    alt={caption || selectedGallery.title}
                    onError={(e) => handleImageError(e, 'Galeri')}
                  />
                  {caption && (
                    <div className="lightbox-caption">{caption}</div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeri;
