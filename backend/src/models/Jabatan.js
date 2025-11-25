const { sequelize } = require('../config/database');

class Jabatan {
  static tableName = 'jabatans';

  static async getAll() {
    const rows = await sequelize.query(
      `SELECT id, name, display_order as displayOrder,
        created_at as createdAt, updated_at as updatedAt
       FROM ${this.tableName}
       ORDER BY display_order ASC, name ASC`,
      { type: sequelize.QueryTypes.SELECT }
    );
    return rows;
  }

  static async getById(id) {
    const [rows] = await sequelize.query(
      `SELECT id, name, display_order as displayOrder,
        created_at as createdAt, updated_at as updatedAt
       FROM ${this.tableName}
       WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT
      }
    );
    return rows[0];
  }

  static async create(data) {
    const { name, displayOrder = 0 } = data;
    const [result] = await sequelize.query(
      `INSERT INTO ${this.tableName} (name, display_order) VALUES (:name, :displayOrder)`,
      {
        replacements: { name, displayOrder },
        type: sequelize.QueryTypes.INSERT
      }
    );
    return this.getById(result);
  }

  static async update(id, data) {
    const { name, displayOrder } = data;
    await sequelize.query(
      `UPDATE ${this.tableName} SET name = :name, display_order = :displayOrder WHERE id = :id`,
      {
        replacements: { name, displayOrder, id },
        type: sequelize.QueryTypes.UPDATE
      }
    );
    return this.getById(id);
  }

  static async delete(id) {
    await sequelize.query(
      `DELETE FROM ${this.tableName} WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.DELETE
      }
    );
    return { success: true };
  }
}

module.exports = Jabatan;
