const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: true
  },
  oldPrice: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    default: ''
  },
  origin: {
    type: String,
    default: 'Việt Nam'
  },
  brand: {
    type: String,
    default: 'NUTRICORE TÂY NGUYÊN'
  },
  stockQty: {
    type: Number,
    default: 100
  },
  storage: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  descImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['nuts', 'coffee_cacao', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
