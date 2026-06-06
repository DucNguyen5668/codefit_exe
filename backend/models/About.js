const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  missionSubtitle: {
    type: String,
    required: true,
    default: "SỨ MỆNH NUTRICORE TÂY NGUYÊN"
  },
  missionTitle: {
    type: String,
    required: true,
    default: "Đồng Hành Cùng Sức Khỏe Cộng Đồng Việt Nam"
  },
  missionParagraphs: {
    type: [String],
    required: true,
    default: [
      "Nutricore Tây Nguyên được ra đời từ khát khao nâng tầm giá trị nông sản Việt. Chúng tôi tập trung khai thác thế mạnh từ vùng nguyên liệu trù phú của đất đỏ bazan Tây Nguyên nắng gió, nơi sản sinh ra những hạt điều béo ngậy, hạt mắc ca giàu dinh dưỡng, hạt cà phê Robusta đậm vị và hạt cacao chất lượng hàng đầu.",
      "Mỗi sản phẩm mang thương hiệu Nutricore đều phải trải qua quy trình chế biến thủ công truyền thống nghiêm ngặt, giữ trọn vẹn tinh túy thiên nhiên nguyên bản nhất, đảm bảo tính sạch, an toàn vệ sinh thực phẩm trước khi tới tay người dùng."
    ]
  },
  coreValues: {
    type: [{
      icon: { type: String, default: "fas fa-heart" },
      title: { type: String, required: true },
      description: { type: String, required: true }
    }],
    required: true,
    default: [
      { icon: "fas fa-heart", title: "Tận tâm phục vụ", description: "Sự hài lòng và sức khỏe của khách hàng là tôn chỉ hoạt động cao nhất của chúng tôi." },
      { icon: "fas fa-check", title: "Chất lượng kiểm duyệt", description: "Nói không với chất bảo quản, phụ gia thực phẩm độc hại hay hương liệu nhân tạo." }
    ]
  },
  visionSubtitle: {
    type: String,
    required: true,
    default: "TẦM NHÌN PHÁT TRIỂN"
  },
  visionTitle: {
    type: String,
    required: true,
    default: "Đơn vị Eat Clean Hàng Đầu Việt Nam"
  },
  visionDescription: {
    type: String,
    required: true,
    default: "Nutricore Tây Nguyên hướng đến việc xây dựng chuỗi nông sản hữu cơ khép kín, bền vững từ trang trại liên kết của bà con nông dân Ê Đê tại Buôn Ma Thuột đến bàn ăn của mọi gia đình Việt. Chúng tôi nỗ lực thúc đẩy phong cách sống xanh, ăn sạch lành mạnh toàn diện."
  },
  images: {
    type: [String],
    required: true,
    default: ["/about_us1.jpg"]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
