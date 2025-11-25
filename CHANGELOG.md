# Changelog

## [2024-11-22] - Perbaikan Dropdown Menu

### Fixed
- ✅ **Dropdown menu sekarang otomatis tertutup** setelah:
  - Klik item submenu
  - Hover off (mouse keluar dari dropdown) di desktop
  - Klik di luar area dropdown
  - Navigasi ke halaman lain

### Technical Changes

#### Header.jsx
- Menambahkan `useLocation` hook untuk detect route changes
- Menambahkan `useRef` untuk dropdown reference
- Menambahkan `useEffect` untuk close dropdown saat route berubah
- Menambahkan `useEffect` untuk close dropdown saat click outside
- Menambahkan `handleMouseEnter` function untuk hover behavior di desktop
- Menambahkan `handleMouseLeave` function untuk close saat hover off
- Menambahkan `closeDropdown` function untuk close manual
- Menambahkan `onClick={closeDropdown}` pada semua dropdown items

#### Header.css
- Menghapus `:hover` selector yang menyebabkan konflik
- Hanya menggunakan class `.show` untuk kontrol dropdown visibility
- Menambahkan `z-index: 1000` untuk memastikan dropdown tampil di atas elemen lain

### Behavior

**Desktop (>768px):**
- Hover pada menu dropdown → dropdown terbuka
- Mouse keluar dari dropdown → dropdown tertutup otomatis
- Klik item submenu → dropdown tertutup dan navigasi ke halaman

**Mobile (<=768px):**
- Klik toggle button untuk membuka dropdown
- Klik item submenu → dropdown tertutup dan navigasi ke halaman
- Klik toggle button lagi untuk menutup

**Semua Device:**
- Klik di luar dropdown → dropdown tertutup
- Navigasi ke halaman lain → dropdown tertutup otomatis

## [2024-11-22] - Initial Release

### Added
- ✅ Frontend prototype dengan React + Vite
- ✅ Routing dengan React Router
- ✅ Responsive design untuk semua device
- ✅ 10+ halaman lengkap
- ✅ Komponen reusable (Header, Footer, Layout)
- ✅ Styling dengan CSS3
- ✅ Icons dengan Lucide React
