const express = require('express');
const Order = require('../models/Order');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Create new order
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { items, subtotal, discount, total, paymentMethod, shippingInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin giao hàng' });
    }

    // Generate unique order code (for PayOS compatibility - must be number)
    const orderCode = Number(String(Date.now()).slice(-8) + String(Math.floor(Math.random() * 100)).padStart(2, '0'));

    const order = new Order({
      orderCode,
      user: req.user ? req.user._id : null,
      items,
      subtotal,
      discount: discount || 0,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      shippingInfo,
      status: 'pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Đặt hàng thành công',
      order: order.toObject()
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
  }
});

// GET /api/orders/my-orders - Get current user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/orders/all - Admin: get all orders
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const { status, paymentMethod } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (paymentMethod && paymentMethod !== 'all') filter.paymentMethod = paymentMethod;

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/orders/:orderCode - Get order by code
router.get('/:orderCode', async (req, res) => {
  try {
    const order = await Order.findOne({ orderCode: req.params.orderCode });
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT /api/orders/:id/status - Admin: update order status
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus, refundStatus } = req.body;

    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (refundStatus) update.refundStatus = refundStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT /api/orders/:id/cancel - Customer: cancel own order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn khi đang chờ xác nhận hoặc đã xác nhận' });
    }

    order.status = 'cancelled';
    order.cancelReason = reason || 'Khách hàng yêu cầu hủy đơn';
    order.cancelledAt = new Date();

    await order.save();
    res.json({ message: 'Hủy đơn hàng thành công', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Lỗi server khi hủy đơn' });
  }
});

// PUT /api/orders/:id/refund - Customer: request refund/return
router.put('/:id/refund', auth, async (req, res) => {
  try {
    const { refundReason, bankName, accountNumber, accountHolder, password } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Chỉ có thể yêu cầu hoàn trả khi đơn hàng đã giao' });
    }

    if (order.refundStatus && order.refundStatus !== 'none') {
      return res.status(400).json({ message: 'Đơn hàng này đã có yêu cầu hoàn trả' });
    }

    if (!refundReason || !refundReason.trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập lý do hoàn trả' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Vui lòng nhập mật khẩu để xác nhận' });
    }

    if (!req.user.password) {
      return res.status(400).json({ message: 'Tài khoản Google cần đặt mật khẩu trong trang hồ sơ trước khi yêu cầu hoàn trả' });
    }

    const passwordMatches = await req.user.comparePassword(password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Mật khẩu xác nhận không đúng' });
    }

    const needsBankInfo = order.paymentMethod === 'payos' || order.paymentStatus === 'paid';
    if (needsBankInfo && (!bankName || !accountNumber || !accountHolder)) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng' });
    }

    order.refundStatus = 'requested';
    order.refundReason = refundReason.trim();
    order.refundRequestedAt = new Date();
    if (needsBankInfo) {
      order.refundBankInfo = {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim()
      };
    }

    await order.save();
    res.json({ message: 'Đã gửi yêu cầu hoàn trả', order });
  } catch (error) {
    console.error('Refund request error:', error);
    res.status(500).json({ message: 'Lỗi server khi gửi yêu cầu hoàn trả' });
  }
});

// GET /api/orders/stats/summary - Admin: order statistics
router.get('/stats/summary', auth, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Revenue for COD delivered orders (assumed paid)
    const codRevenue = await Order.aggregate([
      { $match: { paymentMethod: 'cod', status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue: totalRevenue + (codRevenue.length > 0 ? codRevenue[0].total : 0)
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
