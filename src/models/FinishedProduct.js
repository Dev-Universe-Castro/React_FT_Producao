
import database from '../lib/database.js';

export class FinishedProduct {
  static async findAll() {
    const products = await database.query('SELECT * FROM finished_products ORDER BY name');
    
    // Get BOM for each product
    for (const product of products) {
      const bom = await database.query(
        'SELECT material_id as materialId, quantity FROM product_bom WHERE product_id = ?',
        [product.id]
      );
      product.bom = bom;
    }
    
    return products;
  }

  static async findById(id) {
    const products = await database.query('SELECT * FROM finished_products WHERE id = ?', [id]);
    if (products.length === 0) return null;
    
    const product = products[0];
    const bom = await database.query(
      'SELECT material_id as materialId, quantity FROM product_bom WHERE product_id = ?',
      [id]
    );
    product.bom = bom;
    
    return product;
  }

  static async create(productData) {
    const { name, unit, minStock, maxStock, bom = [] } = productData;
    const id = `fp-${Date.now()}`;
    
    await database.query(
      'INSERT INTO finished_products (id, name, unit, min_stock, max_stock) VALUES (?, ?, ?, ?, ?)',
      [id, name, unit, minStock, maxStock]
    );

    // Insert BOM items
    for (const bomItem of bom) {
      await database.query(
        'INSERT INTO product_bom (product_id, material_id, quantity) VALUES (?, ?, ?)',
        [id, bomItem.materialId, bomItem.quantity]
      );
    }

    // Initialize stock
    await database.query('INSERT INTO stock (id, current_stock) VALUES (?, ?)', [id, 0]);
    
    return { id, name, unit, minStock, maxStock, bom };
  }

  static async update(id, productData) {
    const { name, unit, minStock, maxStock, bom = [] } = productData;
    
    await database.query(
      'UPDATE finished_products SET name = ?, unit = ?, min_stock = ?, max_stock = ? WHERE id = ?',
      [name, unit, minStock, maxStock, id]
    );

    // Update BOM
    await database.query('DELETE FROM product_bom WHERE product_id = ?', [id]);
    for (const bomItem of bom) {
      await database.query(
        'INSERT INTO product_bom (product_id, material_id, quantity) VALUES (?, ?, ?)',
        [id, bomItem.materialId, bomItem.quantity]
      );
    }
    
    return await this.findById(id);
  }

  static async delete(id) {
    await database.query('DELETE FROM product_bom WHERE product_id = ?', [id]);
    await database.query('DELETE FROM stock WHERE id = ?', [id]);
    await database.query('DELETE FROM finished_products WHERE id = ?', [id]);
  }
}
