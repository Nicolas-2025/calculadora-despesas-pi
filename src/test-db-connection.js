import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const connectionString = process.env.DATABASE_URL || null;

const clientConfig = connectionString ? { connectionString, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined } : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

(async ()=>{
  const client = new Client(clientConfig);
  try{
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log('Conectado ao Postgres:', res.rows[0].version);
  }catch(err){
    console.error('Erro ao conectar:', err.message || err);
  }finally{
    await client.end();
  }
})();
