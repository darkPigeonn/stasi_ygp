import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import ArtikelAdmin from './pages/admin/ArtikelAdmin';
import PengumumanAdmin from './pages/admin/PengumumanAdmin';
import GaleriAdmin from './pages/admin/GaleriAdmin';
import DPSAdmin from './pages/admin/DPSAdmin';
import PastorAdmin from './pages/admin/PastorAdmin';
import WilayahAdmin from './pages/admin/WilayahAdmin';
import LingkunganAdmin from './pages/admin/LingkunganAdmin';
import FormulirAdmin from './pages/admin/FormulirAdmin';
import KategorialAdmin from './pages/admin/KategorialAdmin';
import KaryaSosialAdmin from './pages/admin/KaryaSosialAdmin';
import SejarahAdmin from './pages/admin/SejarahAdmin';
import SliderAdmin from './pages/admin/SliderAdmin';
import ArtikelList from './pages/ArtikelList';
import ArtikelDetail from './pages/ArtikelDetail';
import PengumumanList from './pages/PengumumanList';
import PengumumanDetail from './pages/PengumumanDetail';
import Sejarah from './pages/Sejarah';
import Pengurus from './pages/Pengurus';
import Pastor from './pages/Pastor';
import Wilayah from './pages/Wilayah';
import Kategorial from './pages/Kategorial';
import KaryaSosial from './pages/KaryaSosial';
import Formulir from './pages/Formulir';
import Galeri from './pages/Galeri';
import PKKS from './pages/PKKS';
import Katekumen from './pages/Katekumen';
import ProfileEdit from './pages/admin/ProfileEdit';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login Route - outside Layout */}
          <Route path="/login" element={<Login />} />

          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="artikel" element={<ArtikelList />} />
            <Route path="artikel/:slug" element={<ArtikelDetail />} />
            <Route path="pengumuman" element={<PengumumanList />} />
            <Route path="pengumuman/:slug" element={<PengumumanDetail />} />
            <Route path="sejarah" element={<Sejarah />} />
            <Route path="pengurus" element={<Pengurus />} />
            <Route path="pastor" element={<Pastor />} />
            <Route path="wilayah" element={<Wilayah />} />
            <Route path="kategorial" element={<Kategorial />} />
            <Route path="karya-sosial" element={<KaryaSosial />} />
            <Route path="formulir" element={<Formulir />} />
            <Route path="galeri" element={<Galeri />} />
            <Route path="pkks" element={<PKKS />} />
            <Route path="katekumen" element={<Katekumen />} />
          </Route>

          {/* Admin Routes with AdminLayout and Sidebar */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileEdit />} />
            <Route path="slider" element={<SliderAdmin />} />
            <Route path="artikel" element={<ArtikelAdmin />} />
            <Route path="pengumuman" element={<PengumumanAdmin />} />
            <Route path="galeri" element={<GaleriAdmin />} />
            <Route path="pengurus" element={<DPSAdmin />} />
            <Route path="pastor" element={<PastorAdmin />} />
            <Route path="wilayah" element={<WilayahAdmin />} />
            <Route path="lingkungan" element={<LingkunganAdmin />} />
            <Route path="kategorial" element={<KategorialAdmin />} />
            <Route path="karya-sosial" element={<KaryaSosialAdmin />} />
            <Route path="formulir" element={<FormulirAdmin />} />
            <Route path="sejarah" element={<SejarahAdmin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
