import { useState, useEffect } from 'react';
import { sliderAPI } from '../../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import './AdminForms.css';
import { useAuth } from '../../context/AuthContext';

const SliderAdmin = () => {
  const { isAdmin } = useAuth();
  const canDelete = isAdmin();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    linkUrl: '',
    order: 0,
    isActive: true,
    image: null
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await sliderAPI.getAll();
      const sorted = (response.data || []).sort((a, b) => a.order - b.order);
      setSliders(sorted);
    } catch (error) {
      console.error('Error fetching sliders:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data slider' });
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
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Ukuran file maksimal 2MB' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'File harus berupa gambar' });
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      // Use FormData.set to avoid duplicate keys (can cause backend parsing like "0,3")
      submitData.set('title', formData.title);
      submitData.set('subtitle', formData.subtitle || '');
      submitData.set('linkUrl', formData.linkUrl || '');
      submitData.set('isActive', formData.isActive ? '1' : '0');

      if (formData.image) {
        submitData.append('image', formData.image);
      } else if (!editingId) {
        setMessage({ type: 'error', text: 'Gambar slider wajib diisi' });
        return;
      }

      if (editingId) {
        submitData.set('order', String(Number(formData.order) || 0));
        await sliderAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Slider berhasil diperbarui' });
      } else {
        submitData.set('order', String(sliders.length));
        await sliderAPI.create(submitData);
        setMessage({ type: 'success', text: 'Slider berhasil ditambahkan' });
      }

      await fetchSliders();
      resetForm();
    } catch (error) {
      console.error('Error saving slider:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan slider: ' + error.message });
    }
  };

  const handleEdit = (slider) => {
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle || '',
      linkUrl: slider.linkUrl || '',
      order: slider.order,
      isActive: slider.isActive,
      image: null
    });
    setEditingId(slider.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      setMessage({ type: 'error', text: 'Hapus slider hanya bisa dilakukan oleh admin' });
      return;
    }
    if (!window.confirm('Apakah Anda yakin ingin menghapus slider ini?')) {
      return;
    }

    try {
      await sliderAPI.delete(id);
      setMessage({ type: 'success', text: 'Slider berhasil dihapus' });
      await fetchSliders();
    } catch (error) {
      console.error('Error deleting slider:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus slider: ' + error.message });
    }
  };

  const moveItem = async (index, direction) => {
    const newSliders = [...sliders];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSliders.length) {
      return;
    }

    // Swap items
    [newSliders[index], newSliders[targetIndex]] = [newSliders[targetIndex], newSliders[index]];

    // Update order values
    newSliders.forEach((item, idx) => {
      item.order = idx;
    });

    setSliders(newSliders);

    // Update orders in backend
    try {
      const formData1 = new FormData();
      formData1.append('title', newSliders[index].title);
      formData1.append('subtitle', newSliders[index].subtitle || '');
      formData1.append('linkUrl', newSliders[index].linkUrl || '');
      formData1.append('order', newSliders[index].order);
      formData1.append('isActive', newSliders[index].isActive);

      const formData2 = new FormData();
      formData2.append('title', newSliders[targetIndex].title);
      formData2.append('subtitle', newSliders[targetIndex].subtitle || '');
      formData2.append('linkUrl', newSliders[targetIndex].linkUrl || '');
      formData2.append('order', newSliders[targetIndex].order);
      formData2.append('isActive', newSliders[targetIndex].isActive);

      await Promise.all([
        sliderAPI.update(newSliders[index].id, formData1),
        sliderAPI.update(newSliders[targetIndex].id, formData2)
      ]);

      setMessage({ type: 'success', text: 'Urutan berhasil diperbarui' });
    } catch (error) {
      console.error('Error updating order:', error);
      setMessage({ type: 'error', text: 'Gagal memperbarui urutan' });
      await fetchSliders();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      linkUrl: '',
      order: 0,
      isActive: true,
      image: null
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Slider</h1>
            <p>Tambah, edit, dan hapus slider</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Slider
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
              <h2>{editingId ? 'Edit Slider' : 'Tambah Slider Baru'}</h2>
            <div className="form-group">
              <label htmlFor="title">Judul Slider *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={200}
                placeholder="Contoh: Perayaan Ekaristi Mingguan"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subtitle">Sub Judul</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                maxLength={255}
                placeholder="Contoh: Bergabunglah bersama kami setiap Minggu"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Upload Gambar Slider * {editingId && '(kosongkan jika tidak ingin mengubah)'}</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                required={!editingId}
              />
              <small>Ukuran rekomendasi: 1920x600px, maksimal 2MB. Format: JPG, PNG</small>
            </div>

            <div className="form-group">
              <label htmlFor="linkUrl">Link URL (Opsional)</label>
              <input
                type="url"
                id="linkUrl"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleInputChange}
                maxLength={255}
                placeholder="https://example.com (opsional)"
              />
              <small>URL tujuan jika slider diklik</small>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <span style={{ marginLeft: '0.5rem' }}>Aktifkan Slider</span>
              </label>
              <small>Hanya slider aktif yang ditampilkan di website (maksimal 5)</small>
            </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Slider' : 'Simpan Slider'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
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
                  <th style={{width: '80px', textAlign: 'center'}}>Urutan</th>
                  <th style={{width: '120px'}}>Gambar</th>
                  <th>Judul & Sub Judul</th>
                  <th style={{width: '100px'}}>Status</th>
                  <th style={{width: '120px'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Memuat data...
                    </td>
                  </tr>
                ) : sliders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Belum ada slider
                    </td>
                  </tr>
                ) : (
                  sliders.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{textAlign: 'center'}}>
                      <div style={{display: 'flex', gap: '0.25rem', justifyContent: 'center'}}>
                        <button
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          className="btn-icon"
                          title="Pindah ke atas"
                          style={{padding: '0.25rem'}}
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === sliders.length - 1}
                          className="btn-icon"
                          title="Pindah ke bawah"
                          style={{padding: '0.25rem'}}
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '50px',
                          background: '#f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px'
                        }}>
                          <ImageIcon size={20} color="#999" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div><strong>{item.title}</strong></div>
                      {item.subtitle && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                          {item.subtitle}
                        </div>
                      )}
                      {item.linkUrl && (
                        <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.25rem' }}>
                          🔗 <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" style={{color: 'inherit'}}>
                            {item.linkUrl.length > 40 ? item.linkUrl.substring(0, 40) + '...' : item.linkUrl}
                          </a>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${item.isActive ? 'status-active' : 'status-inactive'}`}>
                        {item.isActive ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn-icon btn-edit"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="btn-icon btn-delete"
                          title={canDelete ? 'Hapus' : 'Hanya admin yang bisa menghapus slider'}
                          disabled={!canDelete}
                          style={!canDelete ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderAdmin;
