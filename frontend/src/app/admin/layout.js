"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/login");
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchIndicators = async () => {
      try {
        const orderData = await api.get("/orders/all?status=pending");
        setPendingOrders(orderData.orders || []);
        
        const msgData = await api.get("/messages/unread/count");
        setUnreadCount(msgData.unreadCount || 0);
      } catch (err) {
        console.error("Failed to fetch indicators:", err);
      }
    };

    fetchIndicators();
    const interval = setInterval(fetchIndicators, 15000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  useEffect(() => {
    if (!notifDropdownOpen) return;
    const handleClose = () => setNotifDropdownOpen(false);
    document.addEventListener("click", handleClose);
    return () => document.removeEventListener("click", handleClose);
  }, [notifDropdownOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f2ea] flex items-center justify-center">
        <div className="rounded-[2rem] bg-white p-8 shadow-2xl shadow-[#224229]/10 text-center border border-[#eadfce]">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#183b20] to-[#49642e] flex items-center justify-center">
            <i className="fas fa-leaf text-[#d8892b] text-2xl animate-pulse"></i>
          </div>
          <div className="w-44 h-2 bg-[#efe6d6] rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-[#183b20] to-[#d8892b] rounded-full animate-pulse"></div>
          </div>
          <p className="mt-4 text-sm font-bold text-[#183b20]">Đang mở trung tâm quản trị...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const navItems = [
    { href: "/admin", icon: "fa-chart-pie", label: "Tổng quan", caption: "Doanh thu & vận hành", exact: true },
    { href: "/admin/orders", icon: "fa-file-invoice-dollar", label: "Đơn hàng", caption: "Xử lý giao dịch" },
    { href: "/admin/products", icon: "fa-boxes-stacked", label: "Sản phẩm", caption: "Kho hàng & giá bán" },
    { href: "/admin/blogs", icon: "fa-newspaper", label: "Bài viết", caption: "Dinh dưỡng & Tin tức" },
    { href: "/admin/messages", icon: "fa-headset", label: "Hỗ trợ", caption: "Tin nhắn khách hàng" },
    { href: "/admin/users", icon: "fa-users", label: "Khách hàng", caption: "Thành viên & Quyền hạn" },
  ];

  const isActive = (href, exact) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#22301f]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-24 w-96 h-96 bg-[#d8892b]/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-[30rem] h-[30rem] bg-[#183b20]/10 rounded-full blur-3xl"></div>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-[292px] bg-[#183b20] text-white shadow-2xl shadow-[#183b20]/30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(216,137,43,0.22),transparent_34%),linear-gradient(180deg,#183b20_0%,#102918_100%)]"></div>
        <div className="relative h-full flex flex-col">
          <div className="px-6 py-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f0a84b] to-[#b96518] flex items-center justify-center shadow-lg shadow-[#d8892b]/30">
                <i className="fas fa-seedling text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-[0.18em]">NUTRICORE</h1>
                <p className="text-xs text-[#f3c98f] font-semibold tracking-wide">SELLER CENTER</p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-5">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#d8892b] flex items-center justify-center font-black shadow-inner">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{user?.name || "Admin"}</p>
                  <p className="text-xs text-white/55">Quản trị viên cao cấp</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
                <span><i className="fas fa-shield-halved mr-1 text-[#f0a84b]"></i>Bảo mật</span>
                <span className="px-2 py-1 rounded-full bg-emerald-400/15 text-emerald-200">Online</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all ${
                    active
                      ? "bg-[#f7f2e8] text-[#183b20] shadow-xl shadow-black/20"
                      : "text-white/72 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {active && <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-9 rounded-r-full bg-[#d8892b]"></span>}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${active ? "bg-[#183b20] text-[#d8892b]" : "bg-white/8 text-[#f0c282] group-hover:bg-white/14"}`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.label}</p>
                    <p className={`text-[11px] truncate ${active ? "text-[#62704e]" : "text-white/38"}`}>{item.caption}</p>
                  </div>
                  {item.href === "/admin/messages" && unreadCount > 0 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-black w-5.5 h-5.5 rounded-full shadow-md flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link href="/" className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white/80 hover:bg-[#d8892b] hover:text-white transition-all">
              <i className="fas fa-store"></i>
              Về cửa hàng
            </Link>
          </div>
        </div>
      </aside>

      {sidebarOpen && <button aria-label="Đóng menu admin" className="fixed inset-0 bg-black/45 z-40 xl:hidden" onClick={() => setSidebarOpen(false)}></button>}

      <div className="relative xl:pl-[292px] min-h-screen">
        <header className="sticky top-0 z-30 bg-[#f7f2e8]/82 backdrop-blur-2xl border-b border-[#eadfce]">
          <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="xl:hidden w-11 h-11 rounded-2xl bg-white border border-[#eadfce] text-[#183b20] shadow-sm">
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b96d1e]">Admin workspace</p>
                <h2 className="text-xl sm:text-2xl font-black text-[#183b20]">Trung tâm quản trị bán hàng</h2>
              </div>
            </div>


            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs text-[#7b6c55]">Cập nhật</p>
                <p className="text-sm font-bold text-[#183b20]">{currentTime}</p>
              </div>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="w-11 h-11 rounded-2xl bg-white border border-[#eadfce] text-[#183b20] hover:text-[#d8892b] shadow-sm transition-colors relative flex items-center justify-center cursor-pointer"
                  title="Thông báo đơn hàng mới"
                >
                  <i className="far fa-bell text-lg"></i>
                  {pendingOrders.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow animate-bounce">
                      {pendingOrders.length}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-[#eadfce] rounded-3xl shadow-xl z-50 overflow-hidden animate-fadeIn text-left">
                    <div className="px-5 py-4 border-b border-[#eadfce] bg-[#fdfaf5] flex justify-between items-center">
                      <span className="font-bold text-sm text-[#183b20]">Đơn hàng mới chờ duyệt</span>
                      <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-black">{pendingOrders.length} mới</span>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
                      {pendingOrders.length === 0 ? (
                        <div className="px-5 py-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                          <i className="fas fa-box-open text-2xl text-gray-300"></i>
                          <span>Không có đơn hàng mới nào chờ xác nhận</span>
                        </div>
                      ) : (
                        pendingOrders.map((order) => (
                          <Link
                            key={order._id}
                            href={`/admin/orders?code=${order.orderCode}`}
                            onClick={() => setNotifDropdownOpen(false)}
                            className="block px-5 py-3.5 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-xs text-[#183b20]">#{order.orderCode}</span>
                              <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <p className="text-xs font-semibold text-gray-700 truncate">{order.shippingInfo?.fullName}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[11px] text-[#b96d1e] font-black">{order.total?.toLocaleString("vi-VN")} đ</span>
                              <span className="text-[10px] bg-yellow-50 text-yellow-700 font-bold px-1.5 py-0.5 rounded border border-yellow-200">Chờ duyệt</span>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                    {pendingOrders.length > 0 && (
                      <div className="px-4 py-2.5 border-t border-[#eadfce] bg-gray-50 text-center">
                        <Link 
                          href="/admin/orders" 
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-[11px] font-bold text-[#183b20] hover:text-[#d8892b] transition-colors"
                        >
                          Xem tất cả đơn hàng
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Link href="/" className="hidden sm:flex items-center gap-2 rounded-2xl bg-[#183b20] px-4 py-3 text-sm font-bold text-white hover:bg-[#244d2d] shadow-lg shadow-[#183b20]/15 transition-all">
                <i className="fas fa-shop"></i>
                Cửa hàng
              </Link>
            </div>
          </div>
        </header>

        <main className="relative p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1500px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
