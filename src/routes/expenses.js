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
               WHERE e.user_id = $1`;
    const params = [userId];
    let paramIndex = 2;

    if (from && from !== 'null') {
      sql += ` AND e.date >= $${paramIndex}`;
      params.push(from);
      paramIndex++;
    }

    if (to && to !== 'null') {
      sql += ` AND e.date <= $${paramIndex}`;
      params.push(to);
      paramIndex++;
    }

    if (category && category !== '__all__') {
      sql += ` AND c.name = $${paramIndex}`;
      params.push(category);
    }

    const result = await db.query(sql, params);
    res.json(result.rows);
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
      const result = await db.query('SELECT id FROM categories WHERE user_id = $1 AND name = $2', [userId, category]);
      categoryId = result.rows[0]?.id || null;
    }

    await db.query(
      'INSERT INTO expenses (user_id, category_id, date, description, value) VALUES ($1, $2, $3, $4, $5)',
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
    await db.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover despesa' });
  }
});

export default router;
