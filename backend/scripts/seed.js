require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const sampleProducts = [
  {
    name: 'Soft chairs',
    price: 19,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    description: 'Comfortable soft chairs for living room or office.',
    category: 'Home & Garden',
    stock: 42,
    featured: true,
  },
  {
    name: 'Sofa & chair set',
    price: 199,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    description: 'Modern sofa and matching chair in neutral tones.',
    category: 'Home & Garden',
    stock: 12,
    featured: true,
  },
  {
    name: 'Kitchen dishes set',
    price: 29,
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop',
    description: 'Ceramic dinnerware for everyday use.',
    category: 'Home & Garden',
    stock: 80,
    featured: false,
  },
  {
    name: 'Smart watch Pro',
    price: 89,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    description: 'Fitness tracking, heart rate, and notifications.',
    category: 'Electronics',
    stock: 55,
    featured: true,
  },
  {
    name: 'Wireless headphones',
    price: 59,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    description: 'Noise cancelling over-ear headphones.',
    category: 'Electronics',
    stock: 100,
    featured: true,
  },
  {
    name: 'Gaming laptop',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    description: 'High performance for games and creative work.',
    category: 'Electronics',
    stock: 15,
    featured: true,
  },
  {
    name: 'Running shoes',
    price: 79,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    description: 'Lightweight trainers for daily runs.',
    category: 'Sports',
    stock: 60,
    featured: false,
  },
  {
    name: 'Yoga mat',
    price: 24,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    description: 'Non-slip mat for yoga and pilates.',
    category: 'Sports',
    stock: 120,
    featured: false,
  },
  {
    name: 'Cotton t-shirt',
    price: 18,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    description: 'Classic fit, 100% organic cotton.',
    category: 'Clothing',
    stock: 200,
    featured: false,
  },
  {
    name: 'Denim jacket',
    price: 65,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    description: 'Vintage wash denim jacket.',
    category: 'Clothing',
    stock: 45,
    featured: true,
  },
  {
    name: 'Coffee maker',
    price: 49,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e4?w=400&h=400&fit=crop',
    description: 'Programmable drip coffee machine.',
    category: 'Home & Garden',
    stock: 30,
    featured: false,
  },
  {
    name: 'Bluetooth speaker',
    price: 39,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    description: 'Portable waterproof speaker.',
    category: 'Electronics',
    stock: 75,
    featured: false,
  },
];

async function run() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@brand.com').toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  await User.deleteMany({ email: adminEmail });
  const hash = await bcrypt.hash(adminPassword, 10);
  await User.create({
    name: 'Admin',
    email: adminEmail,
    password: hash,
    role: 'admin',
  });

  console.log(`Seeded ${sampleProducts.length} products.`);
  console.log(`Admin user: ${adminEmail} / ${adminPassword}`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
