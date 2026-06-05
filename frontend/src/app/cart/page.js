"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const readSavedCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const savedCart = localStorage.getItem("nutricore_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    console.error("Failed to read cart data", e);
    return [];
  }
};

const readSavedDiscount = () => {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem("nutricore_discount") || 0);
};

export default function ShoppingCart() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCartItems(readSavedCart());
    const discount = readSavedDiscount();
    if (discount) {
      setCouponCode("NUTRICORE50");
      setDiscountPercent(discount);
      setCouponSuccess("Đã áp dụng mã coupon giảm giá 10%!");
    }
  }, []);


  const saveCart = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem("nutricore_cart", JSON.stringify(newItems));
    // Dispatch event to update layout header badge
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleDecrease = (id) => {
    const updated = cartItems.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleIncrease = (id) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleDelete = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (couponCode.trim().toUpperCase() === "NUTRICORE50") {
      setDiscountPercent(10);
      setCouponSuccess("Áp dụng thành công mã NUTRICORE50! Giảm giá 10% trên tổng hóa đơn.");
      localStorage.setItem("nutricore_discount", "10");
    } else {
      setCouponError("Mã coupon không đúng hoặc đã hết hạn.");
      setDiscountPercent(0);
      localStorage.removeItem("nutricore_discount");
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Save totals to localStorage so checkout can read them
    localStorage.setItem("nutricore_order_subtotal", subtotal.toString());
    localStorage.setItem("nutricore_order_discount", discountAmount.toString());
    localStorage.setItem("nutricore_order_total", total.toString());
    
    if (!isLoggedIn) {
      router.push("/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div>
{/* Cart Grid */}
      <section className="max-w-[1200px] mx-auto px-4 section-padding">
        {!mounted ? (
          <div className="flex justify-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg max-w-xl mx-auto border border-gray-100">
            <i className="fas fa-shopping-cart text-5xl text-gray-300 mb-4 animate-bounce"></i>
            <h2 className="text-xl font-bold mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-500 mb-6 text-sm">Hãy quay lại cửa hàng và chọn những sản phẩm bổ dưỡng nhất.</p>
            <Link href="/products" className="btn btn-primary px-8 py-3 rounded-full font-bold">
              ĐẾN CỬA HÀNG <i className="fas fa-arrow-right ml-2 text-xs"></i>
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Column 1: Items table */}
            <div className="overflow-x-auto">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Tổng cộng</th>
                    <th className="text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="cart-product-cell">
                          <img src={item.image} alt={item.name} className="cart-product-img" />
                          <div className="cart-product-info">
                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">Đơn vị: {item.weight} | {item.price.toLocaleString("vi-VN")} đ</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="qty-selector flex items-center border border-gray-300 rounded-full w-[110px] h-9 overflow-hidden bg-white">
                          <button onClick={() => handleDecrease(item.id)} className="qty-btn w-9 h-full flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100">
                            <i className="fas fa-minus text-[10px]"></i>
                          </button>
                          <span className="w-8 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
                          <button onClick={() => handleIncrease(item.id)} className="qty-btn w-9 h-full flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100">
                            <i className="fas fa-plus text-[10px]"></i>
                          </button>
                        </div>
                      </td>
                      <td className="font-bold text-gray-800">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                      </td>
                      <td className="text-center">
                        <button onClick={() => handleDelete(item.id)} className="cart-delete-btn" aria-label="Xóa sản phẩm">
                          <i className="far fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 flex justify-between items-center">
                <Link href="/products" className="btn btn-white rounded-full font-bold text-sm px-6 py-2.5">
                  <i className="fas fa-chevron-left mr-2 text-xs"></i> TIẾP TỤC MUA SẮM
                </Link>
              </div>
            </div>

            {/* Column 2: Order Box Summary */}
            <div className="cart-summary-box self-start">
              <h3 className="summary-title">Thông tin đơn hàng</h3>
              
              <div className="space-y-4 mb-6">
                <div className="summary-row">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-bold text-gray-800">{subtotal.toLocaleString("vi-VN")} đ</span>
                </div>

                {discountPercent > 0 && (
                  <div className="summary-row text-red-500">
                    <span>Giảm giá (10%):</span>
                    <span className="font-bold">-{discountAmount.toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
                
                <div className="summary-row total">
                  <span>Tổng tiền:</span>
                  <span>{total.toLocaleString("vi-VN")} đ</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="coupon-box">
                <input
                  type="text"
                  placeholder="Mã giảm giá..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="text-sm rounded"
                />
                <button type="submit" className="btn btn-secondary text-xs px-4 rounded font-bold hover:bg-[#b7c4a7]">
                  ÁP DỤNG
                </button>
              </form>

              {couponError && <p className="text-red-500 text-xs font-semibold mb-4 animate-fadeIn">{couponError}</p>}
              {couponSuccess && <p className="text-[#45572f] text-xs font-semibold mb-4 animate-fadeIn">{couponSuccess}</p>}

              <button 
                onClick={handleProceedToCheckout}
                className="btn btn-primary w-full py-3.5 rounded-full font-bold text-sm tracking-wider uppercase"
              >
                TIẾN HÀNH THANH TOÁN <i className="fas fa-arrow-right ml-2 text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
