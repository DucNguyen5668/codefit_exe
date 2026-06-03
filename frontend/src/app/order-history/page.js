"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const statusMap = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700", icon: "fa-clock", step: 0 },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700", icon: "fa-check", step: 1 },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700", icon: "fa-shipping-fast", step: 2 },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-700", icon: "fa-check-double", step: 3 },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: "fa-times", step: -1 }
};

const paymentStatusMap = {
  pending: { label: "Chờ thanh toán", color: "text-yellow-600" },
  paid: { label: "Đã thanh toán", color: "text-green-600" },
  failed: { label: "Thất bại", color: "text-red-600" }
};

const refundStatusMap = {
  none: { label: "Chưa yêu cầu", color: "bg-gray-100 text-gray-600" },
  requested: { label: "Đang chờ hoàn trả", color: "bg-amber-100 text-amber-700" },
  approved: { label: "Đã duyệt hoàn trả", color: "bg-blue-100 text-blue-700" },
  rejected: { label: "Từ chối hoàn trả", color: "bg-red-100 text-red-700" },
  completed: { label: "Đã hoàn tiền", color: "bg-green-100 text-green-700" }
};

const filterTabs = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" }
];

const timelineSteps = [
  { key: "pending", label: "Đặt hàng", icon: "fa-receipt" },
  { key: "confirmed", label: "Xác nhận", icon: "fa-clipboard-check" },
  { key: "shipping", label: "Đang giao", icon: "fa-truck" },
  { key: "delivered", label: "Đã giao", icon: "fa-box-open" }
];

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;
const formatDate = (value) => value ? new Date(value).toLocaleString("vi-VN") : "—";

