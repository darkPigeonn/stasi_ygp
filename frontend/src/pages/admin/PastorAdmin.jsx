import { useState, useEffect } from 'react';
import { pastorAPI, getImageUrl } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './AdminForms.css';

const PastorAdmin = () => {
  const [pastors, setPastors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    pastorType: 'Gembala Kami',
    priestType: 'Romo Paroki/Stasi',
    name: '',
    nickname: '',
    ordinationDate: '',
    serveFrom: '',
    serveTo: '',
    photo: null,
    biography: ''
  });

  useEffect(() => {
    fetchPastors();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchPastors = async () => {
    try {
      setLoading(true);
      const response = await pastorAPI.getAll();
      setPastors(response.data || []);
    } catch (error) {
      console.error('Error fetching pastors:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data pastor' });
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
    setFormData(prev => ({ ...prev, photo: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append('pastorType', formData.pastorType);
      submitData.append('priestType', formData.priestType);
      submitData.append('name', formData.name);
      submitData.append('nickname', formData.nickname);

      if (formData.ordinationDate) {
        submitData.append('ordinationDate', formData.ordinationDate);
      }
      if (formData.serveFrom) {
        submitData.append('serveFrom', formData.serveFrom);
      }
      if (formData.serveTo) {
        submitData.append('serveTo', formData.serveTo);
      }
      if (formData.photo instanceof File) {
        submitData.append('photo', formData.photo);
      }
      if (formData.biography) {
        submitData.append('biography', formData.biography);
      }

      if (editingId) {
        await pastorAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Pastor berhasil diperbarui!' });
      } else {
        await pastorAPI.create(submitData);
        setMessage({ type: 'success', text: 'Pastor berhasil ditambahkan!' });
      }

      resetForm();
      fetchPastors();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving pastor:', error);
      setMessage({ type: 'error', text: error.message || 'Gagal menyimpan data pastor' });
    }
  };

  const handleEdit = (pastor) => {
    setFormData({
      pastorType: pastor.pastorType,
      priestType: pastor.priestType,
      name: pastor.name,
      nickname: pastor.nickname || '',
      ordinationDate: pastor.ordinationDate || '',
      serveFrom: pastor.serveFrom || '',
      serveTo: pastor.serveTo || '',
      photo: null,
      biography: pastor.biography || ''
    });
    setEditingId(pastor.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pastor ini?')) {
      return;
    }

    try {
      await pastorAPI.delete(id);
      setMessage({ type: 'success', text: 'Pastor berhasil dihapus!' });
      fetchPastors();
    } catch (error) {
      console.error('Error deleting pastor:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus pastor: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      pastorType: 'Gembala Kami',
      priestType: 'Romo Paroki/Stasi',
      name: '',
      nickname: '',
      ordinationDate: '',
      serveFrom: '',
      serveTo: '',
      photo: null,
      biography: ''
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
          <p>Memuat data pastor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Pastor</h1>
            <p>Tambah, edit, dan hapus data pastor</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Pastor
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
              <h2>{editingId ? 'Edit Pastor' : 'Tambah Pastor Baru'}</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pastorType">Tipe Pastor *</label>
                  <select
                    id="pastorType"
                    name="pastorType"
                    value={formData.pastorType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Gembala Kami">Gembala Kami</option>
                    <option value="Pernah Berkarya">Pernah Berkarya</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priestType">Jabatan *</label>
                  <select
                    id="priestType"
                    name="priestType"
                    value={formData.priestType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Romo Paroki/Stasi">Romo Paroki/Stasi</option>
                    <option value="Romo Rekan">Romo Rekan</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Rm. Yohanes Paulus"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nickname">Nama Panggilan</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="Contoh: Rm. JP"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ordinationDate">Tanggal Tahbisan Imamat</label>
                  <input
                    type="date"
                    id="ordinationDate"
                    name="ordinationDate"
                    value={formData.ordinationDate}
                    onChange={handleInputChange}
                  />
                  <small>Hanya untuk Gembala Kami</small>
                </div>

                <div className="form-group">
                  <label htmlFor="photo">Foto</label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <small>Hanya untuk Gembala Kami. Format: JPG, PNG (max 2MB)</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serveFrom">Berkarya Dari (Tahun)</label>
                  <input
                    type="number"
                    id="serveFrom"
                    name="serveFrom"
                    value={formData.serveFrom}
                    onChange={handleInputChange}
                    placeholder="Contoh: 2020"
                    min="1900"
                    max="2100"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="serveTo">Berkarya Sampai (Tahun)</label>
                  <input
                    type="number"
                    id="serveTo"
                    name="serveTo"
                    value={formData.serveTo}
                    onChange={handleInputChange}
                    placeholder="Kosongkan jika masih berkarya"
                    min="1900"
                    max="2100"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="biography">Biografi Singkat</label>
                <textarea
                  id="biography"
                  name="biography"
                  value={formData.biography}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tulis biografi singkat pastor..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Pastor' : 'Simpan Pastor'}
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
                  <th>Foto</th>
                  <th>Tipe</th>
                  <th>Jabatan</th>
                  <th>Nama</th>
                  <th>Periode</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pastors.length > 0 ? (
                  pastors.map((pastor) => (
                    <tr key={pastor.id}>
                      <td>
                        {pastor.photo ? (
                          <img
                            src={getImageUrl(pastor.photo)}
                            alt={pastor.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '50%'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#666'
                          }}>
                            No Photo
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge status-${pastor.pastorType === 'Gembala Kami' ? 'published' : 'draft'}`}>
                          {pastor.pastorType}
                        </span>
                      </td>
                      <td>{pastor.priestType}</td>
                      <td>
                        <div>
                          <strong>{pastor.name}</strong>
                          {pastor.nickname && (
                            <div style={{ fontSize: '0.875rem', color: '#666' }}>
                              ({pastor.nickname})
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {pastor.serveFrom ? (
                          `${pastor.serveFrom} - ${pastor.serveTo || 'Sekarang'}`
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(pastor)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(pastor.id)}
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
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      Belum ada data pastor
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

export default PastorAdmin;
