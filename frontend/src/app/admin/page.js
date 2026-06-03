"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, ordersData] = await Promise.all([
          api.get("/orders/stats/summary"),
          api.get("/orders/all")
        ]);
        setStats(statsData);
        setRecentOrders((ordersData.orders || []).slice(0, 6));
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    {
      label: "Tổng đơn hàng",
      value: stats.totalOrders,
      icon: "fa-bag-shopping",
      tone: "from-[#183b20] to-[#49642e]",
      caption: "+12% so với kỳ trước"
    },
    {
      label: "Chờ xác nhận",
      value: stats.pendingOrders,
      icon: "fa-clock-rotate-left",
      tone: "from-[#d8892b] to-[#ad5f18]",
      caption: "Cần xử lý sớm"
    },
    {
      label: "Đã giao hàng",
      value: stats.deliveredOrders,
      icon: "fa-truck-fast",
      tone: "from-[#2f6d38] to-[#183b20]",
      caption: "Hoàn tất thành công"
    },
    {
      label: "Doanh thu",
      value: `${(stats.totalRevenue || 0).toLocaleString("vi-VN")} đ`,
      icon: "fa-chart-line",
      tone: "from-[#6b4a24] to-[#d8892b]",
      caption: "Tổng doanh thu ghi nhận"
    },
  ];

  const statusMap = {
    pending: { label: "Chờ xác nhận", color: "bg-[#fff3d8] text-[#a35d12] border-[#f0cf91]" },
    confirmed: { label: "Đã xác nhận", color: "bg-[#e8f1ff] text-[#2c5f9e] border-[#bad3f8]" },
    shipping: { label: "Đang giao", color: "bg-[#efe8ff] text-[#6f41a4] border-[#d7c5f5]" },
    delivered: { label: "Hoàn thành", color: "bg-[#e5f4e8] text-[#216b34] border-[#b8dfc0]" },
    cancelled: { label: "Đã hủy", color: "bg-[#ffe7e3] text-[#b83b2d] border-[#f5b8af]" }
  };

  const quickActions = [
    { label: "Thêm sản phẩm", href: "/admin/products", icon: "fa-circle-plus", color: "bg-[#183b20]" },
    { label: "Duyệt đơn mới", href: "/admin/orders", icon: "fa-clipboard-check", color: "bg-[#d8892b]" },
    { label: "Trả lời hỗ trợ", href: "/admin/messages", icon: "fa-comments", color: "bg-[#6b4a24]" },
  ];

  if (loading) {
    return (
      <div className="min-h-[520px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#183b20] flex items-center justify-center mx-auto shadow-xl shadow-[#183b20]/20">
            <i className="fas fa-leaf text-[#d8892b] text-2xl animate-pulse"></i>
          </div>
          <p className="mt-4 text-sm font-bold text-[#183b20]">Đang tải dữ liệu vận hành...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#183b20] text-white shadow-2xl shadow-[#183b20]/18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(216,137,43,0.35),transparent_32%),linear-gradient(135deg,#183b20_0%,#264c2d_52%,#102918_100%)]"></div>
        <div className="absolute -right-16 -bottom-24 w-72 h-72 rounded-full border-[42px] border-white/5"></div>
        <div className="relative p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#f5cf9e] text-xs font-black tracking-[0.18em] uppercase">
              <i className="fas fa-crown"></i>
              NutriCore Seller Center
            </div>
            <h1 className="mt-5 text-3xl lg:text-5xl font-black leading-tight">
              Quản trị cửa hàng <br className="hidden sm:block" />chuyên nghiệp mỗi ngày
            </h1>
            <p className="mt-4 max-w-2xl text-white/70 text-sm lg:text-base">
              Theo dõi đơn hàng, doanh thu, sản phẩm và tin nhắn khách hàng trong một không gian quản trị hiện đại như sàn thương mại điện tử.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 min-w-[280px]">
            <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-center backdrop-blur">
              <p className="text-2xl font-black text-[#f5cf9e]">{stats.pendingOrders}</p>
              <p className="text-[11px] text-white/58">Cần xử lý</p>
            </div>
            <div className="rounded-3xl bg-white/10 border border-white/15 p-4 text-center backdrop-blur">
              <p className="text-2xl font-black text-[#f5cf9e]">{stats.deliveredOrders}</p>
              <p className="text-[11px] text-white/58">Hoàn tất</p>
            </div>
            <div className="rounded-3xl bg-[#d8892b] p-4 text-center shadow-xl shadow-[#d8892b]/25">
              <p className="text-2xl font-black">{stats.totalOrders}</p>
              <p className="text-[11px] text-white/75">Tổng đơn</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="group relative overflow-hidden rounded-[1.7rem] bg-white border border-[#eadfce] p-5 shadow-sm hover:shadow-2xl hover:shadow-[#183b20]/10 transition-all duration-300">
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#f7f2e8]"></div>
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#7b6c55]">{card.label}</p>
                <p className="mt-3 text-2xl font-black text-[#183b20]">{card.value}</p>
                <p className="mt-2 text-xs text-[#9a8d76]">{card.caption}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.tone} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <i className={`fas ${card.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.6fr] gap-6">
        <div className="space-y-6">
          <div className="rounded-[1.7rem] bg-white border border-[#eadfce] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d8892b]">Task queue</p>
                <h2 className="text-xl font-black text-[#183b20]">Việc cần xử lý</h2>
              </div>
              <i className="fas fa-bolt text-[#d8892b]"></i>
            </div>
            <div className="space-y-3">
              {[
                ["Xác nhận đơn mới", stats.pendingOrders, "fa-clipboard-list"],
                ["Kiểm tra tồn kho", "Realtime", "fa-boxes-stacked"],
                ["Tin nhắn khách hàng", "Live", "fa-headset"],
              ].map(([label, value, icon]) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl bg-[#fbf8f1] border border-[#efe2cf] p-3">
                  <div className="w-10 h-10 rounded-xl bg-[#183b20] text-[#d8892b] flex items-center justify-center">
                    <i className={`fas ${icon}`}></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-[#183b20]">{label}</p>
                    <p className="text-xs text-[#8c7d66]">Ưu tiên trong hôm nay</p>
                  </div>
                  <span className="text-sm font-black text-[#b96d1e]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] bg-[#fff8ed] border border-[#efd8b7] p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#183b20] mb-4">Thao tác nhanh</h2>
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <a key={action.label} href={action.href} className="flex items-center gap-3 rounded-2xl bg-white border border-[#eadfce] p-3 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                  <span className={`w-10 h-10 rounded-xl ${action.color} text-white flex items-center justify-center`}>
                    <i className={`fas ${action.icon}`}></i>
                  </span>
                  <span className="font-bold text-sm text-[#183b20]">{action.label}</span>
                  <i className="fas fa-arrow-right ml-auto text-[#d8892b]"></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.7rem] bg-white border border-[#eadfce] overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[#efe2cf] flex items-center justify-between bg-gradient-to-r from-white to-[#fff8ed]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d8892b]">Recent orders</p>
              <h2 className="text-xl font-black text-[#183b20]">Đơn hàng gần đây</h2>
            </div>
            <a href="/admin/orders" className="rounded-full bg-[#183b20] text-white px-4 py-2 text-xs font-bold hover:bg-[#244d2d] transition-colors">Xem tất cả</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#fbf8f1] text-[#75664e]">
                <tr>
                  <th className="text-left px-6 py-4 font-black">Mã ĐH</th>
                  <th className="text-left px-6 py-4 font-black">Khách hàng</th>
                  <th className="text-left px-6 py-4 font-black">Tổng tiền</th>
                  <th className="text-left px-6 py-4 font-black">Thanh toán</th>
                  <th className="text-left px-6 py-4 font-black">Trạng thái</th>
                  <th className="text-left px-6 py-4 font-black">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e5d4]">
                {recentOrders.map(order => {
                  const st = statusMap[order.status] || statusMap.pending;
                  return (
                    <tr key={order._id} className="hover:bg-[#fffaf2] transition-colors">
                      <td className="px-6 py-4 font-black text-[#183b20]">#{order.orderCode}</td>
                      <td className="px-6 py-4 font-semibold text-[#3f4a35]">{order.shippingInfo?.fullName || order.user?.name || "-"}</td>
                      <td className="px-6 py-4 font-black text-[#b96d1e]">{order.total?.toLocaleString("vi-VN")} đ</td>
                      <td className="px-6 py-4 text-[#7b6c55]">{order.paymentMethod === "cod" ? "COD" : "PayOS"}</td>
                      <td className="px-6 py-4"><span className={`${st.color} border px-3 py-1.5 rounded-full text-xs font-black`}>{st.label}</span></td>
                      <td className="px-6 py-4 text-[#8c7d66]">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                    </tr>
                  );
                })}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-14 text-center text-[#9a8d76]">
                      <i className="fas fa-receipt text-4xl mb-3 block text-[#d8c6ab]"></i>
                      Chưa có đơn hàng gần đây
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
