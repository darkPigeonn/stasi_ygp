import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { kategorialAPI } from '../../services/api';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import './AdminForms.css';
import './TiptapEditor.css';
import { getImageUrl } from '../../utils/imagePlaceholder';

const KategorialAdmin = () => {
  const [kategoriales, setKategoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    content: '',
    schedule: '',
    contact: '',
    image: null,
    order: 0,
    isActive: true
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    fetchKategoriales();
  }, []);

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  const fetchKategoriales = async () => {
    try {
      setLoading(true);
      const response = await kategorialAPI.getAll();
      setKategoriales(response.data || []);
    } catch (error) {
      console.error('Error fetching kategoriales:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data kategorial' });
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
      submitData.append('content', formData.content);
      submitData.append('schedule', formData.schedule);
      submitData.append('contact', formData.contact);
      submitData.append('order', formData.order);
      submitData.append('isActive', formData.isActive);

      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingId) {
        await kategorialAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Kategorial berhasil diupdate!' });
      } else {
        await kategorialAPI.create(submitData);
        setMessage({ type: 'success', text: 'Kategorial berhasil ditambahkan!' });
      }

      resetForm();
      fetchKategoriales();
    } catch (error) {
      console.error('Error saving kategorial:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan kategorial: ' + error.message });
    }
  };

  const handleEdit = (kategorial) => {
    setEditingId(kategorial.id);
    setFormData({
      name: kategorial.name,
      content: kategorial.content || '',
      schedule: kategorial.schedule || '',
      contact: kategorial.contact || '',
      image: null,
      order: kategorial.order || 0,
      isActive: kategorial.isActive !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategorial ini?')) {
      return;
    }

    try {
      await kategorialAPI.delete(id);
      setMessage({ type: 'success', text: 'Kategorial berhasil dihapus!' });
      fetchKategoriales();
    } catch (error) {
      console.error('Error deleting kategorial:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus kategorial: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      content: '',
      schedule: '',
      contact: '',
      image: null,
      order: 0,
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data kategorial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Kategorial</h1>
            <p>Tambah, edit, dan hapus kategorial</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Kategorial
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
              <h2>{editingId ? 'Edit Kategorial' : 'Tambah Kategorial Baru'}</h2>

              <div className="form-group">
                <label htmlFor="name">Nama Kategorial *</label>
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
                <label htmlFor="content">Konten *</label>
                <div className="tiptap-editor-wrapper">
                  <div className="tiptap-menubar">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={editor?.isActive('bold') ? 'is-active' : ''}
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={editor?.isActive('italic') ? 'is-active' : ''}
                    >
                      Italic
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={editor?.isActive('bulletList') ? 'is-active' : ''}
                    >
                      Bullet List
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={editor?.isActive('orderedList') ? 'is-active' : ''}
                    >
                      Numbered List
                    </button>
                  </div>
                  <EditorContent editor={editor} className="tiptap-editor-content" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="schedule">Jadwal Pertemuan</label>
                <input
                  type="text"
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  placeholder="Contoh: Setiap Minggu pkl. 10:00 WIB"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact">Kontak Person</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Contoh: Nama (08123456789)"
                />
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
                <label htmlFor="order">Urutan Tampilan</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
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
                  {editingId ? 'Update Kategorial' : 'Simpan Kategorial'}
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
                  <th>Nama</th>
                  <th>Jadwal</th>
                  <th>Kontak</th>
                  <th>Urutan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kategoriales.length > 0 ? (
                  kategoriales.map((kategorial) => (
                    <tr key={kategorial.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {kategorial.image ? (
                            <img
                              src={`${getImageUrl(kategorial.image)}`}
                              alt={kategorial.name}
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
                          <span>{kategorial.name}</span>
                        </div>
                      </td>
                      <td>{kategorial.schedule || '-'}</td>
                      <td>{kategorial.contact || '-'}</td>
                      <td>{kategorial.order}</td>
                      <td>
                        <span className={`status-badge ${kategorial.isActive ? 'status-published' : 'status-draft'}`}>
                          {kategorial.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(kategorial)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(kategorial.id)}
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
                      Belum ada kategorial
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

export default KategorialAdmin;
