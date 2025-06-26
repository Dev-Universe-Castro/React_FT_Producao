
import express from 'express';
import bcrypt from 'bcryptjs';
import database from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await database.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password, role = 'operator' } = req.body;
    const id = `user-${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await database.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, role]
    );
    
    res.status(201).json({ id, name, email, role });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    await database.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );
    
    const users = await database.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await database.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

export default router;
