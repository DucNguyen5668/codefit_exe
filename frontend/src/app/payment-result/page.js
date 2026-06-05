"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const statusParam = searchParams.get("status");
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(statusParam || "pending");

  useEffect(() => {
    if (!orderCode) return;
    
    const verifyPayment = async () => {
      try {
        const data = await api.get(`/payment/verify/${orderCode}`);
        setOrder(data);
        setPaymentStatus(data.paymentStatus);
      } catch (err) {
        console.error("Verify payment error:", err);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderCode]);

  const isSuccess = paymentStatus === "paid" || statusParam === "success";
  const isCancelled = statusParam === "cancelled";

  return (
    <div>
<section className="max-w-[600px] mx-auto px-4 section-padding">
        {loading ? (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-[#45572f] mb-4"></i>
            <p className="text-gray-500">Đang xác nhận thanh toán...</p>
          </div>
        ) : (
          <div className="text-center bg-white border border-gray-100 rounded-2xl p-10 shadow-sm">
            {isSuccess ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-check-circle text-4xl text-green-500"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">Đặt Hàng Thành Công!</h2>
                <p className="text-gray-500 mb-6">
                  Cảm ơn bạn đã mua hàng tại Nutricore Tây Nguyên.
                </p>
              </>
            ) : isCancelled ? (
              <>
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-exclamation-triangle text-4xl text-yellow-500"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">Thanh Toán Bị Hủy</h2>
                <p className="text-gray-500 mb-6">
                  Bạn đã hủy thanh toán. Đơn hàng vẫn được lưu với trạng thái chờ thanh toán.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-clock text-4xl text-blue-500"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-montserrat">Đang Chờ Thanh Toán</h2>
                <p className="text-gray-500 mb-6">
                  Đơn hàng đang chờ xác nhận thanh toán.
                </p>
              </>
            )}

            {orderCode && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
                <p className="text-gray-500">Mã đơn hàng</p>
                <p className="text-lg font-bold text-[#45572f]">#{orderCode}</p>
                {order && (
                  <p className="text-gray-500 mt-2">Tổng: <span className="font-bold text-gray-800">{order.total?.toLocaleString("vi-VN")} đ</span></p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/products" className="btn btn-primary rounded-full px-8">
                TIẾP TỤC MUA SẮM
              </Link>
              <Link href="/order-history" className="btn btn-white rounded-full px-8">
                XEM ĐƠN HÀNG
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i></div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
