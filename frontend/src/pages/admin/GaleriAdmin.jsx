import { useState, useEffect } from 'react';
import { galeriAPI } from '../../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import './AdminForms.css';

const GaleriAdmin = () => {
  const [galeris, setGaleris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    images: [],
    googlePhotoUrl: '',
    isActive: true
  });

  useEffect(() => {
    fetchGaleris();
  }, []);

  const fetchGaleris = async () => {
    try {
      setLoading(true);
      const response = await galeriAPI.getAll();

      // Parse images for each galeri if it's a JSON string (can be double-encoded)
      const galerisData = (response.data || []).map(galeri => {
        let images = galeri.images;
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images);
            // Handle double-encoded JSON
            if (typeof images === 'string') {
              images = JSON.parse(images);
            }
          } catch (e) {
            console.error('Error parsing images:', e);
            images = [];
          }
        }
        return { ...galeri, images: images || [] };
      });

      setGaleris(galerisData);
    } catch (error) {
      console.error('Error fetching galeris:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data galeri' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: files }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one option is provided
    if (formData.images.length === 0 && !formData.googlePhotoUrl.trim()) {
      setMessage({ type: 'error', text: 'Minimal harus mengisi upload gambar atau link Google Photos' });
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('isActive', formData.isActive);

      // Add images if provided
      if (formData.images.length > 0) {
        formData.images.forEach((file) => {
          submitData.append('images', file);
        });
      }

      // Add Google Photos URL if provided
      if (formData.googlePhotoUrl.trim()) {
        submitData.append('googlePhotoUrl', formData.googlePhotoUrl);
      }

      if (editingId) {
        await galeriAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Galeri berhasil diupdate!' });
      } else {
        await galeriAPI.create(submitData);
        setMessage({ type: 'success', text: 'Galeri berhasil ditambahkan!' });
      }

      resetForm();
      fetchGaleris();
    } catch (error) {
      console.error('Error saving galeri:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan galeri: ' + error.message });
    }
  };

  const handleEdit = (galeri) => {
    setEditingId(galeri.id);

    setFormData({
      title: galeri.title,
      images: [],
      googlePhotoUrl: galeri.google_photo_url || galeri.googlePhotoUrl || '',
      isActive: galeri.is_active !== undefined ? galeri.is_active : galeri.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus galeri ini?')) {
      return;
    }

    try {
      await galeriAPI.delete(id);
      setMessage({ type: 'success', text: 'Galeri berhasil dihapus!' });
      fetchGaleris();
    } catch (error) {
      console.error('Error deleting galeri:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus galeri: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      images: [],
      googlePhotoUrl: '',
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data galeri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Galeri</h1>
            <p>Tambah, edit, dan hapus galeri foto atau link Google Photos</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Galeri
            </button>
          )}
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-section">
              <h2>{editingId ? 'Edit Galeri' : 'Tambah Galeri Baru'}</h2>

              <div className="form-group">
                <label htmlFor="title">Judul/Caption Galeri *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Perayaan Paskah 2024"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="images">Upload Gambar</label>
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                <small>Format: JPG, PNG, GIF. Maksimal 10 gambar. Untuk banyak foto, gunakan Google Photos.</small>
              </div>

              <div className="form-group">
                <label htmlFor="googlePhotoUrl">Link Google Photos / Google Drive</label>
                <input
                  type="url"
                  id="googlePhotoUrl"
                  name="googlePhotoUrl"
                  value={formData.googlePhotoUrl}
                  onChange={handleInputChange}
                  placeholder="https://photos.app.goo.gl/... atau https://drive.google.com/..."
                />
                <small>Masukkan link album Google Photos atau Google Drive yang sudah dibagikan ke publik</small>
              </div>

              <div style={{
                padding: '0.75rem',
                backgroundColor: '#f0f7ff',
                border: '1px solid #90caf9',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <small style={{ color: '#1565c0' }}>
                  <strong>Info:</strong> Anda bisa mengisi upload gambar saja, link saja, atau keduanya sekaligus.
                  Minimal salah satu harus diisi.
                </small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>Tampilkan di halaman galeri</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Galeri' : 'Simpan Galeri'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Judul</th>
                  <th>Konten</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {galeris.length > 0 ? (
                  galeris.map((galeri) => {
                    const hasGoogleUrl = galeri.google_photo_url || galeri.googlePhotoUrl;
                    const hasImages = galeri.images && galeri.images.length > 0;

                    // Get first image for thumbnail
                    let thumbnailUrl = null;
                    if (hasImages && galeri.images[0]) {
                      const firstImg = galeri.images[0];
                      thumbnailUrl = typeof firstImg === 'string' ? firstImg : (firstImg.url || null);
                    }

                    return (
                      <tr key={galeri.id}>
                        <td>
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={galeri.title}
                              style={{
                                width: '80px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '80px',
                              height: '60px',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              color: '#999'
                            }}>
                              No Image
                            </div>
                          )}
                        </td>
                        <td>{galeri.title}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {hasImages && (
                              <span className="category-badge" style={{ display: 'inline-block', width: 'fit-content' }}>
                                {galeri.images.length} foto
                              </span>
                            )}
                            {hasGoogleUrl && (
                              <a
                                href={galeri.google_photo_url || galeri.googlePhotoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: '0.875rem', color: '#1976d2' }}
                              >
                                Link Album →
                              </a>
                            )}
                            {!hasImages && !hasGoogleUrl && '-'}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${(galeri.is_active || galeri.isActive) ? 'status-published' : 'status-draft'}`}>
                            {(galeri.is_active || galeri.isActive) ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td>
                          {galeri.created_at || galeri.createdAt
                            ? new Date(galeri.created_at || galeri.createdAt).toLocaleDateString('id-ID')
                            : '-'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon btn-edit"
                              onClick={() => handleEdit(galeri)}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => handleDelete(galeri.id)}
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Belum ada galeri
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GaleriAdmin;
