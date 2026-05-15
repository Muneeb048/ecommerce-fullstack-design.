const express = require('express');
const router = express.Router();

// ---------- Health check ----------
router.get('/', (req, res) => {
  res.json({ message: 'API is running 🚀' });
});

// ---------- Mount resource routes ----------
router.use('/products', require('./productRoutes'));
router.use('/auth', require('./authRoutes'));

module.exports = router;
