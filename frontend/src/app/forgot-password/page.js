"use client";

import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await api.forgotPassword(email);
      setMessage(data.message || "Nếu email tồn tại, hệ thống sẽ gửi liên kết đặt lại mật khẩu.");
    } catch (err) {
      setError(err.message || "Không thể gửi email đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card max-w-md mx-auto">
        <h1 className="auth-title font-montserrat">Quên Mật Khẩu</h1>
        <p className="text-gray-300 text-sm text-center mb-6">
          Nhập email tài khoản để nhận liên kết đặt lại mật khẩu.
        </p>

        {message && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-100 p-3 rounded-lg text-sm mb-4 animate-fadeIn">
            <i className="fas fa-check-circle mr-2"></i>{message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm mb-4 animate-fadeIn">
            <i className="fas fa-exclamation-circle mr-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form space-y-4">
          <div className="form-group">
            <label className="block text-sm mb-1 text-gray-200">Địa chỉ Email *</label>
            <input
              type="email"
              required
              placeholder="nhapemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent w-full py-3 rounded-full font-bold uppercase mt-6"
          >
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Đang gửi...</> : "GỬI LINK ĐẶT LẠI"}
          </button>
        </form>

        <p className="footer-link-text mt-6">
          Nhớ mật khẩu? <Link href="/login">Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
