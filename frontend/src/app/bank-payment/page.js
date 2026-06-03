"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function BankPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId") || "NUTRICORE-ORDER";
  const amountStr = searchParams.get("amount") || "0";
  const amount = Number(amountStr);

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleConfirmPayment = () => {
    router.push(`/payment-success?orderId=${orderId}`);
  };

  // VietQR parameters:
  // Bank: Vietinbank (vietinbank)
  // Account: 113000000000 (Dummy)
  // Template: compact2
  const qrUrl = `https://img.vietqr.io/image/vietinbank-113000000000-compact2.png?amount=${amount}&addInfo=${orderId}&accountName=NUTRICORE%20TAY%20NGUYEN`;

  return (
    <div className="payment-box max-w-xl mx-auto my-12 bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-10">
      <span className="text-[#cfa006] uppercase tracking-wider font-bold text-xs block text-center mb-1">
        CỔNG THANH TOÁN AN TOÀN
      </span>
      <h2 className="text-2xl md:text-3xl font-extrabold font-montserrat text-gray-900 text-center mb-6">
        Chuyển Khoản Thanh Toán
      </h2>
      
      <p className="text-gray-500 text-sm text-center leading-relaxed mb-6">
        Vui lòng quét mã QR dưới đây bằng ứng dụng ngân hàng di động của bạn để thanh toán tự động, hoặc nhập thông tin chuyển khoản thủ công.
      </p>

      {/* Dynamic QR */}
      <div className="payment-qr relative flex items-center justify-center p-3 border border-gray-100 rounded-xl bg-gray-50 max-w-[280px] mx-auto mb-8 shadow-sm">
        <img 
          src={qrUrl} 
          alt={`Mã VietQR thanh toán ${amount.toLocaleString("vi-VN")} đ`} 
          className="w-full h-auto object-contain rounded-lg"
        />
      </div>

      {/* Countdown timer */}
      <div className="text-center mb-8">
        <span className="text-xs text-gray-400 font-semibold block uppercase mb-1">Mã QR hết hạn sau:</span>
        <span className="text-xl font-mono font-bold text-red-500 bg-red-50 px-4 py-1.5 rounded-full inline-block">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Transfer Information */}
      <div className="payment-details bg-gray-50 border border-gray-100 rounded-xl p-6 text-sm mb-8 space-y-4">
        <div className="payment-details-row">
          <span className="text-gray-500 font-medium">Ngân hàng:</span>
          <span className="font-bold text-gray-800 text-right">Vietinbank (NH Công thương Việt Nam)</span>
        </div>
        <div className="payment-details-row">
          <span className="text-gray-500 font-medium">Số tài khoản:</span>
          <span className="font-bold text-[#45572f] text-right text-base">113000000000</span>
        </div>
        <div className="payment-details-row">
          <span className="text-gray-500 font-medium">Chủ tài khoản:</span>
          <span className="font-bold text-gray-800 text-right uppercase">NUTRICORE TAY NGUYEN</span>
        </div>
        <div className="payment-details-row">
          <span className="text-gray-500 font-medium">Số tiền chuyển:</span>
          <span className="font-bold text-red-600 text-right text-base">{amount.toLocaleString("vi-VN")} đ</span>
        </div>
        <div className="payment-details-row">
          <span className="text-gray-500 font-medium">Nội dung chuyển khoản:</span>
          <span className="font-bold text-[#45572f] text-right font-mono bg-white px-2 py-0.5 rounded border border-gray-200">{orderId}</span>
        </div>
      </div>

      {/* Warning note */}
      <div className="flex gap-3 bg-[#cbd5be]/20 text-[#313e22] border border-[#cbd5be] p-4 rounded-xl text-xs md:text-sm leading-relaxed mb-8">
        <i className="fas fa-info-circle text-lg text-[#45572f] mt-0.5 flex-shrink-0"></i>
        <span>
          <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và nhập chính xác nội dung chuyển khoản để hệ thống tự động ghi nhận giao dịch của bạn nhanh nhất.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleConfirmPayment}
          className="btn btn-primary flex-1 py-3.5 rounded-full font-bold text-sm uppercase shadow-md hover:bg-[#607a44]"
        >
          Xác nhận đã chuyển khoản
        </button>
        <Link 
          href="/" 
          className="btn btn-white py-3.5 rounded-full font-bold text-sm uppercase text-center"
        >
          Hủy thanh toán
        </Link>
      </div>
    </div>
  );
}

export default function BankPaymentPage() {
  return (
    <Suspense 
      fallback={
        <div className="max-w-[1200px] mx-auto px-4 py-32 text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#45572f] mb-4"></i>
          <p className="text-gray-500">Đang tải thông tin thanh toán...</p>
        </div>
      }
    >
      <BankPaymentContent />
    </Suspense>
  );
}
