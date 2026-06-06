const express = require('express');
const router = express.Router();
const About = require('../models/About');
const { auth, adminOnly } = require('../middleware/auth');

// @route   GET /api/about
// @desc    Get About Us page content
// @access  Public
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne().sort({ createdAt: -1 });
    if (!about) {
      // Create a default entry if none exists
      about = new About();
      await about.save();
    }
    res.json(about);
  } catch (err) {
    console.error('Error fetching About content:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin About Us' });
  }
});

// @route   PUT /api/about
// @desc    Update About Us page content
// @access  Private/Admin
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      missionSubtitle,
      missionTitle,
      missionParagraphs,
      coreValues,
      visionSubtitle,
      visionTitle,
      visionDescription,
      images
    } = req.body;

    // Find and update, or create if not exists
    let about = await About.findOne().sort({ createdAt: -1 });
    
    if (!about) {
      about = new About();
    }

    if (missionSubtitle !== undefined) about.missionSubtitle = missionSubtitle;
    if (missionTitle !== undefined) about.missionTitle = missionTitle;
    if (missionParagraphs !== undefined) about.missionParagraphs = missionParagraphs;
    if (coreValues !== undefined) about.coreValues = coreValues;
    if (visionSubtitle !== undefined) about.visionSubtitle = visionSubtitle;
    if (visionTitle !== undefined) about.visionTitle = visionTitle;
    if (visionDescription !== undefined) about.visionDescription = visionDescription;
    if (images !== undefined) about.images = images;

    await about.save();
    res.json(about);
  } catch (err) {
    console.error('Error updating About content:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin About Us' });
  }
});

module.exports = router;
