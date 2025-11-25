import { useState, useEffect } from 'react';
import { wilayahAPI, getImageUrl } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './AdminForms.css';

const WilayahAdmin = () => {
  const [wilayahs, setWilayahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    chairman: '',
    mapImage: null
  });

  useEffect(() => {
    fetchWilayahs();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchWilayahs = async () => {
    try {
      setLoading(true);
      const response = await wilayahAPI.getAll();
      setWilayahs(response.data || []);
    } catch (error) {
      console.error('Error fetching wilayahs:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data wilayah' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, mapImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('chairman', formData.chairman);

      if (formData.mapImage instanceof File) {
        submitData.append('mapImage', formData.mapImage);
      }

      if (editingId) {
        await wilayahAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Wilayah berhasil diperbarui!' });
      } else {
        await wilayahAPI.create(submitData);
        setMessage({ type: 'success', text: 'Wilayah berhasil ditambahkan!' });
      }

      resetForm();
      fetchWilayahs();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving wilayah:', error);
      setMessage({ type: 'error', text: error.message || 'Gagal menyimpan data wilayah' });
    }
  };

  const handleEdit = (wilayah) => {
    setFormData({
      name: wilayah.name,
      chairman: wilayah.chairman,
      mapImage: null
    });
    setEditingId(wilayah.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus wilayah ini?')) {
      return;
    }

    try {
      await wilayahAPI.delete(id);
      setMessage({ type: 'success', text: 'Wilayah berhasil dihapus!' });
      fetchWilayahs();
    } catch (error) {
      console.error('Error deleting wilayah:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus wilayah: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      chairman: '',
      mapImage: null
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data wilayah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Wilayah</h1>
            <p>Tambah, edit, dan hapus data wilayah</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Wilayah
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
              <h2>{editingId ? 'Edit Wilayah' : 'Tambah Wilayah Baru'}</h2>

              <div className="form-group">
                <label htmlFor="name">Nama Wilayah *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Wilayah Utara"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="chairman">Ketua Wilayah *</label>
                <input
                  type="text"
                  id="chairman"
                  name="chairman"
                  value={formData.chairman}
                  onChange={handleInputChange}
                  placeholder="Contoh: Bpk. John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mapImage">Upload Peta Wilayah</label>
                <input
                  type="file"
                  id="mapImage"
                  name="mapImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <small>Format: JPG, PNG (max 5MB)</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Wilayah' : 'Simpan Wilayah'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
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
                  <th>Peta</th>
                  <th>Nama Wilayah</th>
                  <th>Ketua Wilayah</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {wilayahs.length > 0 ? (
                  wilayahs.map((wilayah) => (
                    <tr key={wilayah.id}>
                      <td>
                        {wilayah.mapImage ? (
                          <img
                            src={getImageUrl(wilayah.mapImage)}
                            alt={`Peta ${wilayah.name}`}
                            style={{
                              width: '80px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #e0e0e0'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '80px',
                            height: '60px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#999',
                            border: '1px solid #e0e0e0'
                          }}>
                            No Map
                          </div>
                        )}
                      </td>
                      <td><strong>{wilayah.name}</strong></td>
                      <td>{wilayah.chairman}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(wilayah)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(wilayah.id)}
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      Belum ada data wilayah
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

export default WilayahAdmin;
