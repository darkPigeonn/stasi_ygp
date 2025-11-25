import { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Key } from 'lucide-react';
import { userAPI } from '../../services/api';
import './AdminForms.css';

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'konten',
    isActive: true
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Gagal memuat data user');
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

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form
      if (!formData.username || !formData.email) {
        alert('Username dan email harus diisi');
        return;
      }

      if (!editingUser && !formData.password) {
        alert('Password harus diisi untuk user baru');
        return;
      }

      const dataToSend = { ...formData };

      // Remove password if editing and password is empty
      if (editingUser && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (editingUser) {
        await userAPI.update(editingUser.id, dataToSend);
        alert('User berhasil diupdate');
      } else {
        await userAPI.create(dataToSend);
        alert('User berhasil ditambahkan');
      }

      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.message || 'Gagal menyimpan data user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't populate password
      role: user.role,
      isActive: user.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }

    try {
      await userAPI.delete(id);
      alert('User berhasil dihapus');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Gagal menghapus user');
    }
  };

  const handleChangePassword = (user) => {
    setEditingUser(user);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password minimal 6 karakter');
      return;
    }

    try {
      await userAPI.changePassword(editingUser.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      alert('Password berhasil diubah');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.message || 'Gagal mengubah password');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'konten',
      isActive: true
    });
    setEditingUser(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manajemen User</h1>
        <button className="btn-add" onClick={handleAddNew}>
          <UserPlus size={20} />
          Tambah User
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === 'admin' ? 'Admin' : 'Konten'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(user)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon btn-key"
                        onClick={() => handleChangePassword(user)}
                        title="Ubah Password"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(user.id)}
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? 'Edit User' : 'Tambah User Baru'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password {!editingUser && '*'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                  placeholder={editingUser ? 'Kosongkan jika tidak ingin mengubah' : ''}
                />
                {!editingUser && (
                  <small>Minimal 6 karakter</small>
                )}
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="konten">Konten</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span>User Aktif</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-save">
                  {editingUser ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Ubah Password - {editingUser?.username}</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Password Lama *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password Baru *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
                <small>Minimal 6 karakter</small>
              </div>

              <div className="form-group">
                <label>Konfirmasi Password Baru *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPasswordModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-save">
                  Ubah Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdmin;
