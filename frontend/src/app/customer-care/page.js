"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function CustomerCarePage() {
  const { isLoggedIn, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [errorSend, setErrorSend] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setLoadingSend(true);
    setErrorSend("");
    try {
      const content = `[Hỗ trợ Chăm sóc khách hàng]
- Họ tên: ${name}
- SĐT: ${phone}
- Email: ${email || "Không cung cấp"}
- Nội dung: ${message}`;

      await api.post("/messages/send", { content });
      setSubmitted(true);
      setMessage("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setErrorSend(err.message || "Gửi lời nhắn thất bại. Vui lòng thử lại!");
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <div>
      {/* Page Banner Banner */}
      <section className="page-banner">
        <div className="max-w-[1200px] mx-auto px-4 banner-inner">
          <h1 className="banner-title">Chăm Sóc Khách Hàng</h1>
          <div className="breadcrumbs">
            <Link href="/">Trang chủ</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Chăm sóc khách hàng</span>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-[1200px] mx-auto px-4 section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Info cards (Left col, span 1) */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold font-montserrat text-gray-900 border-b border-gray-100 pb-3 mb-6">
              Thông Tin Liên Hệ
            </h3>

            {/* Hotline card */}
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#45572f]/10 text-[#45572f] flex items-center justify-center flex-shrink-0 text-lg">
                <i className="fas fa-headset"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Đường dây nóng (Zalo)</h4>
                <p className="text-base font-bold text-[#45572f] mb-1">0886.147.878</p>
                <p className="text-xs text-gray-400">Thời gian làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 7)</p>
              </div>
            </div>

            {/* Email card */}
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#45572f]/10 text-[#45572f] flex items-center justify-center flex-shrink-0 text-lg">
                <i className="far fa-envelope"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Hòm thư hỗ trợ</h4>
                <p className="text-sm font-semibold text-gray-700 mb-1">support@nutricore.vn</p>
                <p className="text-xs text-gray-400">Chúng tôi phản hồi trong 24h làm việc.</p>
              </div>
            </div>

            {/* Address card */}
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#45572f]/10 text-[#45572f] flex items-center justify-center flex-shrink-0 text-lg">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">Địa chỉ trụ sở</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Khu Giáo dục và Đào tạo - Khu Công nghệ cao Hòa Lạc - km29 đại lộ Thăng Long, Thạch Thất, Hà Nội.
                </p>
              </div>
            </div>
          </div>

          {/* Form card (Right col, span 2) */}
          <div className="lg:col-span-2 bg-white border border-gray-200 shadow-xs rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold font-montserrat text-gray-900 border-b border-gray-100 pb-3 mb-6">
              Gửi Ý Kiến Phản Hồi
            </h3>
            
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Nếu bạn có bất kỳ câu hỏi nào về chính sách bán hàng, chất lượng sản phẩm, hoặc muốn hợp tác kinh doanh đại lý, hãy gửi lời nhắn cho chúng tôi.
            </p>

            {!isLoggedIn ? (
              <div className="bg-[#fbf8f1] border border-[#eadfce] text-[#75664e] text-sm p-8 rounded-2xl text-center font-bold shadow-xs">
                <i className="fas fa-lock text-3xl mb-3 block text-[#d8892b] animate-pulse"></i>
                <p className="text-base mb-4 font-montserrat">Vui lòng đăng nhập để gửi yêu cầu hỗ trợ</p>
                <Link
                  href="/login?redirect=/customer-care"
                  className="btn btn-primary px-8 py-3 rounded-full font-bold text-sm tracking-wider inline-flex items-center gap-2 hover:bg-[#607a44] transition-colors"
                >
                  Đăng nhập ngay <i className="fas fa-sign-in-alt text-xs"></i>
                </Link>
              </div>
            ) : submitted ? (
              <div className="bg-[#cbd5be] text-[#313e22] text-sm p-6 rounded-xl text-center font-medium animate-fadeIn border border-[#45572f]/20">
                <i className="fas fa-check-circle mr-2 text-2xl block mb-2 text-[#45572f]"></i>
                <h4 className="font-bold text-base mb-1">Gửi lời nhắn thành công!</h4>
                <p className="text-xs text-[#313e22]/80">Cảm ơn bạn đã liên hệ. Bộ phận chăm sóc khách hàng sẽ phản hồi bạn trong phần Tin nhắn sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorSend && (
                  <div className="bg-red-50 text-red-600 border border-red-100 text-xs p-3 rounded-lg font-bold">
                    <i className="fas fa-triangle-exclamation mr-1"></i> {errorSend}
                  </div>
                )}
                
                <div className="form-group">
                  <label className="text-gray-700 text-xs font-bold uppercase mb-1 block">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="text-gray-700 text-xs font-bold uppercase mb-1 block">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="09XXXXXXXX"
                      className="input-field"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-gray-700 text-xs font-bold uppercase mb-1 block">Email (Không bắt buộc)</label>
                    <input
                      type="email"
                      placeholder="a@gmail.com"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="text-gray-700 text-xs font-bold uppercase mb-1 block">Nội dung yêu cầu *</label>
                  <textarea
                    required
                    placeholder="Nhập nội dung bạn cần hỗ trợ hoặc phản hồi vào đây..."
                    rows="5"
                    className="input-field h-32 resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingSend}
                  className="btn btn-primary px-8 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase inline-flex items-center gap-2 hover:bg-[#607a44] transition-colors mt-2 disabled:opacity-60"
                >
                  {loadingSend ? (
                    <>Đang gửi... <i className="fas fa-spinner fa-spin text-xs"></i></>
                  ) : (
                    <>Gửi lời nhắn <i className="far fa-paper-plane text-xs"></i></>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
