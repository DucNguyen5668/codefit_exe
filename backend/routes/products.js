const express = require('express');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeSearchText = (value = '') => value
  .toString()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const buildSearchFilter = (search) => {
  const normalized = normalizeSearchText(search);
  if (!normalized) return null;

  const tokens = normalized.split(' ').filter(Boolean).slice(0, 8);
  if (tokens.length === 0) return null;

  const fields = ['name', 'brand', 'desc', 'origin', 'weight', 'slug'];
  return {
    $and: tokens.map((token) => ({
      $or: fields.map((field) => ({ [field]: { $regex: escapeRegex(token), $options: 'i' } }))
    }))
  };
};

const buildProductQuery = (query, includeInactive = false) => {
  const { category, search, minPrice, maxPrice } = query;
  const filter = includeInactive ? {} : { isActive: true };

  if (category && category !== 'all') {
    filter.category = category;
  }

  const min = Number(minPrice);
  const max = Number(maxPrice);
  if (!Number.isNaN(min) || !Number.isNaN(max)) {
    filter.price = {};
    if (!Number.isNaN(min)) filter.price.$gte = min;
    if (!Number.isNaN(max)) filter.price.$lte = max;
  }

  const searchFilter = buildSearchFilter(search);
  if (searchFilter) {
    filter.$and = [...(filter.$and || []), ...searchFilter.$and];
  }

  return filter;
};

const getSortOption = (sort) => {
  switch (sort) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'name_asc':
      return { name: 1 };
    default:
      return { createdAt: -1 };
  }
};

// GET /api/products - Public: list all active products
router.get('/', async (req, res) => {
  try {
    const filter = buildProductQuery(req.query, false);
    const sort = getSortOption(req.query.sort);

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && limit) {
      const skip = (page - 1) * limit;
      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter).sort(sort).skip(skip).limit(limit);
      res.json({
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    } else {
      const products = await Product.find(filter).sort(sort);
      res.json({ products });
    }
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/products/admin/all - Admin: list ALL products including inactive
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const filter = buildProductQuery(req.query, true);
    const sort = getSortOption(req.query.sort);
    const products = await Product.find(filter).sort(sort);
    res.json({ products });
  } catch (error) {
    console.error('Admin get products error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/products/:slug - Public: get single product
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/products - Admin: create product
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, price, oldPrice, image, weight, origin, brand, stockQty, storage, desc, descImage, category } = req.body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const product = new Product({
      name, slug, price, oldPrice, image, weight, origin, brand, stockQty, storage, desc, descImage, category
    });

    await product.save();
    res.status(201).json({ message: 'Tạo sản phẩm thành công', product });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Sản phẩm đã tồn tại' });
    }
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT /api/products/:id - Admin: update product
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Cập nhật thành công', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE /api/products/:id - Admin: soft delete
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});


module.exports = router;
