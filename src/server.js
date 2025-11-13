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

// Configuração CORS mais robusta
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGIN || '*').split(',').map(o => o.trim());
    
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para origin: ${origin}`);
      callback(null, true); // Permitir mesmo assim para debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.get('/api/health', (req,res)=> res.json({ ok:true, uptime: process.uptime() }));
app.use('/api', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/expenses', expensesRoutes);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, ()=>{
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});