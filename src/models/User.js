
import database from '../lib/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static async findAll() {
    return await database.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  }

  static async findById(id) {
    const users = await database.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return users[0] || null;
  }

  static async findByEmail(email) {
    const users = await database.query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0] || null;
  }

  static async create(userData) {
    const { name, email, password, role = 'operator' } = userData;
    const id = `user-${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await database.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, role]
    );
    
    return { id, name, email, role };
  }

  static async update(id, userData) {
    const { name, email, role } = userData;
    await database.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );
    return await this.findById(id);
  }

  static async delete(id) {
    await database.query('DELETE FROM users WHERE id = ?', [id]);
  }

  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }
}
