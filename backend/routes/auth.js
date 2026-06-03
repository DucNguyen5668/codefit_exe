const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { verifyFirebaseIdToken } = require('../utils/firebaseAdmin');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateSecureToken = () => crypto.randomBytes(32).toString('hex');
const PASSWORD_POLICY_MESSAGE = 'Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số';
const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

const setEmailVerificationToken = (user) => {
  user.emailVerificationToken = generateSecureToken();
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return user.emailVerificationToken;
};

const setPasswordResetToken = (user) => {
  user.passwordResetToken = generateSecureToken();
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  return user.passwordResetToken;
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được đăng ký' });
    }

    const user = new User({
      name,
      email: normalizedEmail,
      password,
      phone,
      emailVerified: false
    });
    const verificationToken = setEmailVerificationToken(user);
    await user.save();

    try {
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        token: verificationToken
      });
    } catch (emailError) {
      console.error('Failed to send verification email during registration:', emailError);
      // We don't throw here so the user registration still succeeds
    }

    res.status(201).json({
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      email: user.email,
      requiresEmailVerification: true
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: 'Tài khoản chưa xác thực email. Vui lòng kiểm tra hộp thư hoặc gửi lại email xác thực.',
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/auth/verify-email?token=...
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Thiếu mã xác thực email' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Liên kết xác thực không hợp lệ hoặc đã hết hạn' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ message: 'Xác thực email thành công. Bạn có thể đăng nhập ngay.' });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.json({ message: 'Nếu email tồn tại, hệ thống sẽ gửi lại email xác thực.' });
    }

    if (user.emailVerified) {
      return res.json({ message: 'Email này đã được xác thực. Bạn có thể đăng nhập.' });
    }

    const verificationToken = setEmailVerificationToken(user);
    await user.save();
    await sendVerificationEmail({ to: user.email, name: user.name, token: verificationToken });

    res.json({ message: 'Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && user.password) {
      const resetToken = setPasswordResetToken(user);
      await user.save();
      await sendPasswordResetEmail({ to: user.email, name: user.name, token: resetToken });
    }

    res.json({ message: 'Nếu email tồn tại, hệ thống sẽ gửi liên kết đặt lại mật khẩu.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Thiếu mã đặt lại mật khẩu hoặc mật khẩu mới' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: PASSWORD_POLICY_MESSAGE });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.emailVerified = true;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Thiếu Firebase ID token' });
    }

    const decodedToken = await verifyFirebaseIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email || !uid) {
      return res.status(400).json({ message: 'Firebase token không có thông tin Google hợp lệ' });
    }

    let user = await User.findOne({ email });

    if (user) {
      user.googleId = user.googleId || uid;
      user.avatar = picture || user.avatar;
      user.emailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpires = null;
      if (!user.name && name) user.name = name;
      await user.save();
    } else {
      user = new User({
        name: name || email.split('@')[0],
        email,
        googleId: uid,
        avatar: picture,
        role: 'customer',
        emailVerified: true
      });
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Đăng nhập Google thành công',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Không thể xác thực Firebase Google token' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();
    res.json({ message: 'Cập nhật thành công', user: user.toJSON() });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!newPassword || !isStrongPassword(newPassword)) {
      return res.status(400).json({ message: PASSWORD_POLICY_MESSAGE });
    }

    // If user has a password (not Google-only), verify current password
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu hiện tại' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
      }
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
