
import database from '../lib/database.js';

export class Stock {
  static async getAll() {
    const stocks = await database.query('SELECT * FROM stock');
    const stockObj = {};
    stocks.forEach(item => {
      stockObj[item.id] = parseFloat(item.current_stock);
    });
    return stockObj;
  }

  static async getById(id) {
    const stocks = await database.query('SELECT current_stock FROM stock WHERE id = ?', [id]);
    return stocks.length > 0 ? parseFloat(stocks[0].current_stock) : 0;
  }

  static async updateStock(id, quantity) {
    await database.query(
      'INSERT INTO stock (id, current_stock) VALUES (?, ?) ON DUPLICATE KEY UPDATE current_stock = ?',
      [id, quantity, quantity]
    );
  }

  static async addMovement(movementData) {
    const { itemId, type, quantity, reason } = movementData;
    const id = `sm-${Date.now()}`;
    
    await database.query(
      'INSERT INTO stock_movements (id, item_id, type, quantity, reason) VALUES (?, ?, ?, ?, ?)',
      [id, itemId, type, quantity, reason]
    );

    // Update current stock
    const currentStock = await this.getById(itemId);
    const newStock = type === 'in' ? currentStock + quantity : currentStock - quantity;
    await this.updateStock(itemId, Math.max(0, newStock));

    return { id, itemId, type, quantity, reason, date: new Date().toISOString() };
  }

  static async getMovements() {
    return await database.query('SELECT * FROM stock_movements ORDER BY date DESC');
  }
}
