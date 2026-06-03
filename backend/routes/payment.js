const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

let payos = null;

// Initialize PayOS if credentials are available
try {
  const PayOS = require('@payos/node');
  if (process.env.PAYOS_CLIENT_ID && process.env.PAYOS_CLIENT_ID !== 'your_payos_client_id') {
    payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY
    );
    console.log('✅ PayOS initialized successfully');
  } else {
    console.log('⚠️ PayOS credentials not configured - PayOS payments disabled');
  }
} catch (e) {
  console.log('⚠️ PayOS SDK not available:', e.message);
}

// POST /api/payment/create-payos-link
router.post('/create-payos-link', async (req, res) => {
  try {
    if (!payos) {
      return res.status(503).json({ message: 'PayOS chưa được cấu hình. Vui lòng sử dụng phương thức thanh toán khác.' });
    }

    const { orderCode, amount, description } = req.body;

    if (!orderCode || !amount) {
      return res.status(400).json({ message: 'Thiếu thông tin thanh toán' });
    }

    const paymentData = {
      orderCode: Number(orderCode),
      amount: Math.round(amount),
      description: description || `Thanh toan don hang #${orderCode}`,
      returnUrl: `${process.env.FRONTEND_URL}/payment-result?orderCode=${orderCode}`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment-result?orderCode=${orderCode}&status=cancelled`,
    };

    const paymentLink = await payos.createPaymentLink(paymentData);

    // Update order with payos payment id
    await Order.findOneAndUpdate(
      { orderCode: Number(orderCode) },
      { payosPaymentId: paymentLink.paymentLinkId }
    );

    res.json({
      checkoutUrl: paymentLink.checkoutUrl,
      paymentLinkId: paymentLink.paymentLinkId
    });
  } catch (error) {
    console.error('PayOS create link error:', error);
    res.status(500).json({ message: 'Lỗi tạo link thanh toán PayOS' });
  }
});

// POST /api/payment/webhook - PayOS webhook handler
router.post('/webhook', async (req, res) => {
  try {
    if (!payos) {
      return res.status(200).json({ message: 'OK' });
    }

    // Verify webhook data
    const webhookData = payos.verifyPaymentWebhookData(req.body);

    if (webhookData && webhookData.orderCode) {
      const order = await Order.findOne({ orderCode: webhookData.orderCode });

      if (order) {
        if (webhookData.code === '00') {
          // Payment successful
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
        } else {
          // Payment failed
          order.paymentStatus = 'failed';
        }
        await order.save();
      }
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('PayOS webhook error:', error);
    // Always return 200 for webhooks to prevent retries
    res.status(200).json({ message: 'OK' });
  }
});

// GET /api/payment/verify/:orderCode
router.get('/verify/:orderCode', async (req, res) => {
  try {
    const order = await Order.findOne({ orderCode: Number(req.params.orderCode) });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // If PayOS is configured and order has payos payment, verify with PayOS
    if (payos && order.payosPaymentId) {
      try {
        const paymentInfo = await payos.getPaymentLinkInformation(order.payosPaymentId);
        if (paymentInfo.status === 'PAID' && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          await order.save();
        }
      } catch (e) {
        console.log('PayOS verify fallback to DB status');
      }
    }

    res.json({
      orderCode: order.orderCode,
      paymentStatus: order.paymentStatus,
      status: order.status,
      total: order.total,
      paymentMethod: order.paymentMethod
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
