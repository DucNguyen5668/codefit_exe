const express = require('express');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages/conversations - Get user's conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    let conversations;
    
    if (req.user.role === 'admin') {
      // Admin sees all conversations
      conversations = await Conversation.find()
        .populate('customer', 'name email avatar')
        .sort({ lastMessageAt: -1 });
    } else {
      // Customer sees only their conversation
      conversations = await Conversation.find({ customer: req.user._id })
        .populate('customer', 'name email avatar')
        .sort({ lastMessageAt: -1 });
    }

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/messages/:conversationId - Get messages in a conversation
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện' });
    }

    // Check access
    if (req.user.role !== 'admin' && conversation.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 });

    // Mark messages as read
    if (req.user.role === 'admin') {
      await Message.updateMany(
        { conversation: conversation._id, sender: { $ne: req.user._id }, isRead: false },
        { isRead: true }
      );
      conversation.unreadByAdmin = 0;
    } else {
      await Message.updateMany(
        { conversation: conversation._id, sender: { $ne: req.user._id }, isRead: false },
        { isRead: true }
      );
      conversation.unreadByCustomer = 0;
    }
    await conversation.save();

    res.json({ messages, conversation });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/messages/send - Send a message
router.post('/send', auth, async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Nội dung tin nhắn không được trống' });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện' });
      }
    } else {
      // Customer creates new conversation or finds existing
      if (req.user.role === 'admin') {
        return res.status(400).json({ message: 'Admin cần chỉ định conversationId' });
      }

      conversation = await Conversation.findOne({ customer: req.user._id });
      if (!conversation) {
        conversation = new Conversation({
          customer: req.user._id
        });
        await conversation.save();
      }
    }

    const message = new Message({
      conversation: conversation._id,
      sender: req.user._id,
      content: content.trim()
    });
    await message.save();

    // Update conversation
    conversation.lastMessage = content.trim().substring(0, 100);
    conversation.lastMessageAt = new Date();
    
    if (req.user.role === 'admin') {
      conversation.unreadByCustomer += 1;
    } else {
      conversation.unreadByAdmin += 1;
    }
    
    await conversation.save();

    // Populate sender info for response
    await message.populate('sender', 'name avatar role');

    res.status(201).json({ message: message, conversationId: conversation._id });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/messages/unread/count - Get unread count
router.get('/unread/count', auth, async (req, res) => {
  try {
    let totalUnread = 0;

    if (req.user.role === 'admin') {
      const result = await Conversation.aggregate([
        { $group: { _id: null, total: { $sum: '$unreadByAdmin' } } }
      ]);
      totalUnread = result.length > 0 ? result[0].total : 0;
    } else {
      const conv = await Conversation.findOne({ customer: req.user._id });
      totalUnread = conv ? conv.unreadByCustomer : 0;
    }

    res.json({ unreadCount: totalUnread });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE /api/messages/:conversationId - Admin: Delete a conversation and all its messages
router.delete('/:conversationId', auth, adminOnly, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện' });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversation: conversationId });
    
    // Delete the conversation document itself
    await Conversation.findByIdAndDelete(conversationId);

    res.json({ message: 'Đã xóa cuộc trò chuyện' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa cuộc trò chuyện' });
  }
});

module.exports = router;
