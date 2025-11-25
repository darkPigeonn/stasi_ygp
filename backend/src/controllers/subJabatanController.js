const SubJabatan = require('../models/SubJabatan');

exports.getAll = async (req, res) => {
  try {
    const data = await SubJabatan.getAll();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching sub jabatan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await SubJabatan.getById(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Sub Jabatan tidak ditemukan'
      });
    }
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching sub jabatan:', error);
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
        message: 'Nama sub jabatan tidak boleh kosong'
      });
    }

    const data = await SubJabatan.create({ name: name.trim(), displayOrder });
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error creating sub jabatan:', error);

    // Check for duplicate entry
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Sub jabatan dengan nama tersebut sudah ada'
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
    const data = await SubJabatan.update(req.params.id, req.body);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error updating sub jabatan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    await SubJabatan.delete(req.params.id);
    res.json({
      success: true,
      message: 'Sub Jabatan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting sub jabatan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
