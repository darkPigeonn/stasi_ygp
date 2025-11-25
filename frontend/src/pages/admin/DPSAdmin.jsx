import { useState, useEffect } from 'react';
import { dpsAPI, jabatanAPI, subJabatanAPI } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getImageUrl, handleImageError } from '../../utils/imagePlaceholder';
import './AdminForms.css';

const DPSAdmin = () => {
  const [dpsList, setDpsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Jabatan options - loaded from database
  const [jabatanOptions, setJabatanOptions] = useState([]);

  // Sub Jabatan options - loaded from database
  const [subJabatanOptions, setSubJabatanOptions] = useState([]);

  const [formData, setFormData] = useState({
    type: 'DPS',
    jabatan: '',
    subJabatan: '',
    baptismName: '',
    fullName: '',
    photo: null,
    displayOrder: 0
  });

  useEffect(() => {
    fetchDPS();
    fetchJabatan();
    fetchSubJabatan();
  }, []);

  const fetchDPS = async () => {
    try {
      setLoading(true);
      const response = await dpsAPI.getAll();
      const dpsData = (response.data || []).sort((a, b) =>
        (a.display_order || a.displayOrder || 0) - (b.display_order || b.displayOrder || 0)
      );
      setDpsList(dpsData);
    } catch (error) {
      console.error('Error fetching DPS:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data DPS' });
    } finally {
      setLoading(false);
    }
  };

  const fetchJabatan = async () => {
    try {
      const response = await jabatanAPI.getAll();
      setJabatanOptions(response.data || []);
    } catch (error) {
      console.error('Error fetching jabatan:', error);
    }
  };

  const fetchSubJabatan = async () => {
    try {
      const response = await subJabatanAPI.getAll();
      setSubJabatanOptions(response.data || []);
    } catch (error) {
      console.error('Error fetching sub jabatan:', error);
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

  const ensureJabatanExists = async (jabatanName) => {
    if (!jabatanName || !jabatanName.trim()) return;

    const exists = jabatanOptions.find(j => j.name === jabatanName.trim());
    if (!exists) {
      try {
        await jabatanAPI.create({ name: jabatanName.trim(), displayOrder: 0 });
        await fetchJabatan();
      } catch (error) {
        console.error('Error creating jabatan:', error);
      }
    }
  };

  const ensureSubJabatanExists = async (subJabatanName) => {
    if (!subJabatanName || !subJabatanName.trim()) return;

    const exists = subJabatanOptions.find(sj => sj.name === subJabatanName.trim());
    if (!exists) {
      try {
        await subJabatanAPI.create({ name: subJabatanName.trim(), displayOrder: 0 });
        await fetchSubJabatan();
      } catch (error) {
        console.error('Error creating sub jabatan:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create jabatan/sub jabatan if they don't exist
      await ensureJabatanExists(formData.jabatan);
      await ensureSubJabatanExists(formData.subJabatan);

      const submitData = new FormData();
      submitData.append('type', formData.type);
      submitData.append('position', formData.jabatan);
      submitData.append('subPosition', formData.subJabatan);
      submitData.append('baptismName', formData.baptismName);
      submitData.append('fullName', formData.fullName);
      submitData.append('order', formData.displayOrder);

      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      if (editingId) {
        await dpsAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'DPS berhasil diupdate!' });
      } else {
        await dpsAPI.create(submitData);
        setMessage({ type: 'success', text: 'DPS berhasil ditambahkan!' });
      }

      resetForm();
      fetchDPS();
    } catch (error) {
      console.error('Error saving DPS:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan DPS: ' + error.message });
    }
  };

  const handleEdit = (dps) => {
    setEditingId(dps.id);
    setFormData({
      type: dps.type,
      jabatan: dps.position || dps.jabatan || '',
      subJabatan: dps.subPosition || dps.sub_jabatan || dps.subJabatan || '',
      baptismName: dps.baptismName || dps.baptism_name || '',
      fullName: dps.fullName || dps.full_name || '',
      photo: null,
      displayOrder: dps.order || dps.displayOrder || dps.display_order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus anggota DPS ini?')) {
      return;
    }

    try {
      await dpsAPI.delete(id);
      setMessage({ type: 'success', text: 'DPS berhasil dihapus!' });
      fetchDPS();
    } catch (error) {
      console.error('Error deleting DPS:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus DPS: ' + error.message });
    }
  };

  const handleDeleteJabatan = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus jabatan "${name}"?`)) {
      return;
    }

    try {
      await jabatanAPI.delete(id);
      setMessage({ type: 'success', text: 'Jabatan berhasil dihapus!' });
      fetchJabatan();
    } catch (error) {
      console.error('Error deleting jabatan:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus jabatan: ' + error.message });
    }
  };

  const handleDeleteSubJabatan = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus sub jabatan "${name}"?`)) {
      return;
    }

    try {
      await subJabatanAPI.delete(id);
      setMessage({ type: 'success', text: 'Sub Jabatan berhasil dihapus!' });
      fetchSubJabatan();
    } catch (error) {
      console.error('Error deleting sub jabatan:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus sub jabatan: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'DPS',
      jabatan: '',
      subJabatan: '',
      baptismName: '',
      fullName: '',
      photo: null,
      displayOrder: 0
    });
    setEditingId(null);
    setShowForm(false);
  };


  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data DPS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola DPS/BGKS</h1>
            <p>Tambah, edit, dan hapus anggota Dewan Pastoral Stasi / Badan Pengurus Kelompok Stasi</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!showForm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                Tambah Anggota
              </button>
            )}
          </div>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-section">
              <h2>{editingId ? 'Edit Anggota DPS' : 'Tambah Anggota DPS Baru'}</h2>

              <div className="form-group">
                <label htmlFor="type">Tipe *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="DPS">DPS</option>
                  <option value="BGKS">BGKS</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="jabatan">Jabatan *</label>
                <input
                  type="text"
                  id="jabatan"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleInputChange}
                  list="jabatan-options"
                  placeholder="Pilih atau ketik jabatan baru"
                  required
                />
                <datalist id="jabatan-options">
                  {jabatanOptions.map((jabatan) => (
                    <option key={jabatan.id} value={jabatan.name} />
                  ))}
                </datalist>
                <small>Pilih dari daftar atau ketik jabatan baru</small>
                {jabatanOptions.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {jabatanOptions.map((jabatan) => (
                      <div key={jabatan.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        <span>{jabatan.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteJabatan(jabatan.id, jabatan.name)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: '0 4px',
                            fontSize: '1rem'
                          }}
                          title="Hapus jabatan"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="subJabatan">Sub Jabatan</label>
                <input
                  type="text"
                  id="subJabatan"
                  name="subJabatan"
                  value={formData.subJabatan}
                  onChange={handleInputChange}
                  list="sub-jabatan-options"
                  placeholder="Pilih atau ketik sub jabatan baru (opsional)"
                />
                <datalist id="sub-jabatan-options">
                  {subJabatanOptions.map((subJabatan) => (
                    <option key={subJabatan.id} value={subJabatan.name} />
                  ))}
                </datalist>
                <small>Pilih dari daftar atau ketik sub jabatan baru</small>
                {subJabatanOptions.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {subJabatanOptions.map((subJabatan) => (
                      <div key={subJabatan.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        <span>{subJabatan.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubJabatan(subJabatan.id, subJabatan.name)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            cursor: 'pointer',
                            padding: '0 4px',
                            fontSize: '1rem'
                          }}
                          title="Hapus sub jabatan"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="baptismName">Nama Baptis</label>
                <input
                  type="text"
                  id="baptismName"
                  name="baptismName"
                  value={formData.baptismName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Yohanes"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fullName">Nama Lengkap *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Budi Santoso"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo">Foto</label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <small>Format: JPG, PNG. Ukuran maksimal 2MB. Rasio 1:1 (persegi) direkomendasikan</small>
              </div>

              <div className="form-group">
                <label htmlFor="displayOrder">Urutan Tampilan</label>
                <input
                  type="number"
                  id="displayOrder"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                />
                <small>Urutan tampilan (semakin kecil akan tampil lebih awal)</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Anggota' : 'Simpan Anggota'}
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
                  <th>Foto</th>
                  <th>Tipe</th>
                  <th>Jabatan</th>
                  <th>Sub Jabatan</th>
                  <th>Nama Baptis</th>
                  <th>Nama Lengkap</th>
                  <th>Urutan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dpsList.length > 0 ? (
                  dpsList.map((dps) => (
                    <tr key={dps.id}>
                      <td>
                        {dps.photo ? (
                          <img
                            src={getImageUrl(dps.photo)}
                            alt={dps.fullName || dps.full_name}
                            onError={(e) => handleImageError(e, 'DPS')}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '50%'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            color: '#999'
                          }}>
                            No Photo
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="category-badge">{dps.type}</span>
                      </td>
                      <td>{dps.position || dps.jabatan || '-'}</td>
                      <td>{dps.subPosition || dps.sub_jabatan || dps.subJabatan || '-'}</td>
                      <td>{dps.baptismName || dps.baptism_name || '-'}</td>
                      <td>{dps.fullName || dps.full_name}</td>
                      <td>{dps.order || dps.displayOrder || dps.display_order || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(dps)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(dps.id)}
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
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      Belum ada anggota DPS
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

export default DPSAdmin;
