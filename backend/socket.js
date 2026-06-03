const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

function initSocket(io) {
  // Auth middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.user.role})`);

    // Join user's personal room
    socket.join(`user_${socket.user._id}`);

    // Admin joins admin room
    if (socket.user.role === 'admin') {
      socket.join('admin_room');
    }

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conv_${conversationId}`);
      console.log(`${socket.user.name} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conv_${conversationId}`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content } = data;
        
        if (!content || !content.trim()) return;

        let conversation;
        
        if (conversationId) {
          conversation = await Conversation.findById(conversationId);
        } else if (socket.user.role !== 'admin') {
          // Customer auto-creates conversation
          conversation = await Conversation.findOne({ customer: socket.user._id });
          if (!conversation) {
            conversation = new Conversation({ customer: socket.user._id });
            await conversation.save();
          }
        }

        if (!conversation) return;

        const message = new Message({
          conversation: conversation._id,
          sender: socket.user._id,
          content: content.trim()
        });
        await message.save();
        await message.populate('sender', 'name avatar role');

        // Update conversation
        conversation.lastMessage = content.trim().substring(0, 100);
        conversation.lastMessageAt = new Date();
        
        if (socket.user.role === 'admin') {
          conversation.unreadByCustomer += 1;
        } else {
          conversation.unreadByAdmin += 1;
        }
        await conversation.save();

        // Emit to conversation room
        io.to(`conv_${conversation._id}`).emit('new_message', {
          message: message.toObject(),
          conversationId: conversation._id
        });

        // Notify admin room about new messages
        if (socket.user.role !== 'admin') {
          io.to('admin_room').emit('new_customer_message', {
            conversationId: conversation._id,
            customerName: socket.user.name,
            lastMessage: content.trim().substring(0, 100)
          });
        }

        // Notify customer about admin reply
        if (socket.user.role === 'admin') {
          io.to(`user_${conversation.customer}`).emit('new_admin_message', {
            conversationId: conversation._id,
            lastMessage: content.trim().substring(0, 100)
          });
        }

      } catch (error) {
        console.error('Socket send_message error:', error);
        socket.emit('error', { message: 'Lỗi gửi tin nhắn' });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      socket.to(`conv_${data.conversationId}`).emit('user_typing', {
        userId: socket.user._id,
        userName: socket.user.name,
        conversationId: data.conversationId
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(`conv_${data.conversationId}`).emit('user_stop_typing', {
        userId: socket.user._id,
        conversationId: data.conversationId
      });
    });

    // Mark messages as read
    socket.on('mark_read', async (data) => {
      try {
        const { conversationId } = data;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        await Message.updateMany(
          { conversation: conversationId, sender: { $ne: socket.user._id }, isRead: false },
          { isRead: true }
        );

        if (socket.user.role === 'admin') {
          conversation.unreadByAdmin = 0;
        } else {
          conversation.unreadByCustomer = 0;
        }
        await conversation.save();

        socket.to(`conv_${conversationId}`).emit('messages_read', {
          conversationId,
          readBy: socket.user._id
        });
      } catch (error) {
        console.error('Socket mark_read error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user.name}`);
    });
  });
}

module.exports = initSocket;
