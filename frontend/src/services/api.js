// API Configuration and Client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

// Generic fetch wrapper with error handling
async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Artikel API
export const artikelAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/artikel${query ? `?${query}` : ''}`);
  },
  getById: async (id) => {
    return apiFetch(`/artikel/${id}`);
  },
  getBySlug: async (slug) => {
    return apiFetch(`/artikel/slug/${slug}`);
  },
  create: async (formData) => {
    const url = `${API_URL}/artikel`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/artikel/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/artikel/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Pengumuman API
export const pengumumanAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/pengumuman${query ? `?${query}` : ''}`);
  },
  getById: async (id) => {
    return apiFetch(`/pengumuman/${id}`);
  },
  getBySlug: async (slug) => {
    return apiFetch(`/pengumuman/slug/${slug}`);
  },
  getPriority: async () => {
    return apiFetch('/pengumuman/priority');
  },
  create: async (formData) => {
    const url = `${API_URL}/pengumuman`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/pengumuman/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/pengumuman/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Galeri API
export const galeriAPI = {
  getAll: async () => {
    return apiFetch('/galeri');
  },
  getById: async (id) => {
    return apiFetch(`/galeri/${id}`);
  },
  create: async (formData) => {
    const url = `${API_URL}/galeri`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/galeri/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/galeri/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// DPS/BGKS API
export const dpsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/dps${query ? `?${query}` : ''}`);
  },
  getByType: async (type) => {
    return apiFetch(`/dps/type/${type}`);
  },
  getById: async (id) => {
    return apiFetch(`/dps/${id}`);
  },
  create: async (formData) => {
    const url = `${API_URL}/dps`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/dps/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/dps/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Pastor API
export const pastorAPI = {
  getAll: async () => {
    return apiFetch('/pastor');
  },
  getById: async (id) => {
    return apiFetch(`/pastor/${id}`);
  },
  getCurrent: async () => {
    return apiFetch('/pastor/current');
  },
  getPast: async () => {
    return apiFetch('/pastor/past');
  },
  create: async (formData) => {
    const url = `${API_URL}/pastor`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/pastor/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/pastor/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Wilayah API
export const wilayahAPI = {
  getAll: async () => {
    return apiFetch('/wilayah');
  },
  getById: async (id) => {
    return apiFetch(`/wilayah/${id}`);
  },
  getWithLingkungan: async (id) => {
    return apiFetch(`/wilayah/${id}/lingkungan`);
  },
  create: async (formData) => {
    const url = `${API_URL}/wilayah`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/wilayah/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/wilayah/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Lingkungan API
export const lingkunganAPI = {
  getAll: async () => {
    return apiFetch('/lingkungan');
  },
  getById: async (id) => {
    return apiFetch(`/lingkungan/${id}`);
  },
  getByWilayah: async (wilayahId) => {
    return apiFetch(`/lingkungan/wilayah/${wilayahId}`);
  },
  create: async (data) => {
    const url = `${API_URL}/lingkungan`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    const url = `${API_URL}/lingkungan/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/lingkungan/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Kategorial API
export const kategorialAPI = {
  getAll: async () => {
    return apiFetch('/kategorial');
  },
  getById: async (id) => {
    return apiFetch(`/kategorial/${id}`);
  },
  create: async (formData) => {
    const url = `${API_URL}/kategorial`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/kategorial/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/kategorial/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Kategori Formulir API
export const kategoriFormulirAPI = {
  getAll: async () => {
    return apiFetch('/kategori-formulir');
  },
  getById: async (id) => {
    return apiFetch(`/kategori-formulir/${id}`);
  },
  create: async (data) => {
    const url = `${API_URL}/kategori-formulir`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    const url = `${API_URL}/kategori-formulir/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/kategori-formulir/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Formulir API
export const formulirAPI = {
  getAll: async () => {
    return apiFetch('/formulir');
  },
  getByCategory: async (kategoriFormulirId) => {
    return apiFetch(`/formulir/kategori/${kategoriFormulirId}`);
  },
  getById: async (id) => {
    return apiFetch(`/formulir/${id}`);
  },
  create: async (formData) => {
    const url = `${API_URL}/formulir`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/formulir/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/formulir/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Sejarah API
export const sejarahAPI = {
  getAll: async () => {
    return apiFetch('/sejarah');
  },
  getByYear: async (year) => {
    return apiFetch(`/sejarah/year/${year}`);
  },
  create: async (data) => {
    const url = `${API_URL}/sejarah`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    const url = `${API_URL}/sejarah/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/sejarah/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    const response = await apiFetch('/profile');
    // Profile returns an array, get the first item
    const profile = Array.isArray(response.data) && response.data.length > 0
      ? response.data[0]
      : null;

    // Parse double-encoded JSON strings from database
    if (profile) {
      // Parse massSchedule (double-encoded in database)
      if (profile.massSchedule && typeof profile.massSchedule === 'string') {
        try {
          // First parse removes outer quotes
          let parsed = JSON.parse(profile.massSchedule);
          // Second parse converts to actual array/object
          if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
          }
          profile.massSchedule = parsed;
        } catch (e) {
          console.error('Error parsing massSchedule:', e);
          profile.massSchedule = null;
        }
      }

      // Parse socialMedia (double-encoded in database)
      if (profile.socialMedia && typeof profile.socialMedia === 'string') {
        try {
          // First parse removes outer quotes
          let parsed = JSON.parse(profile.socialMedia);
          // Second parse converts to actual object
          if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
          }
          profile.socialMedia = parsed;
        } catch (e) {
          console.error('Error parsing socialMedia:', e);
          profile.socialMedia = null;
        }
      }
    }

    return { ...response, data: profile };
  },

  update: async (id, formData) => {
    const url = `${API_URL}/profile/${id}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData, // FormData for file upload
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Karya Sosial API
export const karyaSosialAPI = {
  getAll: async () => {
    return apiFetch('/karya-sosial');
  },
  getById: async (id) => {
    return apiFetch(`/karya-sosial/${id}`);
  },
  create: async (formData) => {
    const url = `${API_URL}/karya-sosial`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  update: async (id, formData) => {
    const url = `${API_URL}/karya-sosial/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/karya-sosial/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Intensi Misa API
export const intensiMisaAPI = {
  get: async () => {
    return apiFetch('/intensi-misa');
  },
};

// Jabatan API
export const jabatanAPI = {
  getAll: async () => {
    return apiFetch('/jabatan');
  },
  getById: async (id) => {
    return apiFetch(`/jabatan/${id}`);
  },
  create: async (data) => {
    const url = `${API_URL}/jabatan`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/jabatan/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Sub Jabatan API
export const subJabatanAPI = {
  getAll: async () => {
    return apiFetch('/sub-jabatan');
  },
  getById: async (id) => {
    return apiFetch(`/sub-jabatan/${id}`);
  },
  create: async (data) => {
    const url = `${API_URL}/sub-jabatan`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  delete: async (id) => {
    const url = `${API_URL}/sub-jabatan/${id}`;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// Liturgical Calendar API (via backend proxy to avoid CORS)
export const liturgicalCalendarAPI = {
  getByDate: async (date) => {
    return apiFetch(`/liturgy/date/${date}`);
  },

  getToday: async () => {
    return apiFetch('/liturgy/today');
  }
};

// Slider API
export const sliderAPI = {
  getAll: async () => {
    return apiFetch('/slider');
  },

  getActive: async () => {
    // Get only active sliders, limited to 5, ordered by display_order
    const response = await apiFetch('/slider?limit=5');
    return {
      ...response,
      data: response.data?.filter(slider => slider.isActive).slice(0, 5) || []
    };
  },

  create: async (data) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/slider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data, // FormData
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/slider/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data, // FormData
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const token = localStorage.getItem('token');
    const url = `${BASE_URL}/slider/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

// User API
export const userAPI = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/users`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/users/${id}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  create: async (data) => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/users`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/users/${id}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/users/${id}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  changePassword: async (id, data) => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/users/${id}/change-password`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};

export default {
  artikel: artikelAPI,
  pengumuman: pengumumanAPI,
  galeri: galeriAPI,
  dps: dpsAPI,
  pastor: pastorAPI,
  wilayah: wilayahAPI,
  lingkungan: lingkunganAPI,
  kategorial: kategorialAPI,
  kategoriFormulir: kategoriFormulirAPI,
  formulir: formulirAPI,
  sejarah: sejarahAPI,
  profile: profileAPI,
  karyaSosial: karyaSosialAPI,
  intensiMisa: intensiMisaAPI,
  jabatan: jabatanAPI,
  subJabatan: subJabatanAPI,
  slider: sliderAPI,
  liturgicalCalendar: liturgicalCalendarAPI,
  user: userAPI,
};
