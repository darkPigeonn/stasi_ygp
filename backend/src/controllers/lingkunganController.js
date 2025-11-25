const { Lingkungan } = require('../models');

// @desc    Get lingkungan by wilayah ID
// @route   GET /api/lingkungan/wilayah/:wilayahId
// @access  Public
const getByWilayah = async (req, res, next) => {
  try {
    const lingkungans = await Lingkungan.findAll({
      where: { wilayahId: req.params.wilayahId },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: lingkungans.length,
      data: lingkungans
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getByWilayah
};
