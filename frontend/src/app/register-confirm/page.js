"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

function RegisterConfirmContent() {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email") || "email của bạn";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!userEmail || userEmail === "email của bạn") return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await api.resendVerification(userEmail);
      setMessage(data.message || "Đã gửi lại email xác thực.");
    } catch (err) {
      setError(err.message || "Không thể gửi lại email xác thực");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="message-panel max-w-xl mx-auto my-16 bg-white rounded-2xl border border-gray-100 shadow-lg p-8 md:p-12 text-center">
      <div className="message-icon info w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
        <i className="far fa-envelope-open text-4xl"></i>
      </div>

      <h2 className="text-2xl md:text-3xl font-extrabold font-montserrat text-gray-900 mb-4">
        Xác Minh Tài Khoản
      </h2>

      <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6">
        Một thư kích hoạt tài khoản đã được gửi đến địa chỉ email:<br />
        <strong className="text-[#45572f] font-semibold">{userEmail}</strong>.
      </p>

      <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-8 max-w-md mx-auto">
        Vui lòng kiểm tra hộp thư đến hoặc thư rác/spam và bấm vào liên kết trong email để hoàn tất kích hoạt tài khoản.
      </p>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm mb-4">
          <i className="fas fa-check-circle mr-2"></i>{message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
          <i className="fas fa-exclamation-circle mr-2"></i>{error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={loading || !userEmail || userEmail === "email của bạn"}
          className="btn btn-secondary px-8 py-3.5 rounded-full font-bold text-sm uppercase hover:bg-[#b7c4a7] disabled:opacity-60"
        >
          {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Đang gửi...</> : <><i className="far fa-paper-plane mr-2"></i>Gửi lại email</>}
        </button>

        <Link
          href="/login"
          className="btn btn-primary px-8 py-3.5 rounded-full font-bold text-sm uppercase shadow-md hover:bg-[#607a44]"
        >
          <i className="fas fa-sign-in-alt mr-2"></i> Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}

export default function RegisterConfirmPage() {
  return (
    <Suspense fallback={
      <div className="message-panel max-w-xl mx-auto my-16 bg-white rounded-2xl border border-gray-100 shadow-lg p-8 text-center">
        Đang tải...
      </div>
    }>
      <RegisterConfirmContent />
    </Suspense>
  );
}
