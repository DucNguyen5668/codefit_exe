const express = require('express');
const Post = require('../models/Post');
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

// GET /api/posts - Public: list all active posts
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      const normalized = normalizeSearchText(search);
      if (normalized) {
        const tokens = normalized.split(' ').filter(Boolean);
        if (tokens.length > 0) {
          filter.$and = tokens.map((token) => ({
            $or: [
              { title: { $regex: escapeRegex(token), $options: 'i' } },
              { summary: { $regex: escapeRegex(token), $options: 'i' } },
              { content: { $regex: escapeRegex(token), $options: 'i' } }
            ]
          }));
        }
      }
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy bài viết' });
  }
});

// GET /api/posts/admin/all - Admin: list all posts (active & inactive)
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      const normalized = normalizeSearchText(search);
      if (normalized) {
        const tokens = normalized.split(' ').filter(Boolean);
        if (tokens.length > 0) {
          filter.$and = tokens.map((token) => ({
            $or: [
              { title: { $regex: escapeRegex(token), $options: 'i' } },
              { summary: { $regex: escapeRegex(token), $options: 'i' } }
            ]
          }));
        }
      }
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    console.error('Admin get posts error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/posts/:identifier - Public: get single post by _id or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let post;

    // Check if valid ObjectId format, otherwise search by slug
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findOne({ _id: identifier, isActive: true });
    } else {
      post = await Post.findOne({ slug: identifier, isActive: true });
    }

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    res.json({ post });
  } catch (error) {
    console.error('Get single post error:', error);
    res.status(500).json({ message: 'Lỗi server khi tìm bài viết' });
  }
});

// POST /api/posts - Admin: create new post
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, category, image, summary, content, author } = req.body;

    if (!title || !category || !image || !summary || !content) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    if (!baseSlug) {
      baseSlug = 'bai-viet-' + Date.now();
    }

    let slug = baseSlug;
    let slugExists = await Post.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${baseSlug}-${counter}`;
      slugExists = await Post.findOne({ slug });
      counter++;
    }

    const post = new Post({
      title,
      slug,
      category,
      image,
      summary,
      content,
      author: author || 'Nutricore Tây Nguyên'
    });

    await post.save();
    res.status(201).json({ message: 'Tạo bài viết thành công', post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo bài viết' });
  }
});

// PUT /api/posts/:id - Admin: update post
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    res.json({ message: 'Cập nhật bài viết thành công', post });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật bài viết' });
  }
});

// DELETE /api/posts/:id - Admin: soft delete
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }

    res.json({ message: 'Đã ẩn/xóa bài viết thành công' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa bài viết' });
  }
});

module.exports = router;
