
import express from 'express';
import database from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await database.query('SELECT * FROM finished_products ORDER BY name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, unit, minStock, maxStock } = req.body;
    const id = `fp-${Date.now()}`;
    
    await database.query(
      'INSERT INTO finished_products (id, name, unit, min_stock, max_stock) VALUES (?, ?, ?, ?, ?)',
      [id, name, unit, minStock || 0, maxStock || 0]
    );

    // Initialize stock
    await database.query('INSERT INTO stock (id, current_stock) VALUES (?, ?)', [id, 0]);
    
    res.status(201).json({ id, name, unit, min_stock: minStock, max_stock: maxStock });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, minStock, maxStock } = req.body;
    
    await database.query(
      'UPDATE finished_products SET name = ?, unit = ?, min_stock = ?, max_stock = ? WHERE id = ?',
      [name, unit, minStock || 0, maxStock || 0, id]
    );
    
    const products = await database.query('SELECT * FROM finished_products WHERE id = ?', [id]);
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await database.query('DELETE FROM stock WHERE id = ?', [id]);
    await database.query('DELETE FROM finished_products WHERE id = ?', [id]);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

export default router;
