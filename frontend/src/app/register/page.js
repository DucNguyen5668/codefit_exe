"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PASSWORD_POLICY_MESSAGE = "Mật khẩu phải có ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số";
const isStrongPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError(PASSWORD_POLICY_MESSAGE);
      return;
    }

    setLoading(true);

    try {
      const data = await register(formData.name, formData.email, formData.password, formData.phone);
      const email = data.email || formData.email;
      router.push(`/register-confirm?email=${encodeURIComponent(email)}${redirect !== '/' ? '&redirect=' + encodeURIComponent(redirect) : ''}`);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card max-w-md mx-auto">
        <h2 className="auth-title font-montserrat">Tạo Tài Khoản</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm mb-4 animate-fadeIn">
            <i className="fas fa-exclamation-circle mr-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form space-y-4">
          <div className="form-group">
            <label className="block text-sm mb-1 text-gray-200">Họ và tên *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm mb-1 text-gray-200">Email *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="nhapemail@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm mb-1 text-gray-200">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              placeholder="09XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm mb-1 text-gray-200">Mật khẩu *</label>
            <input
              type="password"
              name="password"
              required
              placeholder="VD: Abc123"
              value={formData.password}
              onChange={handleChange}
              className="input-field w-full"
            />
            <p className="text-xs text-gray-300 mt-1">Ít nhất 6 ký tự, gồm chữ hoa, chữ thường và số.</p>
          </div>

          <div className="form-group">
            <label className="block text-sm mb-1 text-gray-200">Xác nhận mật khẩu *</label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent w-full py-3 rounded-full font-bold uppercase mt-6"
          >
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Đang tạo...</> : "ĐĂNG KÝ"}
          </button>
        </form>

        <p className="footer-link-text mt-6">
          Đã có tài khoản? <Link href={`/login${redirect !== '/' ? '?redirect=' + encodeURIComponent(redirect) : ''}`}>Đăng nhập tại đây</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="auth-card max-w-md mx-auto flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
