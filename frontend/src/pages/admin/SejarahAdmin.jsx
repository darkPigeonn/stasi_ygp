import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { sejarahAPI } from '../../services/api';
import { Plus, Edit2, Trash2, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import './AdminForms.css';
import './TiptapEditor.css';

const SejarahAdmin = () => {
  const [sejarahs, setSejarahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    category: '',
    content: '',
    order: 0
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    fetchSejarahs();
  }, []);

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  const fetchSejarahs = async () => {
    try {
      setLoading(true);
      const response = await sejarahAPI.getAll();
      const data = response.data || [];
      // Sort by order
      const sorted = data.sort((a, b) => a.order - b.order);
      setSejarahs(sorted);
    } catch (error) {
      console.error('Error fetching sejarah:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data sejarah' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSubmit = {
        ...formData,
        order: editingId ? formData.order : sejarahs.length
      };

      if (editingId) {
        await sejarahAPI.update(editingId, dataToSubmit);
        setMessage({ type: 'success', text: 'Sejarah berhasil diperbarui' });
      } else {
        await sejarahAPI.create(dataToSubmit);
        setMessage({ type: 'success', text: 'Sejarah berhasil ditambahkan' });
      }

      await fetchSejarahs();
      resetForm();
    } catch (error) {
      console.error('Error saving sejarah:', error);
      setMessage({ type: 'error', text: 'Gagal menyimpan sejarah' });
    }
  };

  const handleEdit = (sejarah) => {
    setFormData({
      year: sejarah.year,
      category: sejarah.category,
      content: sejarah.content,
      order: sejarah.order
    });
    setEditingId(sejarah.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus timeline ini?')) {
      return;
    }

    try {
      await sejarahAPI.delete(id);
      setMessage({ type: 'success', text: 'Sejarah berhasil dihapus' });
      await fetchSejarahs();
    } catch (error) {
      console.error('Error deleting sejarah:', error);
      setMessage({ type: 'error', text: 'Gagal menghapus sejarah' });
    }
  };

  const moveItem = async (index, direction) => {
    const newSejarahs = [...sejarahs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSejarahs.length) {
      return;
    }

    // Swap items
    [newSejarahs[index], newSejarahs[targetIndex]] = [newSejarahs[targetIndex], newSejarahs[index]];

    // Update order values
    newSejarahs.forEach((item, idx) => {
      item.order = idx;
    });

    setSejarahs(newSejarahs);

    // Update orders in backend
    try {
      await Promise.all(
        newSejarahs.map(item =>
          sejarahAPI.update(item.id, { ...item })
        )
      );
      setMessage({ type: 'success', text: 'Urutan berhasil diperbarui' });
    } catch (error) {
      console.error('Error updating order:', error);
      setMessage({ type: 'error', text: 'Gagal memperbarui urutan' });
      await fetchSejarahs();
    }
  };

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      category: '',
      content: '',
      order: 0
    });
    setEditingId(null);
    setShowForm(false);
    if (editor) {
      editor.commands.setContent('');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Kelola Sejarah</h1>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          <Plus size={20} />
          {showForm ? 'Tutup Form' : 'Tambah Timeline'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Timeline' : 'Tambah Timeline Baru'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="year">Tahun *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  min="1900"
                  max="2100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Kategori *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="Contoh: Pendirian, Renovasi, Era Digital"
                />
              </div>
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
              <small>Tulis deskripsi lengkap tentang peristiwa/fase sejarah ini</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Simpan'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <h2>Daftar Timeline Sejarah</h2>
        {loading ? (
          <p>Memuat data...</p>
        ) : sejarahs.length === 0 ? (
          <p>Belum ada data sejarah</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{width: '80px'}}>Urutan</th>
                  <th style={{width: '100px'}}>Tahun</th>
                  <th style={{width: '200px'}}>Kategori</th>
                  <th>Konten</th>
                  <th style={{width: '150px'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sejarahs.map((item, index) => (
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
                          disabled={index === sejarahs.length - 1}
                          className="btn-icon"
                          title="Pindah ke bawah"
                          style={{padding: '0.25rem'}}
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td><strong>{item.year}</strong></td>
                    <td>{item.category}</td>
                    <td>
                      <div
                        dangerouslySetInnerHTML={{ __html: item.content }}
                        style={{
                          maxHeight: '60px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      />
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
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SejarahAdmin;
