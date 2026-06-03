const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: String,
  price: Number,
  quantity: Number,
  weight: String,
  image: String
}, { _id: false });

const shippingInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, required: true },
  note: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderCode: {
    type: Number,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'payos'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  shippingInfo: shippingInfoSchema,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payosPaymentId: {
    type: String,
    default: null
  },
  cancelReason: {
    type: String,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'rejected', 'completed'],
    default: 'none'
  },
  refundReason: {
    type: String,
    default: null
  },
  refundBankInfo: {
    bankName: { type: String, default: null },
    accountNumber: { type: String, default: null },
    accountHolder: { type: String, default: null }
  },
  refundRequestedAt: {
    type: Date,
    default: null
  },
  refundCompletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
