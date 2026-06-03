require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: "Hạt điều sấy giòn vị muối",
    slug: "hat-dieu-say-gion-vi-muoi",
    price: 18000,
    oldPrice: 36000,
    image: "/homePage1.png",
    weight: "800g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 100,
    storage: "Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. Đậy kín sau khi sử dụng.",
    desc: "Hạt điều sấy giòn của Nutricore Tây Nguyên được tuyển chọn kỹ càng từ những hạt điều chất lượng xuất khẩu tại vùng Tây Nguyên nắng gió. Trải qua quy trình chế biến thủ công hợp vệ sinh, hạt điều giữ nguyên vị béo ngậy, bùi bùi đặc trưng kết hợp với một chút muối tinh khiết tạo nên hương vị đậm đà khó cưỡng.",
    descImage: "/homePage1.png",
    category: "nuts"
  },
  {
    name: "Hạt mắc ca sấy nứt vỏ",
    slug: "hat-mac-ca-say-nut-vo",
    price: 18000,
    oldPrice: 36000,
    image: "/hom_Page2.jpg",
    weight: "500g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 100,
    storage: "Để nơi khô ráo, thoáng mát, tránh ẩm ướt và ánh nắng trực tiếp.",
    desc: "Hạt mắc ca nứt vỏ sấy nứt tự nhiên của Nutricore Tây Nguyên chứa lượng dầu tự nhiên dồi dào, vị ngậy béo tinh khiết tựa bơ sữa. Sản phẩm giàu axit béo omega-7 và các khoáng chất có lợi cho tim mạch và làn da.",
    descImage: "/hom_Page2.jpg",
    category: "nuts"
  },
  {
    name: "Cà phê Robusta nguyên chất",
    slug: "ca-phe-robusta-nguyen-chat",
    price: 18000,
    oldPrice: 36000,
    image: "/ca_phe.png",
    weight: "500g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 100,
    storage: "Để nơi khô ráo, thoáng mát. Kéo khóa zip sau khi sử dụng.",
    desc: "Cà phê Robusta hạt rang mộc của Nutricore Tây Nguyên được chế biến từ những quả cà phê chín mọng từ các nông trại bền vững tại Buôn Ma Thuột.",
    descImage: "/ca_phe.png",
    category: "coffee_cacao"
  },
  {
    name: "Bột Cacao nguyên chất",
    slug: "bot-cacao-nguyen-chat",
    price: 18000,
    oldPrice: 36000,
    image: "/home_Page3.jpg",
    weight: "500g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 100,
    storage: "Để nơi khô ráo, thoáng mát, tránh ẩm ướt và côn trùng.",
    desc: "Bột Cacao nguyên chất 100% của Nutricore Tây Nguyên được nghiền mịn từ hạt cacao tuyển chọn sau quá trình lên men và sấy khô tự nhiên.",
    descImage: "/home_Page3.jpg",
    category: "coffee_cacao"
  },
  {
    name: "Hạt điều sấy giòn tỏi ớt",
    slug: "hat-dieu-say-gion-toi-ot",
    price: 22000,
    oldPrice: 44000,
    image: "/homePage1.png",
    weight: "500g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 80,
    storage: "Để nơi khô ráo, thoáng mát...",
    desc: "Hạt điều tỏi ớt cay cay đậm đà.",
    descImage: "/homePage1.png",
    category: "nuts"
  },
  {
    name: "Hạt mắc ca VIP chọn lọc",
    slug: "hat-mac-ca-vip-chon-loc",
    price: 32000,
    oldPrice: 60000,
    image: "/hom_Page2.jpg",
    weight: "1kg",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 50,
    storage: "Để nơi khô ráo...",
    desc: "Hạt mắc ca VIP vỏ mỏng nhân to ngon.",
    descImage: "/hom_Page2.jpg",
    category: "nuts"
  },
  {
    name: "Cà phê Arabica Cầu Đất",
    slug: "ca-phe-arabica-cau-dat",
    price: 25000,
    oldPrice: 50000,
    image: "/ca_phe.png",
    weight: "250g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 120,
    storage: "Để nơi khô ráo...",
    desc: "Cà phê Arabica thơm nhẹ chua thanh.",
    descImage: "/ca_phe.png",
    category: "coffee_cacao"
  },
  {
    name: "Socola đen Tây Nguyên 75%",
    slug: "socola-den-tay-nguyen-75",
    price: 35000,
    oldPrice: 70000,
    image: "/home_Page3.jpg",
    weight: "100g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 200,
    storage: "Bảo quản ngăn mát tủ lạnh.",
    desc: "Socola đen 75% vị đắng dịu tự nhiên.",
    descImage: "/home_Page3.jpg",
    category: "coffee_cacao"
  },
  {
    name: "Hạt dẻ cười rang muối",
    slug: "hat-de-cuoi-rang-muoi",
    price: 45000,
    oldPrice: 90000,
    image: "/homePage1.png",
    weight: "400g",
    origin: "Mỹ",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 90,
    storage: "Đậy kín nắp sau khi dùng.",
    desc: "Hạt dẻ cười thơm ngon, bùi béo.",
    descImage: "/homePage1.png",
    category: "nuts"
  },
  {
    name: "Hạt hạnh nhân sấy mộc",
    slug: "hat-hanh-nhan-say-moc",
    price: 40000,
    oldPrice: 80000,
    image: "/hom_Page2.jpg",
    weight: "500g",
    origin: "Mỹ",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 110,
    storage: "Bảo quản nơi khô ráo.",
    desc: "Hạnh nhân chín giòn sấy mộc tự nhiên.",
    descImage: "/hom_Page2.jpg",
    category: "nuts"
  },
  {
    name: "Cà phê Blend Robusta-Arabica",
    slug: "ca-phe-blend-robusta-arabica",
    price: 20000,
    oldPrice: 40000,
    image: "/ca_phe.png",
    weight: "500g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 150,
    storage: "Để nơi khô ráo...",
    desc: "Cà phê blend tỉ lệ vàng giữa Robusta đậm đà và Arabica thanh thoát.",
    descImage: "/ca_phe.png",
    category: "coffee_cacao"
  },
  {
    name: "Hạt bí xanh sấy giòn",
    slug: "hat-bi-xanh-say-gion",
    price: 15000,
    oldPrice: 30000,
    image: "/homePage1.png",
    weight: "500g",
    origin: "Việt Nam",
    brand: "NUTRICORE TÂY NGUYÊN",
    stockQty: 300,
    storage: "Tránh ẩm ướt.",
    desc: "Hạt bí tách vỏ sấy chín giòn béo bùi.",
    descImage: "/homePage1.png",
    category: "other"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@nutricore.vn' });
    if (!existingAdmin) {
      const admin = new User({
        name: 'Admin Nutricore',
        email: 'admin@nutricore.vn',
        password: 'admin123456',
        role: 'admin',
        phone: '0886147878'
      });
      await admin.save();
      console.log('✅ Admin user created: admin@nutricore.vn / admin123456');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Overwrite products to update image paths to public images
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded and updated with local public image paths`);

    console.log('\n🎉 Seed completed!');
    console.log('Admin login: admin@nutricore.vn / admin123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
