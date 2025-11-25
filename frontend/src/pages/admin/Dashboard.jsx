import { useAuth } from '../../context/AuthContext';
import './DashboardNew.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-content">
      <h1>Dashboard</h1>
      <div className="welcome-card">
        <h2>Selamat Datang, {user?.username}!</h2>
        <p>Role: <strong>{user?.role}</strong></p>
        <p>Email: {user?.email}</p>
      </div>

      <div className="dashboard-info">
        <p>Gunakan menu di sebelah kiri untuk mengelola konten website.</p>
      </div>
    </div>
  );
};

export default Dashboard;
