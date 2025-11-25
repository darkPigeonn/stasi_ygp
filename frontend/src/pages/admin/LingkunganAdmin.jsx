import { useState, useEffect } from 'react';
import { lingkunganAPI, wilayahAPI } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './AdminForms.css';

const LingkunganAdmin = () => {
  const [lingkungans, setLingkungans] = useState([]);
  const [wilayahs, setWilayahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    wilayahId: '',
    chairman: '',
    boundaryNorth: '',
    boundaryEast: '',
    boundarySouth: '',
    boundaryWest: ''
  });

  useEffect(() => {
    fetchLingkungans();
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

  const fetchLingkungans = async () => {
    try {
      setLoading(true);
      const response = await lingkunganAPI.getAll();
      setLingkungans(response.data || []);
    } catch (error) {
      console.error('Error fetching lingkungans:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data lingkungan' });
    } finally {
      setLoading(false);
    }
  };

  const fetchWilayahs = async () => {
    try {
      const response = await wilayahAPI.getAll();
      setWilayahs(response.data || []);
    } catch (error) {
      console.error('Error fetching wilayahs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await lingkunganAPI.update(editingId, formData);
        setMessage({ type: 'success', text: 'Lingkungan berhasil diperbarui!' });
      } else {
        await lingkunganAPI.create(formData);
        setMessage({ type: 'success', text: 'Lingkungan berhasil ditambahkan!' });
      }

      resetForm();
      fetchLingkungans();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving lingkungan:', error);
      setMessage({ type: 'error', text: error.message || 'Gagal menyimpan data lingkungan' });
    }
  };

  const handleEdit = (lingkungan) => {
    setFormData({
      name: lingkungan.name,
      wilayahId: lingkungan.wilayahId || lingkungan.Wilayah?.id || '',
      chairman: lingkungan.chairman,
      boundaryNorth: lingkungan.boundaryNorth || '',
      boundaryEast: lingkungan.boundaryEast || '',
      boundarySouth: lingkungan.boundarySouth || '',
      boundaryWest: lingkungan.boundaryWest || ''
    });
    setEditingId(lingkungan.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus lingkungan ini?')) {
      return;
    }

    try {
      await lingkunganAPI.delete(id);
      setMessage({ type: 'success', text: 'Lingkungan berhasil dihapus!' });
      fetchLingkungans();
    } catch (error) {
      console.error('Error deleting lingkungan:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus lingkungan: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      wilayahId: '',
      chairman: '',
      boundaryNorth: '',
      boundaryEast: '',
      boundarySouth: '',
      boundaryWest: ''
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const getWilayahName = (lingkungan) => {
    if (lingkungan.Wilayah?.name) return lingkungan.Wilayah.name;
    const wilayah = wilayahs.find(w => w.id === lingkungan.wilayahId);
    return wilayah?.name || '-';
  };

  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data lingkungan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Lingkungan</h1>
            <p>Tambah, edit, dan hapus data lingkungan</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Lingkungan
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
              <h2>{editingId ? 'Edit Lingkungan' : 'Tambah Lingkungan Baru'}</h2>

              <div className="form-group">
                <label htmlFor="name">Nama Lingkungan *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Lingkungan St. Maria"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="wilayahId">Nama Wilayah *</label>
                <select
                  id="wilayahId"
                  name="wilayahId"
                  value={formData.wilayahId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pilih Wilayah</option>
                  {wilayahs.map((wilayah) => (
                    <option key={wilayah.id} value={wilayah.id}>
                      {wilayah.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="chairman">Ketua Lingkungan *</label>
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
                <label>Batas Lingkungan:</label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="boundaryNorth">Utara</label>
                  <input
                    type="text"
                    id="boundaryNorth"
                    name="boundaryNorth"
                    value={formData.boundaryNorth}
                    onChange={handleInputChange}
                    placeholder="Batas sebelah utara"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="boundaryEast">Timur</label>
                  <input
                    type="text"
                    id="boundaryEast"
                    name="boundaryEast"
                    value={formData.boundaryEast}
                    onChange={handleInputChange}
                    placeholder="Batas sebelah timur"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="boundarySouth">Selatan</label>
                  <input
                    type="text"
                    id="boundarySouth"
                    name="boundarySouth"
                    value={formData.boundarySouth}
                    onChange={handleInputChange}
                    placeholder="Batas sebelah selatan"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="boundaryWest">Barat</label>
                  <input
                    type="text"
                    id="boundaryWest"
                    name="boundaryWest"
                    value={formData.boundaryWest}
                    onChange={handleInputChange}
                    placeholder="Batas sebelah barat"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Lingkungan' : 'Simpan Lingkungan'}
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
                  <th>Nama Lingkungan</th>
                  <th>Wilayah</th>
                  <th>Ketua Lingkungan</th>
                  <th>Batas Lingkungan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {lingkungans.length > 0 ? (
                  lingkungans.map((lingkungan) => (
                    <tr key={lingkungan.id}>
                      <td><strong>{lingkungan.name}</strong></td>
                      <td>{getWilayahName(lingkungan)}</td>
                      <td>{lingkungan.chairman}</td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>
                          {lingkungan.boundaryNorth && (
                            <div><strong>U:</strong> {lingkungan.boundaryNorth}</div>
                          )}
                          {lingkungan.boundaryEast && (
                            <div><strong>T:</strong> {lingkungan.boundaryEast}</div>
                          )}
                          {lingkungan.boundarySouth && (
                            <div><strong>S:</strong> {lingkungan.boundarySouth}</div>
                          )}
                          {lingkungan.boundaryWest && (
                            <div><strong>B:</strong> {lingkungan.boundaryWest}</div>
                          )}
                          {!lingkungan.boundaryNorth && !lingkungan.boundaryEast &&
                           !lingkungan.boundarySouth && !lingkungan.boundaryWest && '-'}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(lingkungan)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(lingkungan.id)}
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
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Belum ada data lingkungan
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

export default LingkunganAdmin;
