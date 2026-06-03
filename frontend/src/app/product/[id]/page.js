"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function ProductDetail({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.id;
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const [addedMessage, setAddedMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get(`/products/${slug}`);
        setProduct(data.product);
        
        // Fetch all products for related section
        const allData = await api.get("/products");
        setAllProducts(allData.products || []);
      } catch (err) {
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-[#cfa006] mb-4"></i>
        <h2 className="text-2xl font-bold mb-2">Không Tìm Thấy Sản Phẩm</h2>
        <p className="text-gray-500 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã hết hàng.</p>
        <Link href="/products" className="btn btn-primary">QUAY LẠI CỬA HÀNG</Link>
      </div>
    );
  }

  const handleDecrease = () => { if (quantity > 1) setQuantity(quantity - 1); };
  const handleIncrease = () => { setQuantity(quantity + 1); };

  const handleAddToCart = (shouldRedirect = false) => {
    try {
      const savedCart = localStorage.getItem("nutricore_cart");
      let cart = savedCart ? JSON.parse(savedCart) : [];

      const existingIndex = cart.findIndex((item) => item.id === product._id);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({
          id: product._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          weight: product.weight,
          quantity: quantity,
        });
      }

      localStorage.setItem("nutricore_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));

      if (shouldRedirect) {
        router.push("/cart");
      } else {
        setAddedMessage(true);
        setTimeout(() => setAddedMessage(false), 3000);
      }
    } catch (e) {
      console.error("Cart action failed", e);
    }
  };

  const relatedProducts = allProducts.filter((p) => p._id !== product._id).slice(0, 3);
  const stockLabel = product.stockQty > 0 ? "Còn hàng" : "Hết hàng";

  return (
    <div>
      <section className="page-banner">
        <div className="max-w-[1200px] mx-auto px-4 banner-inner">
          <h1 className="banner-title text-xl md:text-2xl">{product.name}</h1>
          <div className="breadcrumbs text-xs md:text-sm">
            <Link href="/">Trang chủ</Link>
            <i className="fas fa-chevron-right"></i>
            <Link href="/products">Sản phẩm</Link>
            <i className="fas fa-chevron-right"></i>
            <span>Chi tiết</span>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 pb-16">
        <div className="detail-layout">
          <div className="detail-gallery flex items-center justify-center">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="detail-info">
            <h1 className="detail-title font-montserrat text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <div className="detail-price-box flex items-center gap-4">
              <span className="current-price text-2xl md:text-3xl font-bold text-[#45572f]">{product.price.toLocaleString("vi-VN")} đ</span>
              <span className="old-price text-lg text-gray-400 line-through">{product.oldPrice.toLocaleString("vi-VN")} đ</span>
            </div>

            <div className="detail-meta text-sm border-t border-b border-gray-100 py-6 my-4 space-y-3">
              <p>Thương hiệu: <strong className="text-[#45572f] font-semibold">{product.brand}</strong></p>
              <p>Xuất xứ: <strong>{product.origin}</strong></p>
              <p>Trọng lượng: <strong>{product.weight}</strong></p>
              <p>Tình trạng: <span className="bg-[#cbd5be] text-[#45572f] px-2 py-0.5 rounded text-xs font-semibold">{stockLabel}</span></p>
              {product.storage && <p className="text-gray-500 text-xs italic leading-relaxed mt-2">Hdsd: {product.storage}</p>}
            </div>

            <div className="detail-actions mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="qty-selector flex items-center justify-between border border-gray-300 rounded-full w-full sm:w-[140px] h-12 overflow-hidden bg-white">
                <button onClick={handleDecrease} className="qty-btn px-4 text-lg font-bold text-gray-600 hover:bg-gray-100 w-12 h-full flex items-center justify-center"><i className="fas fa-minus text-xs"></i></button>
                <input type="text" value={quantity} readOnly className="qty-input w-10 text-center font-bold text-gray-800 border-none outline-none text-base" />
                <button onClick={handleIncrease} className="qty-btn px-4 text-lg font-bold text-gray-600 hover:bg-gray-100 w-12 h-full flex items-center justify-center"><i className="fas fa-plus text-xs"></i></button>
              </div>
              <button onClick={() => handleAddToCart(false)} className="btn btn-secondary flex-1 h-12 rounded-full font-bold transition-all flex items-center justify-center gap-2 hover:bg-[#b7c4a7]"><i className="fas fa-cart-plus"></i> THÊM VÀO GIỎ</button>
              <button onClick={() => handleAddToCart(true)} className="btn btn-primary flex-1 h-12 rounded-full font-bold transition-all flex items-center justify-center gap-2 hover:bg-[#607a44]"><i className="fas fa-shopping-bag"></i> MUA NGAY</button>
            </div>

            {addedMessage && (
              <div className="bg-[#cbd5be] text-[#313e22] text-sm p-3 rounded-lg text-center font-medium mt-2 animate-fadeIn">
                <i className="fas fa-check-circle mr-2 text-[#45572f]"></i> Đã thêm sản phẩm vào giỏ hàng!
              </div>
            )}
          </div>
        </div>

        {/* Tab Description */}
        <div className="tab-container mt-12">
          <div className="tab-header flex border-b border-gray-200">
            <button onClick={() => setActiveTab("desc")} className={`tab-btn px-6 py-4 font-bold text-sm md:text-base border-none cursor-pointer flex-1 sm:flex-initial text-center ${activeTab === "desc" ? "active text-[#45572f] border-b-2 border-[#45572f] bg-white" : "text-gray-500 bg-gray-50"}`}>MÔ TẢ SẢN PHẨM</button>
            <button onClick={() => setActiveTab("policy")} className={`tab-btn px-6 py-4 font-bold text-sm md:text-base border-none cursor-pointer flex-1 sm:flex-initial text-center ${activeTab === "policy" ? "active text-[#45572f] border-b-2 border-[#45572f] bg-white" : "text-gray-500 bg-gray-50"}`}>CHÍNH SÁCH ĐỔI TRẢ</button>
          </div>
          <div className="tab-content active p-6 md:p-10 bg-white">
            {activeTab === "desc" ? (
              <div className="prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base space-y-4">
                <p>{product.desc}</p>
                {product.descImage && (
                  <div className="my-6 max-w-xl mx-auto rounded-lg overflow-hidden shadow-md">
                    <img src={product.descImage} alt={product.name} className="w-full h-auto object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-700 text-sm md:text-base space-y-4 leading-relaxed">
                <h4 className="font-bold text-gray-900 mb-2 uppercase text-xs md:text-sm text-[#45572f]">Những trường hợp được đổi – trả sản phẩm</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Sản phẩm bị vỡ, nứt hoặc hỏng hóc khi bạn nhận sản phẩm.</li>
                  <li>Nutricore Tây Nguyên giao nhầm sản phẩm cho bạn.</li>
                </ol>
                <p className="mt-3 text-xs md:text-sm text-gray-500 italic">Đổi trả sản phẩm phải được đảm bảo còn nguyên vẹn.</p>
                <h4 className="font-bold text-gray-900 mt-6 mb-2 uppercase text-xs md:text-sm text-[#45572f]">Thủ tục đổi trả</h4>
                <p>Liên hệ Hotline <strong>0886.147.878</strong> để được xử lý trong vòng tối đa 02 ngày làm việc.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold font-montserrat text-gray-900 border-b border-gray-100 pb-4 mb-6">Sản Phẩm Liên Quan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link href={`/product/${p.slug}`} key={p._id} className="product-card group">
                  <div className="product-img-wrapper relative">
                    <span className="product-badge">GIẢM 50%</span>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <h3 className="product-name text-gray-800 text-sm font-semibold line-clamp-1 mt-2 text-center group-hover:text-[#45572f] transition-colors">{p.name}</h3>
                  <div className="product-price mt-2">
                    <span className="current-price text-base font-bold text-gray-900">{p.price.toLocaleString("vi-VN")} đ</span>
                    <span className="old-price text-xs text-gray-400 line-through">{p.oldPrice.toLocaleString("vi-VN")} đ</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
