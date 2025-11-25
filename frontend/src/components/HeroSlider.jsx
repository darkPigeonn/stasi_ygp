import { useState, useEffect } from 'react';
import { sliderAPI } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.css';

const HeroSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    if (sliders.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length);
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [sliders.length]);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await sliderAPI.getActive();
      setSliders(response.data || []);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sliders.length) % sliders.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length);
  };

  if (loading) {
    return (
      <div className="hero-slider-loading">
        <p>Memuat slider...</p>
      </div>
    );
  }

  if (sliders.length === 0) {
    return null; // Don't show slider if no slides
  }

  const currentSlide = sliders[currentIndex];

  return (
    <div className="hero-slider">
      <div className="slider-container">
        {sliders.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <div className="slide-overlay"></div>
            {slide.linkUrl ? (
              <a href={slide.linkUrl} className="slide-content slide-content-link" aria-label={slide.title}>
                <h1 className="slide-title">{slide.title}</h1>
                {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
              </a>
            ) : (
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>
                {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            className="slider-nav slider-nav-prev"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="slider-nav slider-nav-next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Circle Indicators */}
      {sliders.length > 1 && (
        <div className="slider-indicators">
          {sliders.map((slide, index) => (
            <button
              key={slide.id}
              className={`slider-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="indicator-dot"></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
