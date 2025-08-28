import express from 'express';
import db from '../db.js'; // ajuste o caminho se seu arquivo de conexão for diferente

const router = express.Router();

// Lista categorias do usuário
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId; // vem do frontend
    if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

    const [rows] = await db.query('SELECT id, name FROM categories WHERE user_id = ?', [userId]);
    res.json({ categories: rows.map(r => r.name) }); // frontend espera array de nomes
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Adiciona categoria
router.post('/', async (req, res) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name) return res.status(400).json({ error: 'Campos obrigatórios ausentes' });

    await db.query('INSERT INTO categories (user_id, name) VALUES (?, ?)', [userId, name]);
    res.json({ ok: true, name });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Categoria já existe para este usuário' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar categoria' });
  }
});

export default router;
