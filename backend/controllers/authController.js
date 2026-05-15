const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../middleware/auth');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(400);
      throw new Error('Email already registered');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name || '',
      email: email.toLowerCase(),
      password: hashed,
      role: 'customer',
    });
    const token = signToken(user);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      throw new Error('Invalid credentials');
    }
    const token = signToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function me(req, res, next) {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id.toString(),
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login, me };
