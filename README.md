# 📊 Expense Calculator

A full-stack expense tracking application built with **Node.js + Express**, **MySQL**, and a modern **HTML/CSS/JavaScript** frontend.  
Users can register, log in, create categories, add expenses, and visualize their data with interactive charts.

---

## 🚀 Features

### 🔐 User Authentication
- Register with name and password (hashed using bcrypt).
- Secure login system.

### 📂 Categories
- Create and manage custom expense categories.

### 💰 Expense Tracking
- Add expenses with date, category, description, and value.
- Filter by category or date.

### 📊 Data Visualization
- Interactive charts powered by **Chart.js**.

### 🎨 Modern UI
- Dark theme with elegant color palette.
- Responsive design using CSS variables and Google Fonts.

### ⚡ Backend API
- Built with **Express**, **MySQL2**, **UUID**.
- Secured with **Helmet** and **CORS**.

---

## 🏗️ Project Structure

```
calculadora-despesas-pi/
├── index.html           # Main frontend (login + dashboard)
├── schema.sql           # MySQL database schema
├── .env                 # Environment variables
├── package.json         # Node.js dependencies & scripts
├── src/
│   ├── server.js        # Express server entry point
│   ├── routes/          # API endpoints (auth, categories, expenses)
└── node_modules/        # Installed dependencies
```
---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Nicolas-2025/calculadora-despesas-pi.git
cd calculadora-despesas-pi


2. Install Dependencies
npm install

3. Set Up the Database

Make sure your MySQL server is running.

Run the schema:

mysql -u root -p < schema.sql

4. Configure Environment Variables

Create or edit the .env file with:

PORT=3000
CORS_ORIGIN=http://127.0.0.1:5500,http://localhost:5500
DB_HOST=localhost
DB_USER=root
DB_PASS=admin
DB_NAME=despesas_pro

5. Start the Server
npm run dev


The API will be available at:
👉 http://localhost:3000

6. Run the Frontend

Open index.html using the Live Server extension in VS Code or any local web server.

🔑 API Endpoints
Authentication

POST /api/auth/register → Create a user

POST /api/auth/login → Authenticate a user

Categories

POST /api/categories → Create a category

GET /api/categories → List all categories

Expenses

POST /api/expenses → Add a new expense

GET /api/expenses → List expenses (filterable)

🛡️ Security

Passwords securely hashed using bcrypt.

HTTP headers protected via Helmet.

CORS configured via environment variables.

🧱 Database Schema

The despesas_pro database consists of 3 main tables:

users → stores user credentials

categories → user-specific expense categories

expenses → expense records (category, date, description, value)

🖼️ Screenshots (coming soon)

Login Screen

Dashboard with Charts

Expense Management Interface

📌 Requirements

Node.js v18 or higher

MySQL v8 or higher

Live Server extension (or any static file server)

👨‍💻 Author

Developed by Nicolas Silva