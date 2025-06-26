
import mysql from 'mysql2/promise';

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'indumanager',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async query(sql, params = []) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async initDatabase() {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'operator') DEFAULT 'operator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS raw_materials (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        unit VARCHAR(10) NOT NULL,
        min_stock INT DEFAULT 0,
        max_stock INT DEFAULT 0
      )`,
      
      `CREATE TABLE IF NOT EXISTS finished_products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        unit VARCHAR(10) NOT NULL,
        min_stock INT DEFAULT 0,
        max_stock INT DEFAULT 0
      )`,
      
      `CREATE TABLE IF NOT EXISTS product_bom (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(50),
        material_id VARCHAR(50),
        quantity DECIMAL(10,2),
        FOREIGN KEY (product_id) REFERENCES finished_products(id) ON DELETE CASCADE,
        FOREIGN KEY (material_id) REFERENCES raw_materials(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS production_orders (
        id VARCHAR(50) PRIMARY KEY,
        product_id VARCHAR(50),
        quantity INT NOT NULL,
        status ENUM('Planejado', 'Em andamento', 'Concluído', 'Cancelado') DEFAULT 'Planejado',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES finished_products(id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS stock (
        id VARCHAR(50) PRIMARY KEY,
        current_stock DECIMAL(10,2) DEFAULT 0
      )`,
      
      `CREATE TABLE IF NOT EXISTS stock_movements (
        id VARCHAR(50) PRIMARY KEY,
        item_id VARCHAR(50),
        type ENUM('in', 'out') NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reason VARCHAR(255)
      )`
    ];

    for (const query of queries) {
      await this.query(query);
    }

    // Insert default admin user if not exists
    const adminExists = await this.query('SELECT id FROM users WHERE email = ?', ['admin@indumanager.com']);
    if (adminExists.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin', 10);
      await this.query(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        ['user-1', 'Admin', 'admin@indumanager.com', hashedPassword, 'admin']
      );
    }
  }

  async close() {
    await this.pool.end();
  }
}

export default new Database();
