import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { query, getConnection } from '../db.js';
import { assertNonEmpty } from '../utils/validators.js';

const router = Router();
const DEFAULT_CATS = ['Alimentação','Transporte','Moradia','Lazer','Saúde','Educação','Outros'];

router.post('/register', async (req, res)=>{
  try{
    const { name, password } = req.body || {};
    assertNonEmpty(name, 'Informe o nome');
    assertNonEmpty(password, 'Informe a senha');

    const id = uuidv4();
    const hash = await bcrypt.hash(String(password), 10);

    const conn = await getConnection();
    try{
      await conn.beginTransaction();
      await conn.execute('INSERT INTO users (id,name,password_hash) VALUES (?,?,?)', [id, name, hash]);
      // categorias padrão
      for(const c of DEFAULT_CATS){
        await conn.execute('INSERT INTO categories (user_id, name) VALUES (?,?)', [id, c]);
      }
      await conn.commit();
    }catch(err){
      await conn.rollback();
      if(err && err.code === 'ER_DUP_ENTRY'){
        const e = new Error('Nome já cadastrado'); e.status=409; throw e;
      }
      throw err;
    }finally{ conn.release(); }

    res.json({ ok:true, user:{ id, name } });
  }catch(err){
    const status = err.status || 500;
    res.status(status).json({ ok:false, error: err.message || 'Erro interno'});
  }
});

router.post('/login', async (req, res)=>{
  try{
    const { name, password } = req.body || {};
    assertNonEmpty(name, 'Informe o nome');
    assertNonEmpty(password, 'Informe a senha');

    const rows = await query('SELECT id, name, password_hash FROM users WHERE LOWER(name)=LOWER(?) LIMIT 1', [name]);
    if(rows.length===0) return res.status(401).json({ ok:false, error:'Credenciais inválidas' });

    const u = rows[0];
    const ok = await bcrypt.compare(String(password), u.password_hash);
    if(!ok) return res.status(401).json({ ok:false, error:'Credenciais inválidas' });

    res.json({ ok:true, user:{ id: u.id, name: u.name } });
  }catch(err){
    const status = err.status || 500;
    res.status(status).json({ ok:false, error: err.message || 'Erro interno'});
  }
});

export default router;