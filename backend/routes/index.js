const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

router.use('/products', require('./productRoutes'));
router.use('/auth', require('./authRoutes'));

module.exports = router;
