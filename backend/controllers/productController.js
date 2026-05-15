const Product = require('../models/Product');

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function listProducts(req, res, next) {
  try {
    const { search, category, featured } = req.query;
    const filter = {};
    const clauses = [];

    if (featured === 'true' || featured === '1') {
      filter.featured = true;
    }

    if (category && String(category).trim()) {
      clauses.push({
        category: new RegExp(`^${escapeRegex(String(category).trim())}$`, 'i'),
      });
    }

    if (search && String(search).trim()) {
      const re = new RegExp(escapeRegex(String(search).trim()), 'i');
      clauses.push({ $or: [{ name: re }, { category: re }] });
    }

    if (clauses.length) {
      filter.$and = clauses;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    const formatted = products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
      category: p.category,
      stock: p.stock,
      featured: p.featured,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (e) {
    next(e);
  }
}

async function getProduct(req, res, next) {
  try {
    let product;
    try {
      product = await Product.findById(req.params.id).lean();
    } catch (e) {
      if (e.name === 'CastError') {
        res.status(404);
        throw new Error('Product not found');
      }
      throw e;
    }
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({
      success: true,
      data: {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        category: product.category,
        stock: product.stock,
        featured: product.featured,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, price, image, description, category, stock, featured } = req.body;
    if (!name || price == null || !image || !category || stock == null) {
      res.status(400);
      throw new Error('name, price, image, category, and stock are required');
    }
    const product = await Product.create({
      name,
      price: Number(price),
      image,
      description: description ?? '',
      category,
      stock: Number(stock),
      featured: Boolean(featured),
    });
    res.status(201).json({ success: true, data: product.toJSON() });
  } catch (e) {
    next(e);
  }
}

async function updateProduct(req, res, next) {
  try {
    const updates = { ...req.body };
    if (updates.price != null) updates.price = Number(updates.price);
    if (updates.stock != null) updates.stock = Number(updates.stock);
    if (updates.featured != null) updates.featured = Boolean(updates.featured);
    delete updates.id;
    delete updates._id;

    let product;
    try {
      product = await Product.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      });
    } catch (e) {
      if (e.name === 'CastError') {
        res.status(404);
        throw new Error('Product not found');
      }
      throw e;
    }
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ success: true, data: product.toJSON() });
  } catch (e) {
    next(e);
  }
}

async function deleteProduct(req, res, next) {
  try {
    let product;
    try {
      product = await Product.findByIdAndDelete(req.params.id);
    } catch (e) {
      if (e.name === 'CastError') {
        res.status(404);
        throw new Error('Product not found');
      }
      throw e;
    }
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ success: true, message: 'Product removed' });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
