
import database from '../lib/database.js';

export class RawMaterial {
  static async findAll() {
    return await database.query('SELECT * FROM raw_materials ORDER BY name');
  }

  static async findById(id) {
    const materials = await database.query('SELECT * FROM raw_materials WHERE id = ?', [id]);
    return materials[0] || null;
  }

  static async create(materialData) {
    const { name, unit, minStock, maxStock } = materialData;
    const id = `rm-${Date.now()}`;
    
    await database.query(
      'INSERT INTO raw_materials (id, name, unit, min_stock, max_stock) VALUES (?, ?, ?, ?, ?)',
      [id, name, unit, minStock, maxStock]
    );

    // Initialize stock
    await database.query('INSERT INTO stock (id, current_stock) VALUES (?, ?)', [id, 0]);
    
    return { id, name, unit, minStock, maxStock };
  }

  static async update(id, materialData) {
    const { name, unit, minStock, maxStock } = materialData;
    await database.query(
      'UPDATE raw_materials SET name = ?, unit = ?, min_stock = ?, max_stock = ? WHERE id = ?',
      [name, unit, minStock, maxStock, id]
    );
    return await this.findById(id);
  }

  static async delete(id) {
    await database.query('DELETE FROM stock WHERE id = ?', [id]);
    await database.query('DELETE FROM raw_materials WHERE id = ?', [id]);
  }
}
