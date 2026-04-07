<div align="center">

# 💜 FINVERSE

### Your all-in-one personal finance companion — wallet, expense tracker & bill splitter.

![License](https://img.shields.io/badge/license-MIT-7F5AF0?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Pages & Functionality](#-pages--functionality)
- [UI Design System](#-ui-design-system)
- [API Overview](#-api-overview)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📌 About

**Finverse** is a full-stack personal finance web application that helps users manage their digital wallet, track daily expenses, set budgets, and split bills with groups — all from a single, unified dashboard.

> ⚠️ **Note:** Finverse does not integrate real payment gateways (e.g. Razorpay). All wallet operations are simulated within the app.

---

## ✨ Features

- 🏦 **Digital Wallet** — Add & send money, PIN-protected transfers, balance alerts
- 📊 **Expense Tracking** — Categorised expenses with cash/wallet modes and rich charts
- 🎯 **Budget Management** — Category-wise budget limits with progress tracking and insights
- 🤝 **Split Bills** — Create groups, split expenses equally or custom, and settle up
- 📈 **Dashboard** — Unified view of balance, savings, credit/debit, and recent transactions
- 🔒 **Authentication** — Secure JWT-based login with bcrypt password hashing
- 🖼️ **Profile Management** — Avatar uploads via Cloudinary, profile editing, password changes
- 🔔 **Notifications** — Real-time toast notifications throughout the app

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database & schema modeling |
| JWT + Bcrypt | Authentication & password hashing |
| Cloudinary + Multer | Image/file uploads |
| Validator | Input validation |
| dotenv | Environment variable management |
| cors + axios | Cross-origin requests |
| nodemon | Auto-restart during development |

### Frontend
| Technology | Purpose |
|---|---|
| React.js + Vite | UI framework & build tool |
| Tailwind CSS | Utility-first styling |
| Chart.js | Bar charts, pie charts, line charts |
| React Toastify | Toast notifications |
| Axios | HTTP client |

### Testing
| Tool | Purpose |
|---|---|
| Postman | API endpoint testing |

---

## 📁 Project Structure

```
finverse/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── walletController.js
│   │   ├── expenseController.js
│   │   ├── budgetController.js
│   │   ├── splitController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Wallet.js
│   │   ├── Expense.js
│   │   ├── Budget.js
│   │   ├── Group.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── walletRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── splitRoutes.js
│   │   └── transactionRoutes.js
│   ├── utils/
│   │   └── cloudinary.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── ...
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Wallet.jsx
    │   │   ├── Expenses.jsx
    │   │   ├── Budget.jsx
    │   │   ├── SplitBills.jsx
    │   │   ├── AllTransactions.jsx
    │   │   └── Profile.jsx
    │   ├── context/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/finverse.git
cd finverse
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

---

### Environment Variables

#### Backend — `backend/.env`

```env
MONGODB_URL=''
CLOUDINARY_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''
JWT_SECRET=''
PORT=
```

| Variable | Description |
|---|---|
| `MONGODB_URL` | Your MongoDB connection string (Atlas URI or local) |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `JWT_SECRET` | A strong secret string for signing JWTs |
| `PORT` | Port for the Express server (e.g. `4444`) |

#### Frontend — `frontend/.env`

```env
VITE_BACKEND_URL=http://localhost:4444
```

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Base URL for the backend API |

---

### Running the App

**Start the backend server**

```bash
cd backend
npm run dev      # uses nodemon for auto-restart
```

**Start the frontend dev server**

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:4444` by default.

---

## 📄 Pages & Functionality

### 🏠 Landing Page
Public-facing marketing page featuring a hero section with the Finverse logo and screenshots, feature highlights, how-it-works walkthrough, FAQ accordion, testimonials, and a footer with About, Contact, Privacy Policy, and Terms & Conditions.

---

### 🔐 Login / Sign-Up
Tabbed authentication page. **Login** accepts email + password. **Sign-Up** accepts full name, email, and password. Both sides link to each other for switching.

---

### 📊 Dashboard
High-level financial overview showing wallet balance, monthly total credit/debit (wallet + cash combined), amount owed to others, amount others owe you, current savings, a monthly savings bar chart, savings streak counter, and the 5 most recent transactions.

---

### 💳 Wallet
Manage your digital wallet balance. Supports adding money and PIN-protected money transfers (by recipient email). Displays all-time wallet credit/debit totals, a monthly wallet transaction chart, and triggers a low balance warning when funds run low.

---

### 🧾 Expenses
Log and analyse expenses. Supports wallet or cash payment modes (shows live wallet balance when wallet is selected). Includes a category dropdown, date picker, and description field. Visualises data via a monthly expenses bar chart and a category-wise pie chart, alongside a filterable expense list with a detailed view.

---

### 🎯 Budget
Set and monitor spending limits per expense category. Displays total budget, total spent, remaining balance, and a progress bar. Supports adding new categories, editing limits, and deleting categories. Generates monthly insights and suggestions based on spending behaviour.

> **Note:** Budget categories are tied exclusively to expense categories.

---

### 🤝 Split Bills
Group-based bill splitting. Users can create groups, add members, and log shared expenses with either equal or custom splits. The group detail view shows each member's balance. Members may leave a group once all their expenses are settled. Only the group creator can delete the group.

> **Note:** Split expenses are scoped entirely within their group and do not merge with personal expenses or wallet transactions.

---

### 📋 All Transactions
A unified, filterable transaction log covering wallet transfers, expenses, and splits. Filters include type, date range (from–to), and amount range (min–max). Columns: date, description, category, amount, type, status, and a detail view action. Also displays a monthly transactions bar chart and a wallet/expenses/splits breakdown pie chart.

---

### 👤 My Profile
View and update personal information (name, email, avatar), and change account password.

---

## 🎨 UI Design System

| Token | Value |
|---|---|
| Background | `#1A102B` |
| Cards / Sections | `#3A1C71` |
| Primary Button | `#7F5AF0` |
| Button Hover | `#9A7DFF` |
| Headings | `#FFFFFF` |
| Body Text | `#E6E6EB` |
| Borders | `#D6CCFF` |

---

## 🔌 API Overview

All API routes are prefixed with `/api`. Protected routes require a valid `Authorization: Bearer <token>` header.

| Module | Base Route |
|---|---|
| Auth | `/api/auth` |
| Wallet | `/api/wallet` |
| Expenses | `/api/expenses` |
| Budget | `/api/budget` |
| Split Bills | `/api/splits` |
| Transactions | `/api/transactions` |
| Profile | `/api/profile` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---


