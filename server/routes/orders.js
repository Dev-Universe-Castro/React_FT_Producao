
import express from 'express';
import database from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await database.query('SELECT * FROM production_orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ordens' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity, status = 'Planejado' } = req.body;
    const id = `po-${Date.now()}`;
    
    await database.query(
      'INSERT INTO production_orders (id, product_id, quantity, status) VALUES (?, ?, ?, ?)',
      [id, productId, quantity, status]
    );
    
    const orders = await database.query('SELECT * FROM production_orders WHERE id = ?', [id]);
    res.status(201).json(orders[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar ordem' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity, status } = req.body;
    
    await database.query(
      'UPDATE production_orders SET product_id = ?, quantity = ?, status = ? WHERE id = ?',
      [productId, quantity, status, id]
    );
    
    const orders = await database.query('SELECT * FROM production_orders WHERE id = ?', [id]);
    res.json(orders[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar ordem' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await database.query('DELETE FROM production_orders WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar ordem' });
  }
});

export default router;
