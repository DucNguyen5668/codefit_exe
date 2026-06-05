const express = require('express');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Admin: list all users + stats
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (status && status !== 'all') {
      filter.isBanned = status === 'banned';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    
    // Calculate stats
    const totalCount = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: 'customer' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const bannedCount = await User.countDocuments({ isBanned: true });

    res.json({ 
      users,
      stats: {
        total: totalCount,
        customer: customerCount,
        admin: adminCount,
        banned: bannedCount
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng' });
  }
});

// PUT /api/users/:id/ban - Admin: toggle ban status
router.put('/:id/ban', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from banning themselves
    if (id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Bạn không thể tự khóa tài khoản của chính mình' });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    userToUpdate.isBanned = !userToUpdate.isBanned;
    await userToUpdate.save();

    res.json({ 
      message: userToUpdate.isBanned ? 'Đã khóa tài khoản thành công' : 'Đã mở khóa tài khoản thành công',
      user: userToUpdate.toJSON()
    });
  } catch (error) {
    console.error('Toggle ban error:', error);
    res.status(500).json({ message: 'Lỗi server khi thay đổi trạng thái tài khoản' });
  }
});

module.exports = router;
