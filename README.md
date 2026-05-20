# Finverse

Finverse is a full-stack personal finance app for tracking wallet activity, expenses, budgets, transactions, and shared group bills. It includes a React frontend and an Express/MongoDB backend with JWT-based authentication.

## Features

- User sign up, login, and protected routes
- Wallet balance tracking with credit/debit transactions
- Expense logging by category and payment type
- Budget planning with monthly/yearly views
- Transaction history with filtering
- Split bill groups, member management, shared expenses, and settlements
- Profile image upload through Cloudinary
- Responsive dashboard UI with charts and finance summaries

## Tech Stack

**Frontend**

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Chart.js / react-chartjs-2
- React Toastify

**Backend**

- Node.js
- Express JS
- MongoDB with Mongoose
- JSON Web Tokens
- bcrypt
- Cloudinary
- Multer
- Validator

## Project Structure

```text
Finverse/
  backend/
    config/
    constants/
    controllers/
    middlewares/
    models/
    routes/
    services/
    validators/
    server.js
  frontend/
    src/
      assets/
      components/
      context/
      pages/
      App.jsx
      main.jsx
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection string
- Cloudinary account for profile image uploads

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
PORT=4000
```

Start the backend:

```bash
npm run server
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

The Vite dev server will print the local URL, usually `http://localhost:5173`.

## Available Scripts

### Backend

```bash
npm run server
```

Runs the Express API with nodemon.

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

- `dev`: start the Vite development server
- `build`: create a production build
- `lint`: run ESLint
- `preview`: preview the production build locally

## API Route Groups

The backend mounts these route groups:

```text
/user
/wallet
/expense
/budget
/split-bill
/transaction
```

Most finance routes are intended to be used by authenticated users with a valid JWT token.

## Notes

- Keep `.env` files private and do not commit real credentials.
- The frontend reads the API base URL from `VITE_BACKEND_URL`.
- The backend reads MongoDB, Cloudinary, JWT, and port settings from `backend/.env`.

