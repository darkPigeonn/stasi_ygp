const { generateUniqueSlug } = require('../utils/slugify');

// Generic CRUD controller factory
const createCRUDController = (Model, modelName = 'Resource') => {
  // @desc    Get all resources
  const getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (search && Model.rawAttributes.title) {
        where.title = { [require('sequelize').Op.like]: `%${search}%` };
      }

      // Determine order field - use 'id' if createdAt doesn't exist
      let orderField = 'id';
      let orderDirection = 'DESC';

      // Check if model has order field (for manual sorting like Sejarah)
      if (Model.rawAttributes.order) {
        orderField = 'order';
        orderDirection = 'ASC';
      }
      // Check if model has timestamps
      else if (Model.options && Model.options.timestamps) {
        const createdAtField = Model.options.createdAt || 'createdAt';
        orderField = createdAtField;
      }

      const { count, rows } = await Model.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[orderField, orderDirection]]
      });

      res.status(200).json({
        success: true,
        count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        data: rows
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get single resource
  const getOne = async (req, res, next) => {
    try {
      const resource = await Model.findByPk(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${modelName} not found`
        });
      }

      // Increment views if field exists
      if (resource.views !== undefined) {
        await resource.increment('views');
      }

      res.status(200).json({
        success: true,
        data: resource
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Get by slug
  const getBySlug = async (req, res, next) => {
    try {
      const resource = await Model.findOne({ where: { slug: req.params.slug } });

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${modelName} not found`
        });
      }

      // Increment views if field exists
      if (resource.views !== undefined) {
        await resource.increment('views');
      }

      res.status(200).json({
        success: true,
        data: resource
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Create resource
  const create = async (req, res, next) => {
    try {
      // Generate slug if title exists
      if (req.body.title && Model.rawAttributes.slug) {
        req.body.slug = await generateUniqueSlug(Model, req.body.title);
      }

      // Handle file uploads
      if (req.files && req.files.length > 0) {
        req.body.images = req.files.map(file => {
          const normalizedPath = file.path.replace(/\\/g, '/');
          return `/${normalizedPath}`;
        });
      } else if (req.file) {
        const normalizedPath = req.file.path.replace(/\\/g, '/');
        req.body[req.file.fieldname] = `/${normalizedPath}`;
      }

      const resource = await Model.create(req.body);

      res.status(201).json({
        success: true,
        data: resource
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: error.errors.map(e => e.message).join(', ')
        });
      }
      next(error);
    }
  };

  // @desc    Update resource
  const update = async (req, res, next) => {
    try {
      let resource = await Model.findByPk(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${modelName} not found`
        });
      }

      // Generate new slug if title changed
      if (req.body.title && req.body.title !== resource.title && Model.rawAttributes.slug) {
        req.body.slug = await generateUniqueSlug(Model, req.body.title);
      }

      // Handle file uploads
      if (req.files && req.files.length > 0) {
        req.body.images = req.files.map(file => {
          const normalizedPath = file.path.replace(/\\/g, '/');
          return `/${normalizedPath}`;
        });
      } else if (req.file) {
        const normalizedPath = req.file.path.replace(/\\/g, '/');
        req.body[req.file.fieldname] = `/${normalizedPath}`;
      }

      resource = await resource.update(req.body);

      res.status(200).json({
        success: true,
        data: resource
      });
    } catch (error) {
      next(error);
    }
  };

  // @desc    Delete resource
  const deleteOne = async (req, res, next) => {
    try {
      const resource = await Model.findByPk(req.params.id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: `${modelName} not found`
        });
      }

      await resource.destroy();

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    getAll,
    getOne,
    getBySlug,
    create,
    update,
    deleteOne
  };
};

module.exports = createCRUDController;
