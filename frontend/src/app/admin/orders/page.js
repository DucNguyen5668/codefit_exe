"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

const statusOptions = [
  { value: "pending", label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  { value: "confirmed", label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  { value: "shipping", label: "Đang giao", color: "bg-purple-100 text-purple-700" },
  { value: "delivered", label: "Đã giao", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Đã hủy", color: "bg-red-100 text-red-700" }
];

function OrdersContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? `?status=${filter}` : "";
      const data = await api.get(`/orders/all${params}`);
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Adjust filter to all when search parameter is present
  useEffect(() => {
    if (codeParam) {
      setFilter("all");
    }
  }, [codeParam]);

  useEffect(() => { queueMicrotask(fetchOrders); }, [fetchOrders]);

  // Auto expand order matching the code parameter
  useEffect(() => {
    if (codeParam && orders.length > 0) {
      const target = orders.find(o => String(o.orderCode) === String(codeParam));
      if (target) {
        setExpandedOrder(target._id);
        
        // Scroll to the expanded order element if it exists in the DOM
        setTimeout(() => {
          const element = document.getElementById(`order-${target._id}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    }
  }, [codeParam, orders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const updatePayment = async (orderId, paymentStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { paymentStatus });
      fetchOrders();
    } catch (err) {
      console.error("Update payment error:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-montserrat text-gray-900 mb-8">
        <i className="fas fa-box text-[#45572f] mr-3"></i>Quản Lý Đơn Hàng
      </h1>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ value: "all", label: "Tất cả" }, ...statusOptions].map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === opt.value
                ? "bg-[#45572f] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl"><p className="text-gray-500">Không có đơn hàng nào.</p></div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const st = statusOptions.find(s => s.value === order.status) || statusOptions[0];
            const isExpanded = expandedOrder === order._id;

            return (
              <div 
                key={order._id} 
                id={`order-${order._id}`}
                className={`bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300 ${
                  isExpanded ? "border-[#45572f] ring-1 ring-[#45572f]/20" : "border-gray-200"
                }`}
              >
                {/* Order Header */}
                <div
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#45572f] text-lg">#{order.orderCode}</span>
                    <span className={`${st.color} px-3 py-1 rounded-full text-xs font-bold`}>{st.label}</span>
                    <span className="text-xs text-gray-500">{order.paymentMethod === "cod" ? "COD" : "PayOS"}</span>
                    <span className={`text-xs font-bold ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                      {order.paymentStatus === "paid" ? "Đã TT" : "Chưa TT"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">{order.total?.toLocaleString("vi-VN")} đ</span>
                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                    <i className={`fas fa-chevron-${isExpanded ? "up" : "down"} text-gray-400`}></i>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 mb-3"><i className="fas fa-user mr-2 text-[#45572f]"></i>Khách hàng</h4>
                        <p className="text-sm"><strong>{order.shippingInfo?.fullName}</strong></p>
                        <p className="text-sm text-gray-600">{order.shippingInfo?.phone}</p>
                        <p className="text-sm text-gray-600">{order.shippingInfo?.email}</p>
                        <p className="text-sm text-gray-600 mt-1">{order.shippingInfo?.address}</p>
                        {order.shippingInfo?.note && (
                          <p className="text-sm text-yellow-600 mt-1"><i className="fas fa-sticky-note mr-1"></i>{order.shippingInfo.note}</p>
                        )}
                      </div>

                      {/* Items */}
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 mb-3"><i className="fas fa-shopping-basket mr-2 text-[#45572f]"></i>Sản phẩm</h4>
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm mb-1">
                            <span>{item.name} x{item.quantity}</span>
                            <span className="font-semibold">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                      <label className="text-sm font-bold text-gray-700">Trạng thái:</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#45572f]"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>

                      {order.paymentStatus !== "paid" && (
                        <button
                          onClick={() => updatePayment(order._id, "paid")}
                          className="text-sm bg-green-500 text-white px-4 py-1.5 rounded-lg font-bold hover:bg-green-600 transition-colors cursor-pointer"
                        >
                          <i className="fas fa-check mr-1"></i>Xác nhận đã thanh toán
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i></div>}>
      <OrdersContent />
    </Suspense>
  );
}
