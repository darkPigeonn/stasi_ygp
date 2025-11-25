import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { karyaSosialAPI } from '../../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon, Heart, Users, Gift, HandHeart, Home, Calendar, BookOpen, MessageCircle, Smile, Star, Sun, Coffee, Music, Camera, Flower2, Sparkles } from 'lucide-react';
import './AdminForms.css';
import './TiptapEditor.css';

const KaryaSosialAdmin = () => {
  const [karyaSosials, setKaryaSosials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Icon options for dropdown
  const iconOptions = [
    { value: 'Heart', label: 'Heart (Hati)', icon: Heart },
    { value: 'Users', label: 'Users (Pengguna)', icon: Users },
    { value: 'Gift', label: 'Gift (Hadiah)', icon: Gift },
    { value: 'HandHeart', label: 'HandHeart (Tangan Hati)', icon: HandHeart },
    { value: 'Home', label: 'Home (Rumah)', icon: Home },
    { value: 'Calendar', label: 'Calendar (Kalender)', icon: Calendar },
    { value: 'BookOpen', label: 'BookOpen (Buku)', icon: BookOpen },
    { value: 'MessageCircle', label: 'MessageCircle (Pesan)', icon: MessageCircle },
    { value: 'Smile', label: 'Smile (Senyum)', icon: Smile },
    { value: 'Star', label: 'Star (Bintang)', icon: Star },
    { value: 'Sun', label: 'Sun (Matahari)', icon: Sun },
    { value: 'Coffee', label: 'Coffee (Kopi)', icon: Coffee },
    { value: 'Music', label: 'Music (Musik)', icon: Music },
    { value: 'Camera', label: 'Camera (Kamera)', icon: Camera },
    { value: 'Flower2', label: 'Flower (Bunga)', icon: Flower2 },
    { value: 'Sparkles', label: 'Sparkles (Kilauan)', icon: Sparkles },
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Heart',
    activities: '',
    image: null,
    displayOrder: 0,
    isActive: true
  });

  const descriptionEditor = useEditor({
    extensions: [StarterKit],
    content: formData.description,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, description: editor.getHTML() }));
    },
  });

  const activitiesEditor = useEditor({
    extensions: [StarterKit],
    content: formData.activities,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, activities: editor.getHTML() }));
    },
  });

  useEffect(() => {
    fetchKaryaSosials();
  }, []);

  useEffect(() => {
    if (descriptionEditor && formData.description !== descriptionEditor.getHTML()) {
      descriptionEditor.commands.setContent(formData.description);
    }
  }, [formData.description, descriptionEditor]);

  useEffect(() => {
    if (activitiesEditor && formData.activities !== activitiesEditor.getHTML()) {
      activitiesEditor.commands.setContent(formData.activities);
    }
  }, [formData.activities, activitiesEditor]);

  const fetchKaryaSosials = async () => {
    try {
      setLoading(true);
      const response = await karyaSosialAPI.getAll();
      setKaryaSosials(response.data || []);
    } catch (error) {
      console.error('Error fetching karya sosials:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data karya sosial' });
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
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('icon', formData.icon);
      submitData.append('activities', formData.activities);
      submitData.append('displayOrder', formData.displayOrder);
      submitData.append('isActive', formData.isActive);

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingId) {
        await karyaSosialAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Karya sosial berhasil diupdate!' });
      } else {
        await karyaSosialAPI.create(submitData);
        setMessage({ type: 'success', text: 'Karya sosial berhasil ditambahkan!' });
      }

      resetForm();
      fetchKaryaSosials();
    } catch (error) {
      console.error('Error saving karya sosial:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan karya sosial: ' + error.message });
    }
  };

  const handleEdit = (karyaSosial) => {
    setEditingId(karyaSosial.id);
    setFormData({
      name: karyaSosial.name,
      description: karyaSosial.description || '',
      icon: karyaSosial.icon || 'Heart',
      activities: karyaSosial.activities || '',
      image: null,
      displayOrder: karyaSosial.displayOrder || 0,
      isActive: karyaSosial.isActive !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus karya sosial ini?')) {
      return;
    }

    try {
      await karyaSosialAPI.delete(id);
      setMessage({ type: 'success', text: 'Karya sosial berhasil dihapus!' });
      fetchKaryaSosials();
    } catch (error) {
      console.error('Error deleting karya sosial:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus karya sosial: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'Heart',
      activities: '',
      image: null,
      displayOrder: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data karya sosial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Karya Sosial</h1>
            <p>Tambah, edit, dan hapus program karya sosial</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Karya Sosial
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
              <h2>{editingId ? 'Edit Karya Sosial' : 'Tambah Karya Sosial Baru'}</h2>

              <div className="form-group">
                <label htmlFor="name">Nama Program *</label>
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
                <label htmlFor="description">Deskripsi *</label>
                <div className="tiptap-editor-wrapper">
                  <div className="tiptap-menubar">
                    <button
                      type="button"
                      onClick={() => descriptionEditor?.chain().focus().toggleBold().run()}
                      className={descriptionEditor?.isActive('bold') ? 'is-active' : ''}
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => descriptionEditor?.chain().focus().toggleItalic().run()}
                      className={descriptionEditor?.isActive('italic') ? 'is-active' : ''}
                    >
                      Italic
                    </button>
                    <button
                      type="button"
                      onClick={() => descriptionEditor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={descriptionEditor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => descriptionEditor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={descriptionEditor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => descriptionEditor?.chain().focus().toggleBulletList().run()}
                      className={descriptionEditor?.isActive('bulletList') ? 'is-active' : ''}
                    >
                      Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => descriptionEditor?.chain().focus().toggleOrderedList().run()}
                      className={descriptionEditor?.isActive('orderedList') ? 'is-active' : ''}
                    >
                      Numbered List
                    </button>
                  </div>
                  <EditorContent editor={descriptionEditor} className="tiptap-editor-content" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="icon">Icon</label>
                <select
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#666' }}>Preview:</span>
                  {(() => {
                    const selectedIcon = iconOptions.find(opt => opt.value === formData.icon);
                    if (selectedIcon) {
                      const IconComponent = selectedIcon.icon;
                      return <IconComponent size={32} color="#3b82f6" />;
                    }
                    return null;
                  })()}
                  <span style={{ color: '#3b82f6', fontWeight: '600' }}>{formData.icon}</span>
                </div>
                <small>Pilih icon yang sesuai dengan program karya sosial</small>
              </div>

              <div className="form-group">
                <label htmlFor="activities">Kegiatan *</label>
                <div className="tiptap-editor-wrapper">
                  <div className="tiptap-menubar">
                    <button
                      type="button"
                      onClick={() => activitiesEditor?.chain().focus().toggleBold().run()}
                      className={activitiesEditor?.isActive('bold') ? 'is-active' : ''}
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => activitiesEditor?.chain().focus().toggleItalic().run()}
                      className={activitiesEditor?.isActive('italic') ? 'is-active' : ''}
                    >
                      Italic
                    </button>
                    <button
                      type="button"
                      onClick={() => activitiesEditor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={activitiesEditor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => activitiesEditor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={activitiesEditor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => activitiesEditor?.chain().focus().toggleBulletList().run()}
                      className={activitiesEditor?.isActive('bulletList') ? 'is-active' : ''}
                    >
                      Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => activitiesEditor?.chain().focus().toggleOrderedList().run()}
                      className={activitiesEditor?.isActive('orderedList') ? 'is-active' : ''}
                    >
                      Numbered List
                    </button>
                  </div>
                  <EditorContent editor={activitiesEditor} className="tiptap-editor-content" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image">Upload Gambar {!editingId && '*'}</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!editingId}
                />
                <small>Format: JPG, PNG, atau GIF. Maksimal 2MB.</small>
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
                />
                <small>Angka lebih kecil akan ditampilkan lebih awal</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>Aktif</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Karya Sosial' : 'Simpan Karya Sosial'}
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
                  <th>Nama Program</th>
                  <th>Icon</th>
                  <th>Urutan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {karyaSosials.length > 0 ? (
                  karyaSosials.map((karyaSosial) => (
                    <tr key={karyaSosial.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {karyaSosial.image ? (
                            <img
                              src={`http://localhost:5000${karyaSosial.image}`}
                              alt={karyaSosial.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <ImageIcon size={20} color="#999" />
                            </div>
                          )}
                          <span>{karyaSosial.name}</span>
                        </div>
                      </td>
                      <td>{karyaSosial.icon}</td>
                      <td>{karyaSosial.displayOrder}</td>
                      <td>
                        <span className={`status-badge ${karyaSosial.isActive ? 'status-published' : 'status-draft'}`}>
                          {karyaSosial.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(karyaSosial)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(karyaSosial.id)}
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
                      Belum ada karya sosial
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

export default KaryaSosialAdmin;
