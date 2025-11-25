import { useState, useEffect } from 'react';
import { formulirAPI, kategoriFormulirAPI } from '../../services/api';
import { Plus, Edit2, Trash2, FileText, Settings } from 'lucide-react';
import './AdminForms.css';

const FormulirAdmin = () => {
  const [formulirs, setFormulirs] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    document: null,
    description: ''
  });

  useEffect(() => {
    fetchFormulirs();
    fetchKategoris();
  }, []);

  const fetchFormulirs = async () => {
    try {
      setLoading(true);
      const response = await formulirAPI.getAll();
      setFormulirs(response.data || []);
    } catch (error) {
      console.error('Error fetching formulirs:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data formulir' });
    } finally {
      setLoading(false);
    }
  };

  const fetchKategoris = async () => {
    try {
      const response = await kategoriFormulirAPI.getAll();
      setKategoris(response.data || []);
    } catch (error) {
      console.error('Error fetching kategoris:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data kategori formulir' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, document: file }));
  };

  const ensureKategoriExists = async (kategoriName) => {
    if (!kategoriName || !kategoriName.trim()) return null;

    const exists = kategoris.find(k => k.name === kategoriName.trim());
    if (!exists) {
      try {
        const response = await kategoriFormulirAPI.create({ name: kategoriName.trim(), description: '' });
        await fetchKategoris();
        return response.data.id;
      } catch (error) {
        console.error('Error creating kategori:', error);
        return null;
      }
    }
    return exists.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure kategori exists and get its ID
      const kategoriId = await ensureKategoriExists(formData.category);

      if (!kategoriId) {
        setMessage({ type: 'error', text: 'Gagal mendapatkan kategori' });
        return;
      }

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('kategoriFormulirId', kategoriId);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);

      // Append document file if exists
      if (formData.document) {
        submitData.append('document', formData.document);
      }

      if (editingId) {
        await formulirAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Formulir berhasil diupdate!' });
      } else {
        await formulirAPI.create(submitData);
        setMessage({ type: 'success', text: 'Formulir berhasil ditambahkan!' });
      }

      resetForm();
      fetchFormulirs();
    } catch (error) {
      console.error('Error saving formulir:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan formulir: ' + error.message });
    }
  };

  const handleEdit = (formulir) => {
    setEditingId(formulir.id);
    setFormData({
      name: formulir.name,
      category: formulir.kategoriFormulir?.name || formulir.category || '',
      document: null,
      description: formulir.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus formulir ini?')) {
      return;
    }

    try {
      await formulirAPI.delete(id);
      setMessage({ type: 'success', text: 'Formulir berhasil dihapus!' });
      fetchFormulirs();
    } catch (error) {
      console.error('Error deleting formulir:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus formulir: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      document: null,
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data formulir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Formulir</h1>
            <p>Tambah, edit, dan hapus formulir</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Formulir
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
              <h2>{editingId ? 'Edit Formulir' : 'Tambah Formulir Baru'}</h2>

              <div className="form-group">
                <label htmlFor="name">Nama Formulir *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Kategori *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  list="kategori-options"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Pilih atau ketik kategori baru"
                  required
                />
                <datalist id="kategori-options">
                  {kategoris.map((kategori) => (
                    <option key={kategori.id} value={kategori.name} />
                  ))}
                </datalist>
                <small>Pilih dari daftar atau ketik kategori baru</small>
              </div>

              <div className="form-group">
                <label htmlFor="document">Upload Formulir (PDF) {!editingId && '*'}</label>
                <input
                  type="file"
                  id="document"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required={!editingId}
                />
                <small>Format: PDF. Maksimal 5MB.</small>
              </div>

              <div className="form-group">
                <label htmlFor="description">Deskripsi</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Deskripsi formulir (opsional)"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Formulir' : 'Simpan Formulir'}
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
                  <th>Nama Formulir</th>
                  <th>Kategori</th>
                  <th>File</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {formulirs.length > 0 ? (
                  formulirs.map((formulir) => (
                    <tr key={formulir.id}>
                      <td>{formulir.name}</td>
                      <td>
                        <span className="status-badge status-published">
                          {formulir.kategoriFormulir?.name || formulir.category || '-'}
                        </span>
                      </td>
                      <td>
                        {(formulir.document || formulir.fileUrl) ? (
                          <a
                            href={`http://localhost:5000${formulir.document || formulir.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-link"
                          >
                            <FileText size={16} />
                            Download PDF
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(formulir)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(formulir.id)}
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
                      Belum ada formulir
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

export default FormulirAdmin;
