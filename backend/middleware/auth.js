const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production';

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function protect(req, res, next) {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    token = auth.slice(7);
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-password');
    if (!user) {
      res.status(401);
      return next(new Error('User not found'));
    }
    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (e) {
    res.status(401);
    next(new Error('Not authorized, invalid token'));
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    return next(new Error('Admin access required'));
  }
  next();
}

module.exports = { JWT_SECRET, signToken, protect, requireAdmin };
