// /database.js
import mysql from 'mysql2/promise';

// 1. Deixamos a variável do pool ser declarada, mas não inicializada.
let pool;

function initializePool() {
  if (!pool) {
    console.log('🔌 Criando pool de conexões...');
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Se o próximo erro for relacionado a SSL, descomente a linha abaixo
      // ssl: { rejectUnauthorized: false }
    });
  }
}


/**
 * Testa a conexão com o banco de dados.
 * @returns {Promise<boolean>}
 */
async function testConnection() {
  initializePool(); // 2. Garante que o pool exista antes de usar
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro detalhado ao conectar:', error);
    return false;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Cria as tabelas necessárias no banco de dados se elas não existirem.
 * IMPORTANTE: Adapte os campos de cada tabela para a sua necessidade.
 */
async function initDatabase() {
  initializePool(); // 2. Garante que o pool exista antes de usar
  const connection = await pool.getConnection();
  try {
    console.log('⏳ Verificando e criando tabelas...');

    // As tabelas abaixo são exemplos baseados nas suas rotas.
    // Você DEVE ajustar as colunas (campos) para as suas necessidades.
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        quantity DECIMAL(10, 2) NOT NULL,
        unit VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

     await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT,
        totalAmount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pendente',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS stock (
        id INT AUTO_INCREMENT PRIMARY KEY,
        productId INT,
        quantity INT NOT NULL,
        lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);

    console.log('👍 Tabelas verificadas/criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar as tabelas:', error.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Executa uma query no banco de dados.
 * Esta é a função que suas rotas devem usar para interagir com o banco.
 * @param {string} sql - O comando SQL para executar.
 * @param {Array} [params] - Os parâmetros para a query.
 * @returns {Promise<[any[], any]>}
 */
async function query(sql, params) {
  initializePool(); // 2. Garante que o pool exista antes de usar
  return pool.execute(sql, params);
}

// 3. Exportamos um objeto com as funções e a função de query
export default {
  testConnection,
  initDatabase,
  query,
};