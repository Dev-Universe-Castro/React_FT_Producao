
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import materialRoutes from './routes/materials.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import stockRoutes from './routes/stock.js';
import authRoutes from './routes/auth.js';
import database from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test and initialize database
async function initializeApp() {
  console.log('🚀 Inicializando aplicação...');
  console.log('📋 Variáveis de ambiente carregadas:');
  console.log('  DB_HOST:', process.env.DB_HOST);
  console.log('  DB_USER:', process.env.DB_USER);
  console.log('  DB_NAME:', process.env.DB_NAME);
  console.log('  DB_PASSWORD definida:', !!process.env.DB_PASSWORD);
  
  
  const isConnected = await database.testConnection();
  
  if (isConnected) {
    console.log('📦 Inicializando tabelas do banco...');
    await database.initDatabase();
    console.log('✅ Banco de dados inicializado com sucesso!');
  } else {
    console.error('❌ Falha ao conectar com banco. Verifique as credenciais.');
    console.error('💡 Dica: Verifique se o servidor MySQL está acessível em:', process.env.DB_HOST);
  }
}

initializeApp().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stock', stockRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
