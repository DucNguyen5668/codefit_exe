"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

const PASSWORD_POLICY_MESSAGE = "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số";
const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Liên kết đặt lại mật khẩu thiếu mã token.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(PASSWORD_POLICY_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const data = await api.resetPassword(token, password);
      setMessage(data.message || "Đặt lại mật khẩu thành công.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Không thể đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card max-w-md mx-auto">
        <h1 className="auth-title font-montserrat">Đặt Lại Mật Khẩu</h1>
        <p className="text-gray-300 text-sm text-center mb-6">
          Tạo mật khẩu mới cho tài khoản Nutricore của bạn.
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
            <label className="block text-sm mb-1 text-gray-200">Mật khẩu mới *</label>
            <input
              type="password"
              required
              placeholder="VD: Abc123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
            />
            <p className="text-xs text-gray-300 mt-1">Ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số.</p>
          </div>

          <div className="form-group">
            <label className="block text-sm mb-1 text-gray-200">Xác nhận mật khẩu *</label>
            <input
              type="password"
              required
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="btn btn-accent w-full py-3 rounded-full font-bold uppercase mt-6 disabled:opacity-60"
          >
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Đang cập nhật...</> : "CẬP NHẬT MẬT KHẨU"}
          </button>
        </form>

        <p className="footer-link-text mt-6">
          Đã cập nhật? <Link href="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="auth-container"><div className="auth-card max-w-md mx-auto text-center">Đang tải...</div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
