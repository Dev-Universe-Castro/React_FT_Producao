
import database from '../lib/database.js';

export class ProductionOrder {
  static async findAll() {
    return await database.query('SELECT * FROM production_orders ORDER BY created_at DESC');
  }

  static async findById(id) {
    const orders = await database.query('SELECT * FROM production_orders WHERE id = ?', [id]);
    return orders[0] || null;
  }

  static async create(orderData) {
    const { productId, quantity, status = 'Planejado' } = orderData;
    const id = `po-${Date.now()}`;
    
    await database.query(
      'INSERT INTO production_orders (id, product_id, quantity, status) VALUES (?, ?, ?, ?)',
      [id, productId, quantity, status]
    );
    
    return { id, productId, quantity, status, createdAt: new Date().toISOString() };
  }

  static async update(id, orderData) {
    const { productId, quantity, status } = orderData;
    await database.query(
      'UPDATE production_orders SET product_id = ?, quantity = ?, status = ? WHERE id = ?',
      [productId, quantity, status, id]
    );
    return await this.findById(id);
  }

  static async updateStatus(id, status) {
    await database.query('UPDATE production_orders SET status = ? WHERE id = ?', [status, id]);
    return await this.findById(id);
  }

  static async delete(id) {
    await database.query('DELETE FROM production_orders WHERE id = ?', [id]);
  }
}
