
import express from 'express';
import database from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stock = await database.query('SELECT * FROM stock');
    const stockObj = {};
    stock.forEach(item => {
      stockObj[item.id] = item.current_stock;
    });
    res.json(stockObj);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
});

router.get('/movements', async (req, res) => {
  try {
    const movements = await database.query('SELECT * FROM stock_movements ORDER BY date DESC');
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar movimentações' });
  }
});

router.post('/movements', async (req, res) => {
  try {
    const { itemId, type, quantity, reason } = req.body;
    const id = `sm-${Date.now()}`;
    
    // Insert movement
    await database.query(
      'INSERT INTO stock_movements (id, item_id, type, quantity, reason) VALUES (?, ?, ?, ?, ?)',
      [id, itemId, type, quantity, reason]
    );
    
    // Update stock
    const currentStock = await database.query('SELECT current_stock FROM stock WHERE id = ?', [itemId]);
    const current = currentStock[0]?.current_stock || 0;
    const newStock = type === 'in' ? current + quantity : current - quantity;
    
    await database.query('UPDATE stock SET current_stock = ? WHERE id = ?', [Math.max(0, newStock), itemId]);
    
    const movements = await database.query('SELECT * FROM stock_movements WHERE id = ?', [id]);
    res.status(201).json(movements[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar movimentação' });
  }
});

export default router;
