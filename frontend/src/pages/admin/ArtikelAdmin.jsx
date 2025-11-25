import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { artikelAPI } from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './AdminForms.css';
import './TiptapEditor.css';

const ArtikelAdmin = () => {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
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
    fetchArtikels();
  }, []);

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  const fetchArtikels = async () => {
    try {
      setLoading(true);
      const response = await artikelAPI.getAll();
      setArtikels(response.data || []);
    } catch (error) {
      console.error('Error fetching artikels:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data artikel' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      submitData.append('status', formData.status);
      submitData.append('publishDate', formData.publishDate);

      // Append images
      formData.images.forEach((file) => {
        submitData.append('images', file);
      });

      if (editingId) {
        await artikelAPI.update(editingId, submitData);
        setMessage({ type: 'success', text: 'Artikel berhasil diupdate!' });
      } else {
        await artikelAPI.create(submitData);
        setMessage({ type: 'success', text: 'Artikel berhasil ditambahkan!' });
      }

      resetForm();
      fetchArtikels();
    } catch (error) {
      console.error('Error saving artikel:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan artikel: ' + error.message });
    }
  };

  const handleEdit = (artikel) => {
    setEditingId(artikel.id);
    setFormData({
      title: artikel.title,
      content: artikel.content,
      status: artikel.status,
      publishDate: artikel.publishDate ? artikel.publishDate.split('T')[0] : '',
      images: []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
      return;
    }

    try {
      await artikelAPI.delete(id);
      setMessage({ type: 'success', text: 'Artikel berhasil dihapus!' });
      fetchArtikels();
    } catch (error) {
      console.error('Error deleting artikel:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus artikel: ' + error.message });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      images: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && !showForm) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Memuat data artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Kelola Artikel</h1>
            <p>Tambah, edit, dan hapus artikel</p>
          </div>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Tambah Artikel
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
              <h2>{editingId ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>

              <div className="form-group">
                <label htmlFor="title">Judul Artikel *</label>
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
                  {editingId ? 'Update Artikel' : 'Simpan Artikel'}
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
                  <th>Status</th>
                  <th>Tanggal Publish</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {artikels.length > 0 ? (
                  artikels.map((artikel) => (
                    <tr key={artikel.id}>
                      <td>{artikel.title}</td>
                      <td>
                        <span className={`status-badge status-${artikel.status}`}>
                          {artikel.status}
                        </span>
                      </td>
                      <td>
                        {artikel.publishDate
                          ? new Date(artikel.publishDate).toLocaleDateString('id-ID')
                          : '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(artikel)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(artikel.id)}
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
                      Belum ada artikel
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

export default ArtikelAdmin;
