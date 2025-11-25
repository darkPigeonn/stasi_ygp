const { Formulir, KategoriFormulir } = require('../models');

// Get all formulirs with kategori
exports.getAll = async (req, res, next) => {
  try {
    const { limit, isActive, status } = req.query;

    // Build query options
    const queryOptions = {
      include: [{
        model: KategoriFormulir,
        as: 'kategoriFormulir',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    };

    // Build where clause
    const whereClause = {};

    // Add isActive filter if specified
    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true' || isActive === true;
    }

    // Add status filter if specified
    if (status) {
      whereClause.status = status;
    }

    // Apply where clause if there are filters
    if (Object.keys(whereClause).length > 0) {
      queryOptions.where = whereClause;
    }

    // Add limit if specified
    if (limit) {
      queryOptions.limit = parseInt(limit);
    }

    const formulirs = await Formulir.findAll(queryOptions);

    res.status(200).json({
      success: true,
      data: formulirs
    });
  } catch (error) {
    next(error);
  }
};

// Get formulirs by kategori
exports.getByCategory = async (req, res, next) => {
  try {
    const { kategoriFormulirId } = req.params;

    const formulirs = await Formulir.findAll({
      where: { kategoriFormulirId, isActive: true },
      include: [{
        model: KategoriFormulir,
        as: 'kategoriFormulir',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: formulirs
    });
  } catch (error) {
    next(error);
  }
};
