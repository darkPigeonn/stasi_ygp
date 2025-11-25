import { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { formulirAPI } from '../services/api';
import './Formulir.css';

const Formulir = () => {
  const [formulirs, setFormulirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const fetchFormulirs = async () => {
      try {
        setLoading(true);
        const response = await formulirAPI.getAll();
        setFormulirs(response.data || []);
      } catch (error) {
        console.error('Error fetching formulirs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormulirs();
  }, []);

  // Get unique categories
  const categories = ['Semua', ...new Set(formulirs.map(f => f.category))];

  // Filter formulirs by category
  const filteredFormulirs = selectedCategory === 'Semua'
    ? formulirs
    : formulirs.filter(f => f.category === selectedCategory);

  // Group by category
  const groupedFormulirs = filteredFormulirs.reduce((acc, formulir) => {
    const category = formulir.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(formulir);
    return acc;
  }, {});

  return (
    <div className="formulir-page">
      <div className="page-header">
        <div className="container">
          <h1>Formulir Stasi</h1>
          <p>Unduh formulir yang Anda butuhkan</p>
        </div>
      </div>

      <div className="container">
        <div className="intro-section">
          <p>
            Berikut adalah daftar formulir yang tersedia untuk berbagai keperluan di Stasi Yohanes Gabriel Perboyre.
            Silakan unduh formulir yang Anda butuhkan, lengkapi dengan benar, dan serahkan ke sekretariat stasi.
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{textAlign: 'center', padding: '2rem'}}>Memuat data formulir...</p>
        ) : Object.keys(groupedFormulirs).length > 0 ? (
          <div className="formulir-sections">
            {Object.entries(groupedFormulirs).map(([category, forms], index) => (
              <div key={index} className="formulir-category">
                <h2 className="category-title">
                  <FileText size={24} />
                  {category}
                </h2>
                <div className="formulir-list">
                  {forms.map((formulir) => (
                    <div key={formulir.id} className="formulir-card">
                      <div className="formulir-info">
                        <h3>{formulir.name}</h3>
                        <p>{formulir.description}</p>
                      </div>
                      <a
                        href={`http://localhost:5000${formulir.document || formulir.fileUrl}`}
                        download
                        className="download-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={20} />
                        Unduh
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{textAlign: 'center', padding: '2rem'}}>Tidak ada formulir tersedia</p>
        )}

        <div className="info-box">
          <h3>Informasi Penting</h3>
          <ul>
            <li>Pastikan formulir diisi dengan lengkap dan jelas</li>
            <li>Formulir yang sudah diisi dapat diserahkan ke sekretariat stasi setelah Misa atau pada jam kerja</li>
            <li>Untuk informasi lebih lanjut, silakan hubungi sekretariat stasi</li>
            <li>Beberapa formulir memerlukan dokumen pendukung, pastikan Anda membawa kelengkapan yang diperlukan</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Formulir;