export default function OrderHistoryPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  const [cancelReason, setCancelReason] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.get("/orders/my-orders");
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    queueMicrotask(fetchOrders);
  }, [isLoggedIn, fetchOrders, router]);

  const filteredOrders = activeFilter === "all"
    ? orders
    : orders.filter(order => order.status === activeFilter);

  const openModal = (type, order) => {
    setSelectedOrder(order);
    setModalType(type);
    setActionMessage({ type: "", text: "" });
    setCancelReason("");
    setRefundReason("");
    setBankName(order?.refundBankInfo?.bankName || "");
    setAccountNumber(order?.refundBankInfo?.accountNumber || "");
    setAccountHolder(order?.refundBankInfo?.accountHolder || "");
    setConfirmPassword("");
  };

  const closeModal = () => {
    if (actionLoading) return;
    setModalType(null);
    setSelectedOrder(null);
  };

  const updateOrderInState = (updatedOrder) => {
    setOrders(prev => prev.map(order => order._id === updatedOrder._id ? updatedOrder : order));
  };

  const handleCancelOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setActionLoading(true);
    setActionMessage({ type: "", text: "" });
    try {
      const data = await api.put(`/orders/${selectedOrder._id}/cancel`, {
        reason: cancelReason.trim()
      });
      updateOrderInState(data.order);
      setActionMessage({ type: "success", text: "Hủy đơn hàng thành công" });
      setTimeout(closeModal, 800);
    } catch (err) {
      setActionMessage({ type: "error", text: err.message || "Không thể hủy đơn" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundRequest = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const needsBankInfo = selectedOrder.paymentMethod === "payos" || selectedOrder.paymentStatus === "paid";
    if (!refundReason.trim()) {
      setActionMessage({ type: "error", text: "Vui lòng nhập lý do hoàn trả" });
      return;
    }
    if (needsBankInfo && (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim())) {
      setActionMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng" });
      return;
    }
    if (!confirmPassword) {
      setActionMessage({ type: "error", text: "Vui lòng nhập mật khẩu để xác nhận" });
      return;
    }

    setActionLoading(true);
    setActionMessage({ type: "", text: "" });
    try {
      const data = await api.put(`/orders/${selectedOrder._id}/refund`, {
        refundReason: refundReason.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim(),
        password: confirmPassword
      });
      updateOrderInState(data.order);
      setActionMessage({ type: "success", text: "Đã gửi yêu cầu hoàn trả" });
      setTimeout(closeModal, 900);
    } catch (err) {
      setActionMessage({ type: "error", text: err.message || "Không thể gửi yêu cầu hoàn trả" });
    } finally {
      setActionLoading(false);
    }
  };

  const canCancel = (order) => ["pending", "confirmed"].includes(order.status);
  const canRefund = (order) => order.status === "delivered" && (!order.refundStatus || order.refundStatus === "none");

  const renderTimeline = (order) => {
    const current = statusMap[order.status] || statusMap.pending;

    if (order.status === "cancelled") {
      return (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 text-sm">
          <i className="fas fa-ban mr-2"></i>
          Đơn hàng đã hủy{order.cancelReason ? `: ${order.cancelReason}` : ""}
          {order.cancelledAt && <span className="block text-xs mt-1">Thời gian: {formatDate(order.cancelledAt)}</span>}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {timelineSteps.map((step, index) => {
          const done = index <= current.step;
          return (
            <div key={step.key} className="relative text-center">
              {index < timelineSteps.length - 1 && (
                <div className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 ${done && index < current.step ? "bg-[#45572f]" : "bg-gray-200"}`}></div>
              )}
              <div className={`relative z-10 mx-auto w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? "bg-[#45572f] border-[#45572f] text-white" : "bg-white border-gray-200 text-gray-300"
              }`}>
                <i className={`fas ${step.icon}`}></i>
              </div>
              <p className={`text-xs font-bold mt-2 ${done ? "text-[#45572f]" : "text-gray-400"}`}>{step.label}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRefundBadge = (order) => {
    const refund = refundStatusMap[order.refundStatus || "none"] || refundStatusMap.none;
    if (!order.refundStatus || order.refundStatus === "none") return null;
    return (
      <span className={`${refund.color} px-3 py-1 rounded-full text-xs font-bold`}>
        <i className="fas fa-undo-alt mr-1"></i>{refund.label}
      </span>
    );
  };

  return (
    <div>
      <section className="page-banner">
        <div className="max-w-[1200px] mx-auto px-4 banner-inner">
          <h1 className="banner-title">Theo Dõi Đơn Hàng</h1>
          <div className="breadcrumbs">
            <Link href="/">Trang chủ</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Đơn hàng</span>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 section-padding">
        <div className="bg-gradient-to-br from-[#45572f] to-[#2f3d20] rounded-2xl p-6 md:p-8 text-white mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="uppercase text-xs tracking-[0.25em] text-[#f7ca3a] font-bold mb-2">Nutricore Care</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Quản lý mua sắm của bạn</h2>
              <p className="text-white/75 text-sm max-w-2xl">
                Theo dõi trạng thái giao hàng, hủy đơn khi còn xử lý và gửi yêu cầu hoàn trả an toàn với xác nhận mật khẩu.
              </p>
            </div>
            <Link href="/products" className="bg-[#f7ca3a] text-[#2f3d20] px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform text-center">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeFilter === tab.value
                  ? "bg-[#45572f] text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#45572f]"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">
                {tab.value === "all" ? orders.length : orders.filter(o => o.status === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-[#45572f]"></i>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl max-w-xl mx-auto border border-gray-100">
            <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
            <h2 className="text-xl font-bold mb-2">Không có đơn hàng phù hợp</h2>
            <p className="text-gray-500 mb-6 text-sm">Hãy mua sắm để xem đơn hàng ở đây.</p>
            <Link href="/products" className="btn btn-primary px-8 py-3 rounded-full font-bold">
              ĐẾN CỬA HÀNG
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map(order => {
              const st = statusMap[order.status] || statusMap.pending;
              const ps = paymentStatusMap[order.paymentStatus] || paymentStatusMap.pending;
              const expanded = expandedOrderId === order._id;
              const needsBankInfo = order.paymentMethod === "payos" || order.paymentStatus === "paid";

              return (
                <div key={order._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                  <button
                    onClick={() => setExpandedOrderId(expanded ? null : order._id)}
                    className="w-full p-5 md:p-6 text-left"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#45572f]/10 text-[#45572f] flex items-center justify-center text-xl">
                          <i className="fas fa-shopping-bag"></i>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Mã đơn hàng</p>
                          <p className="font-bold text-[#45572f] text-xl">#{order.orderCode}</p>
                          <p className="text-xs text-gray-400 mt-1">Đặt lúc {formatDate(order.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`${st.color} px-3 py-1 rounded-full text-xs font-bold`}>
                          <i className={`fas ${st.icon} mr-1`}></i>{st.label}
                        </span>
                        <span className={`${ps.color} text-xs font-bold`}>
                          <i className="fas fa-credit-card mr-1"></i>{ps.label}
                        </span>
                        {renderRefundBadge(order)}
                        <span className="font-bold text-lg text-[#45572f]">{formatCurrency(order.total)}</span>
                        <i className={`fas fa-chevron-${expanded ? "up" : "down"} text-gray-400`}></i>
                      </div>
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-gray-100 p-5 md:p-6 bg-gray-50/50">
                      <div className="mb-6">
                        <h3 className="font-bold text-[#45572f] mb-4 flex items-center gap-2">
                          <i className="fas fa-route"></i>Tiến trình đơn hàng
                        </h3>
                        {renderTimeline(order)}
                      </div>

                      <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-4">
                          <h3 className="font-bold text-gray-800 mb-4">Sản phẩm đã mua</h3>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                                {item.image ? (
                                  <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
                                ) : (
                                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                    <i className="fas fa-image"></i>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-500">{item.weight || ""}</p>
                                  <p className="text-xs text-gray-500">SL: {item.quantity} × {formatCurrency(item.price)}</p>
                                </div>
                                <p className="text-sm font-bold text-[#45572f]">{formatCurrency(item.price * item.quantity)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white rounded-xl border border-gray-100 p-4">
                            <h3 className="font-bold text-gray-800 mb-3">Thông tin giao hàng</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p><i className="fas fa-user w-5 text-[#45572f]"></i>{order.shippingInfo?.fullName}</p>
                              <p><i className="fas fa-phone w-5 text-[#45572f]"></i>{order.shippingInfo?.phone}</p>
                              <p><i className="fas fa-map-marker-alt w-5 text-[#45572f]"></i>{order.shippingInfo?.address}</p>
                              {order.shippingInfo?.note && <p><i className="fas fa-sticky-note w-5 text-[#45572f]"></i>{order.shippingInfo.note}</p>}
                            </div>
                          </div>

                          <div className="bg-white rounded-xl border border-gray-100 p-4">
                            <h3 className="font-bold text-gray-800 mb-3">Thanh toán</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between"><span>Tạm tính</span><b>{formatCurrency(order.subtotal)}</b></div>
                              <div className="flex justify-between"><span>Giảm giá</span><b>-{formatCurrency(order.discount)}</b></div>
                              <div className="flex justify-between border-t pt-2 text-[#45572f]"><span>Tổng cộng</span><b>{formatCurrency(order.total)}</b></div>
                              <p className="text-xs text-gray-500 mt-2">
                                {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán online PayOS"}
                              </p>
                            </div>
                          </div>

                          {(order.refundStatus && order.refundStatus !== "none") && (
                            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 text-sm text-amber-800">
                              <h3 className="font-bold mb-2"><i className="fas fa-undo-alt mr-2"></i>Yêu cầu hoàn trả</h3>
                              <p>Lý do: {order.refundReason}</p>
                              <p>Trạng thái: {refundStatusMap[order.refundStatus]?.label}</p>
                              <p>Ngày gửi: {formatDate(order.refundRequestedAt)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        {canCancel(order) && (
                          <button
                            onClick={() => openModal("cancel", order)}
                            className="px-5 py-2.5 rounded-full border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
                          >
                            <i className="fas fa-times-circle mr-2"></i>Hủy đơn
                          </button>
                        )}
                        {canRefund(order) && (
                          <button
                            onClick={() => openModal("refund", order)}
                            className="px-5 py-2.5 rounded-full bg-[#45572f] text-white font-bold text-sm hover:bg-[#2f3d20] transition-colors"
                          >
                            <i className="fas fa-undo mr-2"></i>Yêu cầu hoàn trả
                          </button>
                        )}
                        {needsBankInfo && order.refundStatus === "requested" && (
                          <span className="text-xs text-gray-500 self-center">
                            <i className="fas fa-lock mr-1"></i>Thông tin ngân hàng đã được gửi an toàn
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {modalType && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#45572f]">
                {modalType === "cancel" ? "Hủy đơn hàng" : "Yêu cầu hoàn trả"}
              </h2>
              <button onClick={closeModal} className="w-9 h-9 rounded-full hover:bg-gray-100 text-gray-500">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={modalType === "cancel" ? handleCancelOrder : handleRefundRequest} className="p-5 space-y-4">
              {actionMessage.text && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                  actionMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <i className={`fas ${actionMessage.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                  {actionMessage.text}
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-3 text-sm">
                <p className="text-gray-500">Mã đơn</p>
                <p className="font-bold text-[#45572f]">#{selectedOrder.orderCode} • {formatCurrency(selectedOrder.total)}</p>
              </div>

              {modalType === "cancel" ? (
                <div>
                  <label className="block text-sm font-bold mb-2">Lý do hủy đơn</label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="input-field w-full min-h-[100px] resize-none"
                    placeholder="Ví dụ: Tôi muốn thay đổi địa chỉ / đặt nhầm sản phẩm..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-2">Bạn chỉ có thể hủy đơn khi đơn đang chờ xác nhận hoặc đã xác nhận.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold mb-2">Lý do hoàn trả *</label>
                    <textarea
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="input-field w-full min-h-[100px] resize-none"
                      placeholder="Mô tả lý do cần hoàn trả sản phẩm..."
                      rows={4}
                    />
                  </div>

                  {(selectedOrder.paymentMethod === "payos" || selectedOrder.paymentStatus === "paid") && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                      <h3 className="font-bold text-blue-800 text-sm"><i className="fas fa-university mr-2"></i>Tài khoản nhận hoàn tiền</h3>
                      <input
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="input-field w-full"
                        placeholder="Tên ngân hàng (VD: Vietcombank)"
                      />
                      <input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="input-field w-full"
                        placeholder="Số tài khoản"
                      />
                      <input
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="input-field w-full"
                        placeholder="Tên chủ tài khoản"
                      />
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <label className="block text-sm font-bold mb-2 text-amber-800">
                      <i className="fas fa-lock mr-2"></i>Xác nhận mật khẩu *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field w-full"
                      placeholder="Nhập mật khẩu tài khoản để xác nhận"
                    />
                    <p className="text-xs text-amber-700 mt-2">Thông tin ngân hàng chỉ được gửi sau khi xác nhận mật khẩu thành công.</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-5 py-3 rounded-full border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`flex-1 px-5 py-3 rounded-full font-bold text-white ${modalType === "cancel" ? "bg-red-500 hover:bg-red-600" : "bg-[#45572f] hover:bg-[#2f3d20]"}`}
                >
                  {actionLoading ? <i className="fas fa-spinner fa-spin"></i> : modalType === "cancel" ? "Xác nhận hủy" : "Gửi yêu cầu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
