"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "NUTRICORE-ORDER";

  return (
    <div className="message-panel max-w-xl mx-auto my-16 bg-white rounded-2xl border border-gray-100 shadow-lg p-8 md:p-12 text-center">
      <div className="message-icon success w-20 h-20 bg-green-50 text-[#45572f] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
        <i className="fas fa-check-circle text-4xl"></i>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-extrabold font-montserrat text-gray-900 mb-4">
        Đặt Hàng Thành Công!
      </h2>
      
      <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
        Cảm ơn bạn đã tin tưởng lựa chọn mua sắm tại <strong>Nutricore Tây Nguyên - Việt Nam</strong>.<br />
        Mã đơn hàng của bạn là: <strong className="text-[#45572f] font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-200 text-sm">{orderId}</strong>.
      </p>

      <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-8 max-w-md mx-auto">
        Thông tin đơn hàng đã được lưu lại trên hệ thống. Nhân viên tư vấn của chúng tôi sẽ gọi điện thoại liên hệ trực tiếp cho bạn để xác nhận đơn hàng và thời gian giao hàng sớm nhất có thể.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="btn btn-primary px-6 py-3.5 rounded-full font-bold text-sm uppercase shadow-sm hover:bg-[#607a44]"
        >
          <i className="fas fa-shopping-basket mr-2"></i> Tiếp tục mua sắm
        </Link>
        <Link
          href="/order-history"
          className="btn btn-secondary px-6 py-3.5 rounded-full font-bold text-sm uppercase hover:bg-[#b7c4a7]"
        >
          <i className="fas fa-history mr-2"></i> Lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense 
      fallback={
        <div className="max-w-[1200px] mx-auto px-4 py-32 text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#45572f] mb-4"></i>
          <p className="text-gray-500">Đang tải thông tin kết quả...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
