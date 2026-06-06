"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get("/products");
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        // Fallback to empty
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero bg-center bg-cover md:bg-right"
        style={{ backgroundImage: `url('/homePage1.png')` }}
      >
        <div className="max-w-[1200px] mx-auto px-4 w-full flex justify-end">
          <div className="hero-content md:mr-10 md:ml-auto max-w-[500px]">
            <span className="hero-subtitle">NutriCore Tây Nguyên</span>
            <h1 className="hero-title mb-4">
              Năng Lượng Sạch <br />
              Cho Cuộc Sống Khỏe
            </h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
              Trải nghiệm các loại hạt dinh dưỡng, mắc ca sấy nứt vỏ, và bột cacao, cà phê nguyên chất chế biến thủ công từ thủ phủ nông sản Tây Nguyên.
            </p>
            <Link href="/products" className="btn btn-primary">
              MUA NGAY <i className="fas fa-shopping-basket ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Offers Section */}
      <section className="section-padding max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <span className="text-[#cfa006] uppercase tracking-wider font-bold text-xs">KHUYẾN MÃI HOT</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1 font-montserrat">Những Ưu Đãi Lớn Hôm Nay</h2>
          </div>
          <Link href="/products" className="text-[#45572f] hover:text-[#cfa006] font-bold text-sm flex items-center gap-2 mt-4 md:mt-0 transition-colors">
            Xem tất cả sản phẩm <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i>
          </div>
        ) : (
          <div className="product-grid-3 homepage-offers-grid">
            {products.slice(0, 4).map((product) => {
              const isSoldOut = product.stockQty <= 0;
              return (
                <Link href={`/product/${product.slug}`} key={product._id} className="product-card group relative">
                  <div className="product-img-wrapper relative">
                    {isSoldOut ? (
                      <span className="product-badge !bg-red-600 text-white font-bold">HẾT HÀNG</span>
                    ) : (
                      <span className="product-badge">GIẢM 50%</span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 transition-all">
                        <span className="bg-black/70 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl">SOLD OUT</span>
                      </div>
                    )}
                  </div>
                  <h3 className="product-name text-gray-800 line-clamp-2 min-h-[54px] flex items-center justify-center font-semibold text-center mt-2 group-hover:text-[#45572f] transition-colors">
                    {product.name}
                  </h3>
                  <div className="product-price mt-4">
                    <span className="current-price text-lg font-bold text-gray-900">
                      Giá: {product.price.toLocaleString("vi-VN")} đ
                    </span>
                    <span className="old-price text-sm text-gray-400 line-through">
                      {product.oldPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-100 text-center text-xs font-bold text-[#45572f] uppercase tracking-wider group-hover:text-[#cfa006] transition-colors">
                    Xem chi tiết
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features section-padding">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="features-inner">
            <div className="features-content">
              <span className="text-[#cfa006] uppercase tracking-wider font-bold text-xs">VỀ CHÚNG TÔI</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-1 mb-6 font-montserrat">Tại sao chọn chúng tôi !</h2>
              <p className="features-desc">
                Tây Nguyên đề cao các giá trị cốt lõi tập trung vào sức khỏe, sự tiện lợi và tính minh bạch.
              </p>

              <div className="feature-item">
                <div className="feature-icon"><i className="fas fa-dollar-sign"></i></div>
                <div className="feature-text">
                  <h4>Giá cả phải chăng</h4>
                  <p>NutriCore Tây Nguyên - Việt Nam hướng đến mục tiêu trở thành đơn vị cung cấp thực phẩm eat clean hàng đầu Việt Nam và luôn hướng khách hàng tin tưởng, lựa chọn.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon"><i className="fas fa-leaf"></i></div>
                <div className="feature-text">
                  <h4>Hương vị phù hợp</h4>
                  <p>Quy trình chế biến sản phẩm đều là thủ công, hợp vệ sinh, được làm tại các làng nghề thủ công truyền thống.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon"><i className="fas fa-truck"></i></div>
                <div className="feature-text">
                  <h4>Giao hàng nhanh chóng</h4>
                  <p>NutriCore Tây Nguyên - Việt Nam hợp tác với các đơn vị trong nước và ngoài nước, đảm bảo hàng hóa luôn tươi mới khi đến tay khách hàng.</p>
                </div>
              </div>
            </div>

            <div className="features-image hidden lg:block">
              <img src="/home_Page3.jpg" alt="Nutricore Farms" />
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục sản phẩm Section */}
      <section className="section-padding max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 font-montserrat">Danh mục sản phẩm</h2>
        </div>

        {!loading && (
          <div className="product-grid-4">
            {products.slice(0, 4).map((product) => {
              const isSoldOut = product.stockQty <= 0;
              return (
                <Link href={`/product/${product.slug}`} key={product._id} className="product-card small-card group relative">
                  <div className="product-img-wrapper relative">
                    {isSoldOut && (
                      <span className="product-badge !bg-red-600 text-white font-bold z-20">HẾT HÀNG</span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 transition-all">
                        <span className="bg-black/70 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl">SOLD OUT</span>
                      </div>
                    )}
                  </div>
                  <h3 className="product-name text-gray-800 font-semibold text-center mt-2 group-hover:text-[#45572f] transition-colors">
                    {product.name}
                  </h3>
                  <div className="product-price mt-2">
                    <span className="current-price text-base font-bold text-gray-900">
                      Giá: {product.price.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Nutrition Promotion Section */}
      <section className="section-padding max-w-[1200px] mx-auto px-4">
        <div className="nutrition-box" style={{ backgroundColor: '#0d6938' }}>
          <div className="nutrition-content">
            <span className="text-[#cfa006] font-bold tracking-wider text-sm mb-2">DINH DƯỠNG CƠ THỂ</span>
            <h3>Giá trị dinh dưỡng</h3>
            <p>
              Hạt điều sấy là một loại thực phẩm giàu dinh dưỡng, chứa nhiều protein thực vật, chất béo không bão hòa và các khoáng chất như magie, sắt, kẽm và đồng. Loại hạt này giúp bổ sung năng lượng, hỗ trợ hoạt động của não bộ và tốt cho tim mạch. Ngoài ra, hạt điều còn tạo cảm giác no lâu nên thường được dùng trong chế độ ăn lành mạnh. Tuy nhiên, hạt điều có lượng calo khá cao nên cần sử dụng với lượng vừa phải, đặc biệt là các loại rang muối vì có thể chứa nhiều natri...
            </p>
            <Link href="/nutrition" className="btn btn-secondary text-sm px-6 py-3 font-semibold rounded-full hover:bg-gray-100 transition-colors" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
              Tìm hiểu thêm bài viết <i className="fas fa-chevron-right ml-2 text-xs"></i>
            </Link>
          </div>
          <div className="nutrition-image hidden md:block">
            <img src="/hom_Page2.jpg" alt="Cashew nutrition details" />
          </div>
        </div>
      </section>
    </div>
  );
}
