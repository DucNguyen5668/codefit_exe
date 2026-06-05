// Fix: Override DNS servers so Node.js SRV lookups (used by mongodb+srv://) work correctly.
// The default system DNS (IPv6 link-local fe80::1) refuses SRV queries, causing ECONNREFUSED.
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const initSocket = require('./socket');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const chatbotRoutes = require('./routes/chatbot');
const postRoutes = require('./routes/posts');

const app = express();
const server = http.createServer(app);

// CORS options to dynamically support localhost, 127.0.0.1 and env value on any port
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://nutricore.io.vn',
  'https://www.nutricore.io.vn',
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    if (allowedOrigins.includes(origin) || isLocal) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
};

// Socket.io setup
const io = new Server(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize Socket.io
initSocket(io);

async function seedInitialPosts() {
  try {
    const Post = require('./models/Post');
    const count = await Post.countDocuments();
    if (count === 0) {
      console.log('Post collection is empty. Seeding initial articles...');
      const initialArticles = [
        {
          title: "Công Dụng Tốt Cho Sức Khỏe Từ Hạt Điều",
          slug: "cashew",
          category: "Hạt dinh dưỡng",
          image: "/Dinh_duong1.jpg",
          summary: "Hạt điều chứa các chất chống oxy hóa mạnh mẽ cùng nguồn chất béo không bão hòa đơn có lợi...",
          content: `
            <p>Hạt điều có tên khoa học là <em>Anacardium occidentale L.</em>, thuộc họ <em>Anacardiaceae</em>. Cây có nguồn gốc từ vùng đông bắc Brazil, được phát triển tự phát ở các nước Nam Mỹ. Trong thế kỷ 16, nó được du nhập vào Ấn Độ và Châu Phi bởi người Bồ Đào Nha. Từ Ấn Độ, cây điều lan rộng khắp Đông Nam Á.</p>
            
            <h2>Thông tin tổng quan về hạt điều</h2>
            <p>Hạt điều có giá trị kinh tế cao. Chúng đứng thứ ba về sản lượng trên toàn thế giới, với sản lượng trung bình thế giới là 547.371 tấn hạt trong 10 năm qua với xu hướng tăng liên tục. Năm 2014, tổng sản lượng hạt điều thô đạt 629.668 tấn, dẫn đầu là Ấn Độ, và tiếp theo là Việt Nam với 119.048 tấn, đem lại nguồn thu nhập lớn cho hàng nghìn người dân ở nước ta. Theo thông tin từ bộ nông nghiệp Hoa Kỳ, thành phần dinh dưỡng có trong 100g hạt điều bao gồm các chất béo tốt, vitamin B, sắt, kẽm, và magie.</p>

            <h2>Tác dụng của hạt điều đối với sức khỏe</h2>
            
            <h3>1. Chứa các hợp chất thực vật có lợi</h3>
            <p>Quả và các loại hạt được mệnh danh là “cường quốc chống oxy hóa” vì giàu chất này. Hạt điều sở hữu polyphenol và carotenoid – hai loại chất chống oxy hóa tốt cho sức khỏe. Chất chống oxy hóa là những hợp chất thực vật, có thể trung hòa các phân tử gây hại được gọi là các gốc tự do, giúp giảm viêm, tăng cường khả năng tự vệ của cơ thể, giúp bạn khỏe mạnh.</p>

            <h3>2. Hỗ trợ kiểm soát và giảm cân hiệu quả</h3>
            <p>Hạt điều có nguồn năng lượng cao hơn mặt bằng chung của rau củ quả. Tuy nhiên, nghiên cứu chỉ ra rằng cơ thể chúng ta chỉ hấp thụ khoảng 84% lượng kcal thực tế của chúng. Bên cạnh đó, hạt điều rất giàu protein và chất xơ, có tác dụng thúc đẩy cảm giác no lâu, đánh lừa cơ thể và giảm ham muốn thèm ăn xế từ đó giúp bạn ăn ít hơn và kiểm soát cân nặng tốt hơn. Do đó bạn nên ăn hạt điều ở mức độ vừa phải để đạt được hiệu quả tốt nhất.</p>

            <h3>3. Dễ dàng thêm vào chế độ ăn uống lành mạnh</h3>
            <p>Hạt điều được sử dụng để chế biến thành nhiều món ăn khác nhau. Chúng được chế biến thành món ăn vặt trực tiếp, như rang muối, tẩm mật ong,… Đôi khi chúng được sử dụng chung với các món bánh, như bánh kem, bánh cupcake. Ngoài ra, chúng còn kết hợp với sữa yogurt hoặc yến mạch để làm món xế chiều tốt cho cơ thể. Bên cạnh những món ăn trên, chúng còn được sử dụng để làm bơ hạt điều, ăn kèm bánh mì hoặc làm sữa hạt điều béo ngậy bổ sung dưỡng chất lành mạnh.</p>

            <h2>Lưu ý khi sử dụng hạt điều</h2>
            <p>Tuy hạt điều chứa lượng dinh dưỡng dồi dào, bạn nên tránh lạm dụng, đặc biệt là các loại hạt điều đã tẩm muối nhiều vì có thể chứa lượng natri cao không tốt cho huyết áp. Nên ưu tiên sử dụng hạt điều rang mộc tự nhiên hoặc sấy giòn không muối của Nutricore Tây Nguyên để bảo vệ tối đa sức khỏe cho cả gia đình.</p>
          `
        },
        {
          title: "Giá Trị Dinh Dưỡng Đặc Biệt Từ Hạt Mắc Ca",
          slug: "macadamia",
          category: "Hạt dinh dưỡng",
          image: "/Dinh_duong2.jpg",
          summary: "Hạt mắc ca là một nguồn cung cấp chất béo lành mạnh dồi dào, hỗ trợ giảm cholesterol...",
          content: `
            <p>Hạt mắc ca (Macadamia) được ví như "hoàng hậu" của các loại hạt khô không chỉ bởi giá trị kinh tế mà còn ở nguồn dưỡng chất khổng lồ. Mắc ca chứa lượng chất béo lành mạnh cao nhất trong các loại hạt, mang đến nguồn năng lượng dồi dào và nhiều lợi ích tim mạch vượt trội.</p>
            
            <h2>Giá trị dinh dưỡng bơ sữa tự nhiên</h2>
            <p>Trong nhân hạt mắc ca có chứa tới 78% là dầu tự nhiên, chất béo không bão hòa đơn tốt cho cơ thể, giúp quét sạch các cholesterol xấu bám quanh thành mạch máu. Ngoài ra, mắc ca còn là nguồn cung cấp dồi dào chất xơ, vitamin E, các khoáng chất quý hiếm như mangan, đồng, sắt và phốt pho.</p>

            <h2>Các công dụng chính đối với sức khỏe</h2>
            
            <h3>1. Bảo vệ sức khỏe hệ tim mạch</h3>
            <p>Nghiên cứu khoa học cho thấy ăn 8-40g hạt mắc ca mỗi ngày giúp giảm đáng kể mức cholesterol toàn phần và LDL. Axit béo omega-7 (axit palmitoleic) dồi dào trong mắc ca giúp tăng tuần hoàn máu và hạn chế tối đa nguy cơ xơ vữa động mạch.</p>

            <h3>2. Hỗ trợ hệ thần kinh và làm chậm lão hóa</h3>
            <p>Vitamin E nhóm tocotrienols và các chất chống oxy hóa tự nhiên trong mắc ca bảo vệ các tế bào brain/não khỏi sự phá hủy của các gốc tự do. Nhờ đó, sử dụng hạt mắc ca giúp cải thiện trí nhớ, tăng sự tỉnh táo và làm trẻ hóa làn da từ bên trong.</p>

            <h3>3. Cung cấp chất xơ tốt cho hệ tiêu hóa</h3>
            <p>Lượng chất xơ hòa tan dồi dào trong hạt mắc ca đóng vai trò như prebiotics nuôi dưỡng các lợi khuẩn đường ruột, hỗ trợ quá trình tiêu hóa diễn ra suôn sẻ, ngừa táo bón và các bệnh lý dạ dày.</p>
          `
        },
        {
          title: "Sức Khỏe Và Cacao Nguyên Chất",
          slug: "cacao",
          category: "Cà phê & Cacao",
          image: "/Dinh_duong3.jpg",
          summary: "Bột cacao nguyên chất rất giàu chất chống oxy hóa flavonoids, giúp cải thiện tâm trạng...",
          content: `
            <p>Cacao nguyên chất từ lâu đã được coi là "thức ăn của các vị thần" bởi hương vị thơm ngon và những tác dụng sinh học tuyệt vời đối với cơ thể con người. Cacao chứa hàm lượng flavonoids dồi dào – nhóm chất chống oxy hóa bảo vệ cơ thể khỏi nhiều bệnh lý mãn tính.</p>
            
            <h2>Hoạt chất Flavonoids chống oxy hóa mạnh mẽ</h2>
            <p>Bột cacao nguyên chất chưa qua kiềm hóa là một trong những nguồn thực phẩm giàu polyphenols nhất. Các chất này giúp tăng cường sản sinh oxit nitric trong máu, có tác dụng làm thư giãn các mạch máu, cải thiện lưu lượng máu và hỗ trợ hạ huyết áp hiệu quả.</p>

            <h2>Các công dụng chính đối với sức khỏe</h2>
            
            <h3>1. Nâng cao tâm trạng và giảm căng thẳng</h3>
            <p>Cacao có tác dụng kích thích giải phóng các chất dẫn truyền thần kinh hạnh phúc như serotonin và endorphin. Uống một tách cacao ấm giúp giảm thiểu căng thẳng, xoa dịu mệt mỏi tinh thần sau những giờ làm việc căng thẳng.</p>

            <h3>2. Tốt cho hoạt động tim mạch</h3>
            <p>Hợp chất flavanols trong cacao giúp ức chế quá trình kết tụ tiểu cầu, giảm nguy cơ hình thành các cục máu đông có thể dẫn đến đột quỵ hoặc suy tim mạch. Đồng thời nó cũng cân bằng mức đường huyết trong cơ thể.</p>

            <h3>3. Hỗ trợ kiểm soát mỡ thừa</h3>
            <p>Cacao giúp tăng cường quá trình chuyển hóa chất béo và sử dụng năng lượng của cơ thể. Nhờ có nhiều xơ, cacao tạo cảm giác no lâu, hạn chế các cơn thèm ngọt xế chiều rất hiệu quả cho quá trình ăn kiêng lành mạnh.</p>
          `
        },
        {
          title: "Thông Tin Dinh Dưỡng Về Cà Phê",
          slug: "coffee",
          category: "Cà phê & Cacao",
          image: "/ca_phe.png",
          summary: "Cà phê Robusta mộc chứa hàm lượng caffeine tự nhiên cao giúp tăng sự tập trung và tỉnh táo...",
          content: `
            <p>Cà phê Robusta mộc từ Tây Nguyên là một trong những thức uống phổ biến nhất toàn cầu không chỉ vì hương vị lôi cuốn mà còn ở các lợi ích sức khỏe đáng kinh ngạc. Trái ngược với suy nghĩ của nhiều người, cà phê sạch rất giàu chất chống oxy hóa và các hợp chất hoạt tính sinh học có lợi.</p>
            
            <h2>Nguồn dồi dào Axit Chlorogenic</h2>
            <p>Cà phê chứa một lượng lớn axit chlorogenic – nhóm chất chống oxy hóa phenolic mạnh. Hợp chất này giúp kiểm soát mỡ máu, tăng độ nhạy insulin của tế bào và chống lại sự tấn công của tế bào gốc tự do gây hại.</p>

            <h2>Các công dụng chính đối với sức khỏe</h2>
            
            <h3>1. Tăng cường sự tập trung và hiệu suất hoạt động</h3>
            <p>Caffeine trong cà phê ngăn chặn adenosine – một chất ức chế thần kinh trong não, dẫn đến tăng lượng dopamine và norepinephrine. Sự giải phóng này giúp cơ thể tràn trề sinh lực, tăng khả năng phản xạ và cải thiện trí nhớ ngắn hạn.</p>

            <h3>2. Thúc đẩy đốt cháy mỡ thừa và hỗ trợ tập luyện</h3>
            <p>Caffeine là một trong số ít các chất tự nhiên đã được chứng minh có khả năng hỗ trợ đốt cháy chất béo bằng cách tăng tỷ lệ trao đổi chất cơ bản lên 3-11%. Nó cũng giúp tăng nồng độ adrenaline trong máu, tối ưu hóa năng lượng cho các bài tập thể lực cường độ cao.</p>

            <h3>3. Hỗ trợ bảo vệ gan và phòng ngừa tiểu đường</h3>
            <p>Nhiều nghiên cứu chỉ ra rằng người uống cà phê sạch thường xuyên có nguy cơ mắc tiểu đường tuýp 2 thấp hơn đáng kể. Các enzyme trong cà phê sạch cũng góp phần bảo vệ gan, giảm men gan hiệu quả.</p>
          `
        }
      ];
      await Post.insertMany(initialArticles);
      console.log('Seeded 4 initial articles successfully.');
    }
  } catch (err) {
    console.error('Failed to seed initial articles:', err);
  }
}

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Seed initial posts if empty
    await seedInitialPosts();

    server.listen(PORT, () => {
      console.log('Server running on port ' + PORT);
      console.log('Socket.io ready');
    });

    // Handle port already in use
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Retrying in 1s...`);
        setTimeout(() => {
          server.close();
          server.listen(PORT);
        }, 1000);
      } else {
        throw err;
      }
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown so node --watch can release the port cleanly on restart
function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Closing server...`);
  server.closeAllConnections?.();
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('Server and MongoDB closed.');
      process.exit(0);
    });
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

if (require.main === module) {
  startServer();
}

module.exports = { app, server, startServer };
