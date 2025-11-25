// Generate placeholder image as data URL
export const getPlaceholderImage = (width = 800, height = 600, text = 'Gambar Tidak Tersedia') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial, sans-serif"
        font-size="24"
        fill="#9ca3af"
        text-anchor="middle"
        dominant-baseline="middle"
      >${text}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Get full image URL from backend path
export const getImageUrl = (path) => {
  if (!path) return getPlaceholderImage();

  // If already full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // If starts with /uploads, construct full backend URL
  if (path.startsWith('/uploads')) {
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${path}`;
  }

  // Otherwise, return placeholder
  return getPlaceholderImage();
};

// Handle image error event
export const handleImageError = (e, fallbackText = 'Gambar Tidak Tersedia') => {
  e.target.src = getPlaceholderImage(800, 600, fallbackText);
  e.target.onerror = null; // Prevent infinite loop
};
