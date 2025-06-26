
import express from 'express';
import database from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const materials = await database.query('SELECT * FROM raw_materials ORDER BY name');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar materiais' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, unit, minStock, maxStock } = req.body;
    const id = `rm-${Date.now()}`;
    
    await database.query(
      'INSERT INTO raw_materials (id, name, unit, min_stock, max_stock) VALUES (?, ?, ?, ?, ?)',
      [id, name, unit, minStock || 0, maxStock || 0]
    );

    // Initialize stock
    await database.query('INSERT INTO stock (id, current_stock) VALUES (?, ?)', [id, 0]);
    
    res.status(201).json({ id, name, unit, min_stock: minStock, max_stock: maxStock });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar material' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit, minStock, maxStock } = req.body;
    
    await database.query(
      'UPDATE raw_materials SET name = ?, unit = ?, min_stock = ?, max_stock = ? WHERE id = ?',
      [name, unit, minStock || 0, maxStock || 0, id]
    );
    
    const materials = await database.query('SELECT * FROM raw_materials WHERE id = ?', [id]);
    res.json(materials[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar material' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await database.query('DELETE FROM stock WHERE id = ?', [id]);
    await database.query('DELETE FROM raw_materials WHERE id = ?', [id]);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar material' });
  }
});

export default router;
