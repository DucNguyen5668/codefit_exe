"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="footer">
      <div className="max-w-[1200px] mx-auto px-4 footer-inner">
        {/* Column 1: Logo and Socials */}
        <div className="logo-col">
          <Link href="/" className="outline-none flex items-center mb-4">
            <img 
              src="/logo_footer.png" 
              alt="Nutricore Tây Nguyên Logo" 
              className="w-[180px] h-[180px] object-contain filter brightness-95 hover:brightness-100 transition-all" 
            />
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Đừng bỏ lỡ những sản phẩm và chương trình khuyến mãi hấp dẫn của Nutricore Tây Nguyên - Việt Nam.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Column 2: Contact Info */}
        <div className="contact-col">
          <h4>LIÊN HỆ CHÚNG TÔI</h4>
          <ul className="space-y-4">
            <li className="flex items-start">
              <i className="fas fa-map-marker-alt text-[#cfa006] mt-1 flex-shrink-0"></i>
              <span>Khu Giáo dục và Đào tạo - Khu Công nghệ cao Hòa Lạc - km29 đại lộ Thăng Long, Thạch Thất, Hà Nội, Việt Nam.</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-phone-alt text-[#cfa006] mt-1 flex-shrink-0"></i>
              <div>
                <p className="font-semibold text-white">Hotline/Zalo: 0886.147.878</p>
                <p className="text-xs text-gray-400">Thời gian làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 7)</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div className="subscribe-col">
          <h4>ĐĂNG KÝ NHẬN KHUYẾN MÃI</h4>
          <p>Để lại email để nhận thông tin khuyến mãi và các bài viết chia sẻ về dinh dưỡng mới nhất.</p>
          {subscribed ? (
            <div className="bg-[#45572f] text-white p-3 rounded-lg text-sm text-center font-medium animate-fadeIn">
              <i className="fas fa-check-circle mr-2"></i> Đăng ký thành công! Cảm ơn bạn.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-gray-800"
              />
              <button type="submit">ĐĂNG KÝ</button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="max-w-[1200px] mx-auto px-4">
          <p>Bản quyền © 2026 thuộc về Nutricore Tây Nguyên - Việt Nam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
