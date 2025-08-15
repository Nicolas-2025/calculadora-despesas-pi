import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import expensesRoutes from './routes/expenses.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}));

app.get('/api/health', (req,res)=> res.json({ ok:true, uptime: process.uptime() }));
app.use('/api', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/expenses', expensesRoutes);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, ()=>{
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});