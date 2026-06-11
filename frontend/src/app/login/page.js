"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      router.push(data.user?.role === "admin" ? "/admin" : redirect);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { isConfigured, auth, googleProvider } = await import("@/lib/firebase");

      if (!isConfigured || !auth || !googleProvider) {
        throw new Error("Firebase chưa được cấu hình. Vui lòng thêm NEXT_PUBLIC_FIREBASE_* trong frontend/.env.local.");
      }

      const { signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const data = await googleLogin({ idToken });
      router.push(data.user?.role === "admin" ? "/admin" : redirect);
    } catch (err) {
      console.error("Google Auth error:", err);
      let errMsg = err.message || "Đăng nhập Google thất bại";
      if (err.code === "auth/unauthorized-domain" || (err.message && err.message.includes("unauthorized-domain"))) {
        const currentDomain = typeof window !== "undefined" ? window.location.hostname : "tên miền hiện tại";
        errMsg = `Tên miền '${currentDomain}' chưa được ủy quyền trong Firebase Console. Vui lòng thêm '${currentDomain}' vào mục Authorized Domains tại Cài đặt Authentication của Firebase.`;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card max-w-md mx-auto">
        <h2 className="auth-title font-montserrat">Đăng Nhập</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm mb-4 animate-fadeIn">
            <i className="fas fa-exclamation-circle mr-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form space-y-4">
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

          <div className="form-group">
            <label className="block text-sm mb-1 text-gray-200">Mật khẩu *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent w-full py-3 rounded-full font-bold uppercase mt-6"
          >
            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : "ĐĂNG NHẬP"}
          </button>

          <div className="auth-links flex justify-between text-xs text-gray-300">
            <Link href="/forgot-password" className="hover:text-white hover:underline">
              Quên mật khẩu?
            </Link>
            <Link href={`/register${redirect !== '/' ? '?redirect=' + encodeURIComponent(redirect) : ''}`} className="hover:text-white hover:underline">
              Tạo tài khoản mới
            </Link>
          </div>
        </form>

        <div className="auth-divider">hoặc</div>

        {/* Google SSO Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="btn-google"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google Logo"
          />
          <span>Đăng nhập bằng Google</span>
        </button>

        <p className="footer-link-text">
          Chưa có tài khoản? <Link href={`/register${redirect !== '/' ? '?redirect=' + encodeURIComponent(redirect) : ''}`}>Đăng ký tại đây</Link>
        </p>


      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="auth-card max-w-md mx-auto flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
