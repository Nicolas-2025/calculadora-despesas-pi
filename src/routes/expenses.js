import { Router } from 'express';
import { query } from '../db.js';
import { assertNonEmpty } from '../utils/validators.js';

const router = Router();

router.use((req,res,next)=>{
  const userId = req.header('x-user-id');
  if(!userId){
    return res.status(401).json({ ok:false, error:'x-user-id ausente' });
  }
  req.userId = userId; next();
});

router.get('/', async (req, res)=>{
  try{
    const { from, to, category } = req.query;
    const params = [req.userId];
    let where = 'e.user_id = ?';
    if(from){ where += ' AND e.date >= ?'; params.push(from); }
    if(to){ where += ' AND e.date <= ?'; params.push(to); }
    if(category && category !== '__all__'){
      where += ' AND c.name = ?'; params.push(category);
    }
    const rows = await query(
      `SELECT e.id, e.date, e.description, e.value, COALESCE(c.name,'Outros') AS category
       FROM expenses e
       LEFT JOIN categories c ON c.id = e.category_id
       WHERE ${where}
       ORDER BY e.date DESC, e.id DESC`, params);
    res.json(rows.map(r=>({ id:r.id, date:r.date, description:r.description, value:Number(r.value), category:r.category })));
  }catch(err){ res.status(500).json({ ok:false, error:'Erro ao buscar despesas'}); }
});

router.post('/', async (req, res)=>{
  try{
    let { date, description, category, value } = req.body || {};
    assertNonEmpty(date, 'Informe a data');
    assertNonEmpty(description, 'Informe a descrição');
    assertNonEmpty(category, 'Informe a categoria');
    value = Number(value);
    if(!(value>0)){ const e=new Error('Valor inválido'); e.status=400; throw e; }

    // Garante que a categoria exista (cria se necessário)
    let rows = await query('SELECT id FROM categories WHERE user_id=? AND name=? LIMIT 1', [req.userId, category]);
    let categoryId = rows[0]?.id || null;
    if(!categoryId){
      const r = await query('INSERT INTO categories (user_id, name) VALUES (?,?)', [req.userId, category]);
      categoryId = r.insertId;
    }
    const ins = await query('INSERT INTO expenses (user_id, category_id, date, description, value) VALUES (?,?,?,?,?)', [req.userId, categoryId, date, description, value]);
    const id = ins.insertId;
    res.json({ id, date, description, category, value });
  }catch(err){
    const status = err.status || 500;
    res.status(status).json({ ok:false, error: err.message || 'Erro ao salvar despesa' });
  }
});

router.delete('/:id', async (req,res)=>{
  try{
    const id = Number(req.params.id);
    await query('DELETE FROM expenses WHERE id=? AND user_id=?', [id, req.userId]);
    res.json({ ok:true });
  }catch(err){ res.status(500).json({ ok:false, error:'Erro ao remover despesa' }); }
});

export default router;