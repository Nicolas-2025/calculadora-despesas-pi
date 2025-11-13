-- Crie as tabelas para PostgreSQL (Supabase)

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  name VARCHAR(80) NOT NULL,
  UNIQUE (user_id, name),
  CONSTRAINT fk_cat_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses (
  id BIGSERIAL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  category_id BIGINT NULL,
  date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_exp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_exp_cat FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_user_date ON expenses(user_id, date);

-- Categorias padrão serão criadas via backend no cadastro.