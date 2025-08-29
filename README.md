📊 Expense Calculator

A full-stack Expense Calculator application built with Node.js + Express, MySQL, and a modern HTML/CSS/JavaScript frontend.
It allows users to register, log in, create categories, add expenses, and visualize data with charts.

🚀 Features

🔐 User Authentication

Register with name & password (hashed with bcrypt).

Secure login system.

📂 Categories

Create and manage your own expense categories.

💰 Expense Tracking

Add expenses with date, category, description, and value.

Filter by category or date.

📊 Data Visualization

Dynamic charts powered by Chart.js
.

🎨 Modern UI

Dark theme with elegant colors.

Responsive design using CSS variables and Google Fonts.

⚡ Backend API

Built with Express, MySQL2, UUID, and secured with Helmet + CORS.

🏗️ Project Structure
projetocalc/
  ├── projetocalc/
  │   ├── index.html        # Main frontend (login + dashboard)
  │   ├── schema.sql        # MySQL database schema
  │   ├── .env              # Environment variables
  │   ├── package.json      # Node.js dependencies & scripts
  │   ├── src/
  │   │   ├── server.js     # Express server entry point
  │   │   ├── routes/       # API endpoints (auth, categories, expenses)
  │   │   ├── controllers/  # Business logic
  │   │   ├── models/       # Database queries
  │   │   └── middleware/   # Authentication, error handling
  │   └── node_modules/     # Installed dependencies

⚙️ Installation
1. Clone Repository
git clone https://github.com/Nicolas-2025/calculadora-despesas-pi.git
cd calculadora-despesas-pi

2. Install Dependencies
npm install

3. Setup Database

Make sure MySQL server is running.

Run the schema:

mysql -u root -p < schema.sql

4. Configure Environment Variables

Edit .env file:

PORT=3000
CORS_ORIGIN=http://127.0.0.1:5500,http://localhost:5500
DB_HOST=localhost
DB_USER=root
DB_PASS=admin
DB_NAME=despesas_pro

5. Run the Server
npm run dev


The API will be available at:
👉 http://localhost:3000

6. Run the Frontend

Open index.html using Live Server (VS Code extension) or any local server.

🔑 API Endpoints
Authentication

POST /api/auth/register → Create user

POST /api/auth/login → Authenticate user

Categories

POST /api/categories → Create category

GET /api/categories → List categories

Expenses

POST /api/expenses → Add expense

GET /api/expenses → List expenses (filterable)

🛡️ Security

Passwords stored securely using bcrypt hashing.

Helmet for HTTP headers security.

CORS configured via environment variables.

📊 Database Schema

The database despesas_pro contains 3 main tables:

users → stores user credentials

categories → custom expense categories per user

expenses → expense records with category, date, description, value

🖼️ Screenshots (to add)

Login Screen

Dashboard with Charts

Expense Management

📌 Requirements

Node.js >=18

MySQL >=8

Live Server (or similar) for frontend

👨‍💻 Author

Developed by Nicolas Silva.