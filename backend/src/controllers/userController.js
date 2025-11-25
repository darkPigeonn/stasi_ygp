const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Create new user
exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password, role, isActive } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, dan password harus diisi'
      });
    }

    // Validate role
    if (role && !['admin', 'konten'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role harus admin atau konten'
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username
          ? 'Username sudah digunakan'
          : 'Email sudah digunakan'
      });
    }

    // Create user (password akan di-hash otomatis oleh hook beforeCreate)
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'konten',
      isActive: isActive !== undefined ? isActive : true
    });

    // Return user without password
    const userData = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, isActive } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Validate role if provided
    if (role && !['admin', 'konten'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role harus admin atau konten'
      });
    }

    // Check if username or email is being changed and already exists
    if (username || email) {
      const whereClause = {
        id: { [require('sequelize').Op.ne]: id }
      };

      if (username && email) {
        whereClause[require('sequelize').Op.or] = [
          { username },
          { email }
        ];
      } else if (username) {
        whereClause.username = username;
      } else if (email) {
        whereClause.email = email;
      }

      const existingUser = await User.findOne({ where: whereClause });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.username === username
            ? 'Username sudah digunakan'
            : 'Email sudah digunakan'
        });
      }
    }

    // Update user fields
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // Will be hashed by beforeUpdate hook
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    await user.update(updateData);

    // Return updated user without password
    const userData = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'User berhasil diupdate',
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Prevent deleting your own account
    if (req.user && req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus akun sendiri'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan password baru harus diisi'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password lama tidak sesuai'
      });
    }

    // Update password (will be hashed by beforeUpdate hook)
    await user.update({ password: newPassword });

    res.status(200).json({
      success: true,
      message: 'Password berhasil diubah'
    });
  } catch (error) {
    next(error);
  }
};
