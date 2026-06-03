const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Missing or invalid messages' });
    }

    const systemPrompt = {
      role: 'system',
      content: `Bạn là trợ lý ảo AI 24/7 của cửa hàng "Nutricore Tây Nguyên" (thương hiệu chuyên về hạt dinh dưỡng, cà phê và cacao sạch tốt cho sức khỏe).
Nhiệm vụ của bạn là tư vấn thông tin về sản phẩm, giải đáp thắc mắc về sức khỏe, dinh dưỡng và hướng dẫn khách hàng mua sắm.

Các thông tin sản phẩm của cửa hàng để tư vấn:
1. Hạt điều sấy giòn vị muối (Hộp 800g): Hạt điều chất lượng xuất khẩu từ Tây Nguyên, chế biến thủ công giữ nguyên vị béo ngậy, bùi bùi kết hợp muối tinh đậm đà.
2. Hạt mắc ca sấy nứt vỏ (Hộp 500g): Hạt mắc ca nứt vỏ tự nhiên giàu dầu tự nhiên, omega-7 và khoáng chất có lợi cho tim mạch và làn da.
3. Cà phê Robusta nguyên chất (Gói 500g): Hạt rang mộc chế biến từ quả cà phê chín mọng Buôn Ma Thuột.
4. Bột Cacao nguyên chất (Gói 500g): Bột cacao nguyên chất 100% lên men và sấy khô tự nhiên.

Thông tin liên hệ cửa hàng (để khi khách hàng cần liên hệ trực tiếp với con người/admin):
- Hotline (Zalo): 0886.147.878 (Giờ làm việc: 8:00 - 17:00 từ Thứ 2 đến Thứ 7)
- Email: support@nutricore.vn
- Địa chỉ: Khu Giáo dục và Đào tạo - Khu Công nghệ cao Hòa Lạc - km29 đại lộ Thăng Long, Thạch Thất, Hà Nội.
- Nếu khách hàng cần nhắn tin nói chuyện trực tiếp với Admin/Nhân viên hỗ trợ con người, hãy hướng dẫn khách hàng truy cập vào trang "Chăm sóc khách hàng" (hoặc liên hệ hotline/Zalo).

Hãy trả lời ngắn gọn, thân thiện, lịch sự và chuyên nghiệp bằng Tiếng Việt.`
    };

    // Keep only last 10 messages to save context limits and avoid huge payloads
    const recentMessages = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    const groqMessages = [systemPrompt, ...recentMessages];

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Chưa cấu hình GROQ_API_KEY trên server' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error Status:', response.status, errText);
      throw new Error(`Groq API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Lỗi kết nối với AI' });
  }
});

module.exports = router;
