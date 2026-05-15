# Fullstack E-Commerce Application

A fully functional, responsive, and dynamic e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

- **Responsive Design**: Fully responsive UI tailored for both desktop and mobile views.
- **Dynamic Content**: Products are fetched and displayed dynamically from a MongoDB database.
- **Advanced Filtering**: Filter products by category, price, brand, rating, and features.
- **User Authentication**: Secure user login and registration with JWT-based authentication.
- **Cart & Wishlist Management**: Add products to cart and manage wishlist seamlessly.
- **Admin Panel**: Role-based access for admins to manage the product catalog.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (using Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: React Icons
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

## 📁 Project Structure

The repository is divided into two main workspaces:

- `/frontend` - Contains the React application and UI components.
- `/backend` - Contains the Node.js Express server, API routes, and database models.

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally on port 27017 or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/Muneeb048/ecommerce-fullstack-design.git
cd ecommerce-fullstack-design
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommapp
JWT_SECRET=your_secret_key_here
```
Run the development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Run the Vite development server:
```bash
npm run dev
```

### 4. Seed the Database (Optional)
If you want to populate your database with initial dummy data:
```bash
cd backend
node scripts/seed.js
```

## 📜 License
This project is licensed under the MIT License.
