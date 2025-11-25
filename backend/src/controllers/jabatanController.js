const Jabatan = require('../models/Jabatan');

exports.getAll = async (req, res) => {
  try {
    const data = await Jabatan.getAll();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching jabatan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Jabatan.getById(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Jabatan tidak ditemukan'
      });
    }
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching jabatan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, displayOrder } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nama jabatan tidak boleh kosong'
      });
    }

    const data = await Jabatan.create({ name: name.trim(), displayOrder });
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error creating jabatan:', error);

    // Check for duplicate entry
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Jabatan dengan nama tersebut sudah ada'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Jabatan.update(req.params.id, req.body);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error updating jabatan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    await Jabatan.delete(req.params.id);
    res.json({
      success: true,
      message: 'Jabatan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting jabatan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
