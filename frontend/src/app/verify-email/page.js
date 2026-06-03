"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Đang xác thực email của bạn...");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Liên kết xác thực thiếu mã token.");
        return;
      }

      try {
        const data = await api.verifyEmail(token);
        setStatus("success");
        setMessage(data.message || "Xác thực email thành công.");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Không thể xác thực email.");
      }
    };

    verify();
  }, [token]);

  const isSuccess = status === "success";
  const isLoading = status === "loading";

  return (
    <div className="message-panel max-w-xl mx-auto my-16 bg-white rounded-2xl border border-gray-100 shadow-lg p-8 md:p-12 text-center">
      <div className={`message-icon w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 ${isSuccess ? "bg-green-50 text-green-600" : status === "error" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
        <i className={`fas ${isLoading ? "fa-spinner fa-spin" : isSuccess ? "fa-check" : "fa-times"}`}></i>
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold font-montserrat text-gray-900 mb-4">
        {isSuccess ? "Xác thực thành công" : isLoading ? "Đang xác thực" : "Xác thực thất bại"}
      </h1>

      <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
        {message}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/login" className="btn btn-primary px-8 py-3.5 rounded-full font-bold text-sm uppercase shadow-md hover:bg-[#607a44]">
          <i className="fas fa-sign-in-alt mr-2"></i>Đăng nhập
        </Link>
        <Link href="/" className="btn btn-secondary px-8 py-3.5 rounded-full font-bold text-sm uppercase hover:bg-[#b7c4a7]">
          <i className="fas fa-home mr-2"></i>Trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="auth-container"><div className="auth-card max-w-md mx-auto text-center">Đang tải...</div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
