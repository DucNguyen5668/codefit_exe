const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nutricore_uploads',
    allowed_formats: ['jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 1000, crop: 'limit' }] // Optimize image size
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', auth, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Vui lòng chọn file ảnh' });
  }
  // Cloudinary URL is in req.file.path
  const imageUrl = req.file.path;
  res.json({ url: imageUrl });
});

module.exports = router;

