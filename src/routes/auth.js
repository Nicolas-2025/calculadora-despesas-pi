import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../db.js';

const router = express.Router();

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) return res.status(400).json({ error: 'Nome e senha obrigatórios' });

    // Verifica se já existe
    const [rows] = await db.query('SELECT id FROM users WHERE name = ?', [name]);
if (rows.length > 0) {

      return res.status(400).json({ error: 'Nome já cadastrado' });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    // Insere usuário
    await db.query('INSERT INTO users (id, name, password_hash) VALUES (?, ?, ?)', [id, name, passwordHash]);

    // Categorias padrão
    const defaultCats = ['Alimentação','Transporte','Moradia','Lazer','Saúde','Educação','Outros'];
    for (const cat of defaultCats) {
      await db.query('INSERT INTO categories (user_id, name) VALUES (?, ?)', [id, cat]);
    }

    res.json({ ok: true, user: { id, name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) return res.status(400).json({ error: 'Credenciais obrigatórias' });

    const [rows] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
    if (rows.length === 0) return res.status(401).json({ error: 'Usuário não encontrado' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Senha inválida' });

    res.json({ ok: true, user: { id: user.id, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
  }
});

export default router;