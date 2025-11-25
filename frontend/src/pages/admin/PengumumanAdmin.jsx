import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { pengumumanAPI } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './AdminForms.css';
import './TiptapEditor.css';

const PengumumanAdmin = () => {
  const [pengumumans, setPengumumans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Pengumuman Stasi',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    isPriority: false,
    images: []
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    fetchPengumumans();
  }, []);

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  const fetchPengumumans = async () => {
    try {
      setLoading(true);
      const response = await pengumumanAPI.getAll();

      // Parse images for each pengumuman if it's a JSON string
      const pengumumansData = (response.data || []).map(pengumuman => {
        if (pengumuman.images && typeof pengumuman.images === 'string') {
          try {
            pengumuman.images = JSON.parse(pengumuman.images);
          } catch (e) {
            console.error('Error parsing images:', e);
            pengumuman.images = [];
          }
        }
        return pengumuman;
      });

      setPengumumans(pengumumansData);
    } catch (error) {
      console.error('Error fetching pengumumans:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data pengumuman' });
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

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      submitData.append('publishDate', formData.publishDate);
      submitData.append('isPriority', formData.isPriority);

      // Append images
      formData.images.forEach((file) => {
        submitData.append('images', file);
      });

      if (editingId) {
        await pengumumanAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Pengumuman berhasil diupdate!' });
      } else {
        await pengumumanAPI.create(submitData);
        setMessage({ type: 'success', text: 'Pengumuman berhasil ditambahkan!' });
      }

      resetForm();
      fetchPengumumans();
    } catch (error) {
      console.error('Error saving pengumuman:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan pengumuman: ' + error.message });
    }
  };

  const handleEdit = (pengumuman) => {
    setEditingId(pengumuman.id);
    setFormData({
      title: pengumuman.title,
      content: pengumuman.content,
      category: pengumuman.category,
      status: pengumuman.status,
      publishDate: pengumuman.publishDate ? pengumuman.publishDate.split('T')[0] : pengumuman.publish_date ? pengumuman.publish_date.split('T')[0] : '',
      isPriority: pengumuman.isPriority || pengumuman.is_priority || false,
      images: []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      return;
    }

    try {
      await pengumumanAPI.delete(id);
      setMessage({ type: 'success', text: 'Pengumuman berhasil dihapus!' });
      fetchPengumumans();
    } catch (error) {
      console.error('Error deleting pengumuman:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus pengumuman: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Pengumuman Stasi',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      isPriority: false,
      images: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data pengumuman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Pengumuman</h1>
            <p>Tambah, edit, dan hapus pengumuman</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Pengumuman
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
              <h2>{editingId ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}</h2>

              <div className="form-group">
                <label htmlFor="title">Judul Pengumuman *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Kategori *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Pernikahan">Pernikahan</option>
                  <option value="Tahbisan Imam">Tahbisan Imam</option>
                  <option value="Tahbisan Diakon">Tahbisan Diakon</option>
                  <option value="Pengumuman Paroki">Pengumuman Paroki</option>
                  <option value="Pengumuman Stasi">Pengumuman Stasi</option>
                </select>
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="publishDate">Tanggal Publish</label>
                  <input
                    type="date"
                    id="publishDate"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPriority"
                    checked={formData.isPriority}
                    onChange={handleInputChange}
                  />
                  <span>Jadikan Prioritas (tampil di halaman utama)</span>
                </label>
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
                <small>Format: JPG, PNG, GIF. Maksimal 5 gambar.</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Pengumuman' : 'Simpan Pengumuman'}
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
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Prioritas</th>
                  <th>Tanggal Publish</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengumumans.length > 0 ? (
                  pengumumans.map((pengumuman) => (
                    <tr key={pengumuman.id}>
                      <td>{pengumuman.title}</td>
                      <td>
                        <span className="category-badge">
                          {pengumuman.category}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${pengumuman.status}`}>
                          {pengumuman.status}
                        </span>
                      </td>
                      <td>
                        {(pengumuman.isPriority || pengumuman.is_priority) ? '⭐' : '-'}
                      </td>
                      <td>
                        {pengumuman.publishDate || pengumuman.publish_date
                          ? new Date(pengumuman.publishDate || pengumuman.publish_date).toLocaleDateString('id-ID')
                          : '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(pengumuman)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(pengumuman.id)}
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
                      Belum ada pengumuman
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

export default PengumumanAdmin;
