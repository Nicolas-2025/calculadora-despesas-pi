import { Router } from 'express';
import { query } from '../db.js';
import { assertNonEmpty } from '../utils/validators.js';

const router = Router();

// Middleware simples para obter userId a partir do header
router.use((req,res,next)=>{
  const userId = req.header('x-user-id');
  if(!userId){
    return res.status(401).json({ ok:false, error:'x-user-id ausente' });
  }
  req.userId = userId; next();
});

router.get('/', async (req, res)=>{
  try{
    const cats = await query('SELECT name FROM categories WHERE user_id=? ORDER BY name', [req.userId]);
    res.json(cats.map(c=>c.name));
  }catch(err){ res.status(500).json({ok:false, error:'Erro ao carregar categorias'}); }
});

router.post('/', async (req, res)=>{
  try{
    const { name } = req.body || {};
    assertNonEmpty(name, 'Informe o nome da categoria');
    try{
      await query('INSERT INTO categories (user_id, name) VALUES (?,?)', [req.userId, name]);
    }catch(e){ /* ignora duplicada */ }
    const cats = await query('SELECT name FROM categories WHERE user_id=? ORDER BY name', [req.userId]);
    res.json(cats.map(c=>c.name));
  }catch(err){
    const status = err.status || 500;
    res.status(status).json({ ok:false, error: err.message || 'Erro ao adicionar categoria' });
  }
});

export default router;