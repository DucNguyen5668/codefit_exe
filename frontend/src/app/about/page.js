import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div>
      {/* Page Banner Banner */}
      <section className="page-banner">
        <div className="max-w-[1200px] mx-auto px-4 banner-inner">
          <h1 className="banner-title">Về Chúng Tôi</h1>
          <div className="breadcrumbs">
            <Link href="/">Trang chủ</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Về chúng tôi</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-4 section-padding">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Info Text */}
          <div className="flex-1 space-y-6">
            <span className="text-[#cfa006] uppercase tracking-wider font-bold text-xs">SỨ MỆNH NUTRICORE TÂY NGUYÊN</span>
            <h2 className="text-3xl font-extrabold text-gray-900 font-montserrat leading-tight">
              Đồng Hành Cùng Sức Khỏe Cộng Đồng Việt Nam
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Nutricore Tây Nguyên được ra đời từ khát khao nâng tầm giá trị nông sản Việt. Chúng tôi tập trung khai thác thế mạnh từ vùng nguyên liệu trù phú của đất đỏ bazan Tây Nguyên nắng gió, nơi sản sinh ra những hạt điều béo ngậy, hạt mắc ca giàu dinh dưỡng, hạt cà phê Robusta đậm vị và hạt cacao chất lượng hàng đầu.
            </p>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Mỗi sản phẩm mang thương hiệu Nutricore đều phải trải qua quy trình chế biến thủ công truyền thống nghiêm ngặt, giữ trọn vẹn tinh túy thiên nhiên nguyên bản nhất, đảm bảo tính sạch, an toàn vệ sinh thực phẩm trước khi tới tay người dùng.
            </p>

            {/* Core Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#45572f] text-white flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-heart text-sm"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Tận tâm phục vụ</h4>
                  <p className="text-xs text-gray-500">Sự hài lòng và sức khỏe của khách hàng là tôn chỉ hoạt động cao nhất của chúng tôi.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-[#45572f] text-white flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check text-sm"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">Chất lượng kiểm duyệt</h4>
                  <p className="text-xs text-gray-500">Nói không với chất bảo quản, phụ gia thực phẩm độc hại hay hương liệu nhân tạo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Image */}
          <div className="flex-1 max-w-lg lg:max-w-none rounded-2xl overflow-hidden shadow-lg border-8 border-gray-50">
            <img 
              src="/about_us1.jpg" 
              alt="Tây Nguyên cashew nut processing farm" 
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="bg-gray-50 py-16 border-t border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <span className="text-[#cfa006] uppercase tracking-wider font-bold text-xs">TẦM NHÌN PHÁT TRIỂN</span>
          <h3 className="text-2xl md:text-3xl font-bold font-montserrat text-gray-900 mt-2 mb-4">
            Đơn vị Eat Clean Hàng Đầu Việt Nam
          </h3>
          <p className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Nutricore Tây Nguyên hướng đến việc xây dựng chuỗi nông sản hữu cơ khép kín, bền vững từ trang trại liên kết của bà con nông dân Ê Đê tại Buôn Ma Thuột đến bàn ăn của mọi gia đình Việt. Chúng tôi nỗ lực thúc đẩy phong cách sống xanh, ăn sạch lành mạnh toàn diện.
          </p>
        </div>
      </section>
    </div>
  );
}
