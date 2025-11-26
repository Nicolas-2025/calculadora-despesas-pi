import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

dotenv.config();

// Prefer DATABASE_URL (connection string) if fornecida
const connectionString = process.env.DATABASE_URL || null;

const poolConfig = connectionString ? {
  connectionString,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
} : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Erro na pool de conexões:', err.message || err);
});

// Testa a conexão no startup para logs mais claros
(async function testConnection(){
  try{
    const res = await pool.query('SELECT 1');
    console.log('Conexão com o banco OK');
  }catch(err){
    console.error('Falha ao conectar no banco de dados:', err.message || err);
  }
})();

export default pool;
