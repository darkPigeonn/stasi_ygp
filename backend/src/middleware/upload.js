const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/images';

    if (file.fieldname === 'document' || file.mimetype.includes('pdf') || file.mimetype.includes('document')) {
      uploadPath = 'uploads/documents';
    }

    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed image formats
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  // Allowed document formats
  const allowedDocTypes = /pdf|doc|docx|xls|xlsx/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (file.fieldname === 'document') {
    if (allowedDocTypes.test(extname.slice(1)) || mimetype.includes('pdf') || mimetype.includes('document')) {
      cb(null, true);
    } else {
      cb(new Error('Only document files (PDF, DOC, DOCX, XLS, XLSX) are allowed!'), false);
    }
  } else {
    if (allowedImageTypes.test(extname.slice(1)) && mimetype.includes('image')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed!'), false);
    }
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 5242880 // 5MB default
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

module.exports = { upload, handleMulterError };
