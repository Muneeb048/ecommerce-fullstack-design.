# ecommerce-fullstack-design

E-commerce application built with MongoDB, Express, React, and Node.js. 

## Setup

Requires Node.js 16+ and MongoDB.

1. Clone the repo and install dependencies:
```bash
git clone https://github.com/Muneeb048/ecommerce-fullstack-design.git
cd ecommerce-fullstack-design
```

2. Start the backend:
```bash
cd backend
npm install
# Create a .env file based on .env.example
npm run dev
```

3. Start the frontend:
```bash
cd ../frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` in the `backend` directory:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommapp
JWT_SECRET=your_jwt_secret_here
```

## Structure
- `/frontend`: React app (Vite, Tailwind CSS)
- `/backend`: Express API server

## Development
To load initial test data into the database:
```bash
cd backend
node scripts/seed.js
```
