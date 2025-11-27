import pkg from 'pg';
import dotenv from 'dotenv';
import dns from 'dns/promises';

const { Pool } = pkg;

dotenv.config();

async function buildPoolConfig(){
  const connectionString = process.env.DATABASE_URL || null;

  const sslOption = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

  if(connectionString){
    try{
      // tenta resolver host para IPv4 e substituir no connection string
      const url = new URL(connectionString);
      const hostname = url.hostname;
      try{
        const lookup = await dns.lookup(hostname, { family: 4 });
        const ipv4 = lookup.address;
        // substitui hostname por IP literal
        url.hostname = ipv4;
        // reconstrói connection string
        const conn = url.toString();
        console.log('Usando connectionString com IPv4:', ipv4);
        return { connectionString: conn, ssl: sslOption || undefined };
      }catch(err){
        console.warn('Não foi possível resolver IPv4 para', hostname, err.message);
        return { connectionString, ssl: sslOption || undefined };
      }
    }catch(err){
      console.warn('Connection string inválida, fallback para variáveis DB_*', err.message);
    }
  }

  // Sem connectionString — montar config com DB_* e tentar resolver host para IPv4
  const host = process.env.DB_HOST || 'localhost';
  let hostToUse = host;
  if(host && host !== 'localhost'){
    try{
      const lookup = await dns.lookup(host, { family: 4 });
      hostToUse = lookup.address;
      console.log('Resolved DB_HOST to IPv4:', hostToUse);
    }catch(err){
      console.warn('Falha ao resolver DB_HOST para IPv4:', host, err.message);
      hostToUse = host; // usar como está
    }
  }

  return {
    host: hostToUse,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    ssl: sslOption
  };
}

const poolConfig = await buildPoolConfig();
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
