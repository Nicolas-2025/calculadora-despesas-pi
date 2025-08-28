import express from 'express';
import db from '../db.js';

const router = express.Router();

// Lista despesas do usuário
router.get('/', async (req, res) => {
  try {
    const { userId, from, to, category } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

    let sql = `SELECT e.id, e.date, e.description, e.value, c.name as category
               FROM expenses e
               LEFT JOIN categories c ON e.category_id = c.id
               WHERE e.user_id = ?`;
    const params = [userId];

    if (from && from !== 'null') {
  sql += ' AND e.date >= ?';
  params.push(from);
}

if (to && to !== 'null') {
  sql += ' AND e.date <= ?';
  params.push(to);
}

    if (category && category !== '__all__') {
      sql += ' AND c.name = ?';
      params.push(category);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar despesas' });
  }
});

// Adiciona despesa
router.post('/', async (req, res) => {
  try {
    const { userId, date, description, category, value } = req.body;
    if (!userId || !date || !description || !value) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    // Descobrir id da categoria pelo nome
    let categoryId = null;
    if (category) {
      const [rows] = await db.query('SELECT id FROM categories WHERE user_id = ? AND name = ?', [userId, category]);
      categoryId = rows[0]?.id || null;
    }

    await db.query(
      'INSERT INTO expenses (user_id, category_id, date, description, value) VALUES (?, ?, ?, ?, ?)',
      [userId, categoryId, date, description, value]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar despesa' });
  }
});

// Remove despesa
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover despesa' });
  }
});

export default router;
