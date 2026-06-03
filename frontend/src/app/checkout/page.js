"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formError, setFormError] = useState("");
  const [placing, setPlacing] = useState(false);

  // If not logged in, redirect to login page
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login?redirect=/checkout");
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    if (loading || !isLoggedIn) return;

    const loadCheckoutState = () => {
      try {
        const savedCart = localStorage.getItem("nutricore_cart");
        if (savedCart) {
          const items = JSON.parse(savedCart);
          if (items.length === 0) {
            router.push("/cart");
            return;
          }

          const savedSubtotal = localStorage.getItem("nutricore_order_subtotal");
          const savedDiscount = localStorage.getItem("nutricore_order_discount");
          const savedTotal = localStorage.getItem("nutricore_order_total");

          setCartItems(items);
          if (savedTotal) {
            setSubtotal(Number(savedSubtotal));
            setDiscount(Number(savedDiscount));
            setTotal(Number(savedTotal));
          } else {
            const s = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            setSubtotal(s);
            setTotal(s);
          }
        } else {
          router.push("/cart");
        }
      } catch (e) {
        console.error("Failed to load checkout state", e);
      }
    };

    queueMicrotask(loadCheckoutState);
  }, [loading, isLoggedIn, router]);

  // Pre-fill user info
  useEffect(() => {
    if (!user) return;

    queueMicrotask(() => {
      setFullName((current) => current || user.name || "");
      setPhone((current) => current || user.phone || "");
      setEmail((current) => current || user.email || "");
      setAddress((current) => current || user.address || "");
    });
  }, [user]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!fullName || !phone || !address) {
      setFormError("Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc (*).");
      return;
    }

    setPlacing(true);

    try {
      // Create order via API
      const orderData = {
        items: cartItems.map(item => ({
          product: item.productId || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          weight: item.weight || '',
          image: item.image || ''
        })),
        subtotal,
        discount,
        total,
        paymentMethod,
        shippingInfo: {
          fullName,
          phone,
          email,
          address,
          note
        }
      };

      const result = await api.post("/orders", orderData);
      const order = result.order;

      // Clear cart
      localStorage.removeItem("nutricore_cart");
      localStorage.removeItem("nutricore_discount");
      localStorage.removeItem("nutricore_order_subtotal");
      localStorage.removeItem("nutricore_order_discount");
      localStorage.removeItem("nutricore_order_total");
      window.dispatchEvent(new Event("cartUpdated"));

      if (paymentMethod === "payos") {
        // Create PayOS payment link
        try {
          const paymentResult = await api.post("/payment/create-payos-link", {
            orderCode: order.orderCode,
            amount: order.total,
            description: `Nutricore #${order.orderCode}`
          });

          if (paymentResult.checkoutUrl) {
            window.location.href = paymentResult.checkoutUrl;
            return;
          }
        } catch (payErr) {
          // Fallback to success page if PayOS fails
          console.error("PayOS error:", payErr);
          router.push(`/payment-result?orderCode=${order.orderCode}&status=pending`);
          return;
        }
      }

      // COD or fallback
      router.push(`/payment-result?orderCode=${order.orderCode}&status=success`);
    } catch (e) {
      console.error("Order submission failed", e);
      setFormError(e.message || "Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#45572f] border-t-transparent mb-4"></div>
        <p className="text-gray-500 font-medium font-montserrat">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      {/* Page Banner */}
      <section className="page-banner">
        <div className="max-w-[1200px] mx-auto px-4 banner-inner">
          <h1 className="banner-title">Thanh Toán</h1>
          <div className="breadcrumbs">
            <Link href="/">Trang chủ</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <Link href="/cart">Giỏ hàng</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Thanh toán</span>
          </div>
        </div>
      </section>

      {/* Checkout Grid */}
      <section className="max-w-[1200px] mx-auto px-4 section-padding">
        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          {/* Column 1: Billing & Delivery form */}
          <div className="space-y-6">
            <div className="checkout-section">
              <h3>Thông tin giao hàng</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="text-gray-700">Họ và tên *</label>
                  <input type="text" required placeholder="Nguyễn Văn A" className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="text-gray-700">Số điện thoại *</label>
                    <input type="tel" required placeholder="09XXXXXXXX" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="text-gray-700">Email (Không bắt buộc)</label>
                    <input type="email" placeholder="a@gmail.com" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="text-gray-700">Địa chỉ nhận hàng *</label>
                  <input type="text" required placeholder="Số nhà, đường phố, phường/xã, quận/huyện, thành phố..." className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>

                <div className="form-group">
                  <label className="text-gray-700">Ghi chú đơn hàng</label>
                  <textarea placeholder="Lưu ý thêm cho đơn vị vận chuyển..." rows="3" className="input-field h-24 resize-none" value={note} onChange={(e) => setNote(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="checkout-section">
              <h3>Phương thức thanh toán</h3>
              <div className="radio-group">
                {/* COD */}
                <label onClick={() => setPaymentMethod("cod")} className={`radio-option ${paymentMethod === "cod" ? "border-[#45572f] bg-gray-50" : ""}`}>
                  <input type="radio" name="payment" checked={paymentMethod === "cod"} readOnly />
                  <div className="radio-text">
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <i className="fas fa-truck text-[#45572f]"></i> Thanh toán khi nhận hàng (COD)
                    </div>
                    <div className="radio-sub mt-1">Quý khách thanh toán trực tiếp cho nhân viên giao hàng khi nhận sản phẩm.</div>
                  </div>
                </label>

                {/* PayOS */}
                <label onClick={() => setPaymentMethod("payos")} className={`radio-option ${paymentMethod === "payos" ? "border-[#45572f] bg-gray-50" : ""}`}>
                  <input type="radio" name="payment" checked={paymentMethod === "payos"} readOnly />
                  <div className="radio-text">
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <i className="fas fa-credit-card text-[#45572f]"></i> Thanh toán qua PayOS
                    </div>
                    <div className="radio-sub mt-1">Thanh toán online an toàn qua cổng thanh toán PayOS (QR, thẻ ngân hàng, ví điện tử).</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Column 2: Order Summary */}
          <div>
            <div className="checkout-order-box self-start">
              <h3 className="text-lg font-bold font-montserrat text-gray-900 mb-6 border-b border-gray-100 pb-3">Đơn hàng của bạn</h3>
              
              <div className="checkout-order-items max-h-[220px] overflow-y-auto pr-2 space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item flex justify-between items-center text-sm pb-2 border-b border-gray-100">
                    <div>
                      <h5 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h5>
                      <span className="text-xs text-gray-500">Số lượng: {item.quantity} x {item.price.toLocaleString("vi-VN")} đ</span>
                    </div>
                    <span className="font-bold text-gray-800">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-b border-gray-100 pb-6 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">{subtotal.toLocaleString("vi-VN")} đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Mã coupon giảm giá:</span>
                    <span className="font-semibold">-{discount.toLocaleString("vi-VN")} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-[#45572f] font-bold">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-8">
                <span>Tổng cộng:</span>
                <span className="text-xl text-[#45572f]">{total.toLocaleString("vi-VN")} đ</span>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg font-semibold mb-4 animate-fadeIn">
                  <i className="fas fa-exclamation-circle mr-2"></i> {formError}
                </div>
              )}

              <button type="submit" disabled={placing} className="btn btn-primary w-full py-4 rounded-full font-bold text-sm tracking-wider uppercase">
                {placing ? (
                  <><i className="fas fa-spinner fa-spin mr-2"></i>Đang xử lý...</>
                ) : paymentMethod === "payos" ? (
                  <>THANH TOÁN QUA PAYOS <i className="fas fa-credit-card ml-2 text-xs"></i></>
                ) : (
                  <>ĐẶT HÀNG NGAY <i className="fas fa-check-double ml-2 text-xs"></i></>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
