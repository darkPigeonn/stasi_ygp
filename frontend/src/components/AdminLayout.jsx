import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/profile', label: 'Profile Stasi', icon: '⚙️' },
    { path: '/admin/users', label: 'User Management', icon: '👤' },
    { path: '/admin/slider', label: 'Slider', icon: '🎬' },
    { path: '/admin/artikel', label: 'Artikel', icon: '📝' },
    { path: '/admin/pengumuman', label: 'Pengumuman', icon: '📢' },
    { path: '/admin/galeri', label: 'Galeri', icon: '🖼️' },
    { path: '/admin/sejarah', label: 'Sejarah', icon: '📜' },
    { path: '/admin/pengurus', label: 'Pengurus DPS/BGKS', icon: '👥' },
    { path: '/admin/pastor', label: 'Pastor', icon: '⛪' },
    { path: '/admin/wilayah', label: 'Wilayah', icon: '🗺️' },
    { path: '/admin/lingkungan', label: 'Lingkungan', icon: '🏘️' },
    { path: '/admin/kategorial', label: 'Kategorial', icon: '👨‍👩‍👧‍👦' },
    { path: '/admin/karya-sosial', label: 'Karya Sosial', icon: '❤️' },
    { path: '/admin/formulir', label: 'Formulir', icon: '📄' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '‹' : '›'}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <strong>{user?.username}</strong>
            <small>{user?.role}</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
