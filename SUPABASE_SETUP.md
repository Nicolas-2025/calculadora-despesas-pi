## 🔗 Guia: Conectar o Projeto ao Supabase (PostgreSQL)

### 1️⃣ Obter Credenciais do Supabase

1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **Database** → **Connection string**
4. Copie a connection string no formato **Connection pooling** (recomendado para apps)
   - Exemplo: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
5. Extraia os valores:
   - `DB_HOST`: `postgres.xxxxx.pooler.supabase.com`
   - `DB_USER`: `postgres.xxxxx` (antes do `:`)
   - `DB_PASS`: sua senha
   - `DB_NAME`: `postgres` (padrão)
   - `DB_PORT`: `6543` (para pooling) ou `5432` (direto)
   - `DB_SSL`: `true` (Supabase exige SSL)

### 2️⃣ Configurar o Projeto Localmente

1. Instale as dependências (se não fez ainda):
   ```powershell
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto copiando `.env.example`:
   ```powershell
   Copy-Item .env.example .env
   ```

3. Abra `.env` e preencha com seus valores do Supabase:
   ```env
   DB_HOST=seu_host_supabase.pooler.supabase.com
   DB_USER=postgres.xxxxx
   DB_PASS=sua_senha_aqui
   DB_NAME=postgres
   DB_PORT=6543
   DB_SSL=true
   PORT=3000
   CORS_ORIGIN=http://localhost:3000
   ```

### 3️⃣ Preparar o Banco de Dados no Supabase

1. No Supabase, vá para **SQL Editor** e execute o script `schema.sql` (seu arquivo no projeto):
   - Copie o conteúdo de `schema.sql`
   - Cole no SQL Editor do Supabase e execute
   - Isso cria as tabelas: `users`, `categories`, `expenses`

2. Verificar se as tabelas foram criadas:
   - Vá em **Table Editor** no Supabase
   - Confirme que aparecem `users`, `categories` e `expenses`

### 4️⃣ Testar Localmente

1. Rode o servidor:
   ```powershell
   npm start
   ```

2. Você deve ver a mensagem:
   ```
   ✅ API rodando em http://localhost:3000
   ```

3. Teste a rota de health:
   ```powershell
   curl http://localhost:3000/api/health
   ```
   Resposta esperada:
   ```json
   {"ok":true,"uptime":XX.XX}
   ```

4. Se houver erro de conexão, verifique:
   - Valores de `DB_HOST`, `DB_USER`, `DB_PASS` no `.env` (compare com Supabase)
   - Se o banco no Supabase está ativo
   - Se as tabelas existem (SQL Editor → Table Editor)

### 5️⃣ Deploy no Netlify/Render

**Opção A: Usar Render para backend + Netlify para frontend**

1. Crie uma conta no [Render](https://render.com)
2. Clique em **New** → **Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Em **Environment** (variáveis), adicione:
   - `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`, `DB_SSL`, `CORS_ORIGIN`
   - Para `CORS_ORIGIN`, use: `https://seu-site.netlify.app` (URL do frontend no Netlify)
6. Deploy e copie a URL do serviço (ex.: `https://seu-api.onrender.com`)
7. No frontend (Netlify), ajuste as chamadas de API para apontar para essa URL

**Opção B: Usar Railway (mais integrado)**

1. Crie uma conta no [Railway](https://railway.app)
2. Clique em **New Project** → **Deploy from GitHub**
3. Conecte o repositório
4. Em **Variables**, adicione as mesmas ENV do `.env`
5. Configure a porta que Railway fornece em `PORT` (Railway seta automaticamente)
6. Deploy e use a URL do serviço no frontend

### 6️⃣ Atualizar Frontend (Netlify)

Se o frontend estava apontando para `localhost:3000`, ajuste para a URL do backend hospedado:

```javascript
// Antes (localhost)
const API_URL = 'http://localhost:3000';

// Depois (Render/Railway)
const API_URL = 'https://seu-api.onrender.com'; // ou sua URL do Railway
```

### 🎯 Checklist Final

- [ ] Credenciais do Supabase extraídas e no `.env`
- [ ] `npm install` executado
- [ ] `schema.sql` executado no Supabase SQL Editor
- [ ] `npm start` roda sem erros
- [ ] `GET /api/health` retorna `{ok:true}`
- [ ] Backend hospedado (Render/Railway) com ENV configuradas
- [ ] Frontend (Netlify) apontando para URL do backend
- [ ] `CORS_ORIGIN` no backend contém a URL do frontend
- [ ] Teste: registrar usuário, fazer login, adicionar despesa

### 📞 Troubleshooting

| Erro | Solução |
|------|---------|
| `connect ECONNREFUSED` | Verifique `DB_HOST`, `DB_USER`, `DB_PASS` no `.env` |
| `FATAL: password authentication failed` | Senha do Supabase está errada no `.env` |
| `relation "users" does not exist` | Execute `schema.sql` no SQL Editor do Supabase |
| `CORS error` no frontend | Ajuste `CORS_ORIGIN` com a URL do frontend |
| `SSL: CERTIFICATE_VERIFY_FAILED` | Confirme `DB_SSL=true` no `.env` |
