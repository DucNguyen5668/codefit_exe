"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

const readCartCount = () => {
  if (typeof window === "undefined") return 0;
  try {
    const savedCart = localStorage.getItem("nutricore_cart");
    if (!savedCart) return 0;
    const cartItems = JSON.parse(savedCart);
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  } catch (e) {
    console.error("Failed to parse cart items", e);
    return 0;
  }
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCartCount(readCartCount());
  }, []);

  // Sync cart count from localStorage
  const updateCartCount = useCallback(() => {
    setCartCount(readCartCount());
  }, []);

  useEffect(() => {
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, [updateCartCount]);



  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="max-w-[1200px] mx-auto px-4 top-bar-inner">
          <div className="top-left">
            <i className="fas fa-phone-alt mr-2 text-[#cfa006]"></i>
            <span>Hotline: 0886.147.878</span>
          </div>
          <div className="top-right">

            {isLoggedIn ? (
              <div className="header-account-menu relative">
                <button className="header-account-trigger flex items-center gap-2">
                  <img src={user?.avatar || "/Avatar.png"} alt="" className="w-6 h-6 rounded-full object-cover border border-white/30" />
                  <span className="max-w-[120px] truncate">{user?.name || "Tài khoản"}</span>
                  <i className="fas fa-chevron-down text-[10px]"></i>
                </button>

                {/* Hover dropdown */}
                <div className="header-account-dropdown">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/profile" className="header-dropdown-link">
                    <i className="fas fa-user-edit"></i> Tài khoản của tôi
                  </Link>
                  <Link href="/order-history" className="header-dropdown-link">
                    <i className="fas fa-box"></i> Đơn hàng của tôi
                  </Link>
                  <Link href="/messages" className="header-dropdown-link">
                    <i className="fas fa-comments"></i> Tin nhắn
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="header-dropdown-link">
                      <i className="fas fa-cog"></i> Quản trị Admin
                    </Link>
                  )}
                  <div className="px-3 py-2 mt-1 border-t border-gray-100">
                    <button onClick={handleLogout} className="header-logout-btn w-full flex items-center justify-center gap-2">
                      <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <i className="fas fa-user-circle mr-1"></i> Tài khoản
              </Link>
            )}
            <Link href="/cart" className="header-cart-link relative">
              <i className="fas fa-shopping-cart mr-1"></i> Giỏ hàng
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#cfa006] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 nav-inner flex justify-between items-center relative">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl text-[#45572f] hover:text-[#cfa006] focus:outline-none order-first p-2 ml-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>

          {/* Left Nav Links */}
          <div className="hidden md:flex nav-links left items-center justify-end w-5/12">
            <Link href="/" className={`${isActive("/") ? "active" : ""} mx-3`}>
              Trang chủ
            </Link>
            <Link href="/products" className={`${isActive("/products") ? "active" : ""} mx-3`}>
              Sản phẩm
            </Link>
            <Link href="/nutrition" className={`${isActive("/nutrition") ? "active" : ""} mx-3`}>
              Dinh dưỡng
            </Link>
          </div>

          <div className="logo z-10 flex justify-center w-auto md:w-2/12 py-1 md:py-0">
            <Link href="/" className="outline-none flex justify-center items-center">
              <img 
                src="/Logo.png" 
                alt="Nutricore Tây Nguyên Logo" 
                className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] object-contain hover:scale-105 transition-transform" 
              />
            </Link>
          </div>

          {/* Right Nav Links */}
          <div className="hidden md:flex nav-links right items-center justify-start w-5/12">
            <Link href="/about" className={`${isActive("/about") ? "active" : ""} mx-3`}>
              Về chúng tôi
            </Link>
            <Link href="/customer-care" className={`${isActive("/customer-care") ? "active" : ""} mx-3`}>
              Chăm sóc khách hàng
            </Link>
          </div>

          <div className="w-8 md:hidden mr-4"></div>
        </div>

        {/* Mobile Dropdown - Full screen overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay md:hidden">
            <div className="mobile-menu-content">
              {/* Close button */}
              <button 
                className="self-end text-2xl text-gray-500 hover:text-[#45572f] mb-2"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <i className="fas fa-times"></i>
              </button>

              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#45572f]"></i>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="w-full rounded-full border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#45572f]"
                />
              </form>

              {/* Nav Links */}
              <div className="mobile-menu-links">
                <Link href="/" className={`mobile-menu-link ${isActive("/") ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-home"></i> Trang chủ
                </Link>
                <Link href="/products" className={`mobile-menu-link ${isActive("/products") ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-box-open"></i> Sản phẩm
                </Link>
                <Link href="/nutrition" className={`mobile-menu-link ${isActive("/nutrition") ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-seedling"></i> Dinh dưỡng
                </Link>
                <Link href="/about" className={`mobile-menu-link ${isActive("/about") ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-info-circle"></i> Về chúng tôi
                </Link>
                <Link href="/customer-care" className={`mobile-menu-link ${isActive("/customer-care") ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-headset"></i> Chăm sóc khách hàng
                </Link>
              </div>

              {/* User section for mobile */}
              {isLoggedIn ? (
                <div className="mobile-menu-user">
                  <div className="mobile-menu-user-info">
                    <img src={user?.avatar || "/Avatar.png"} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-[#45572f]/20" />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="mobile-menu-user-links">
                    <Link href="/profile" className="mobile-menu-user-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <i className="fas fa-user-edit"></i> Tài khoản
                    </Link>
                    <Link href="/order-history" className="mobile-menu-user-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <i className="fas fa-box"></i> Đơn hàng
                    </Link>
                    <Link href="/messages" className="mobile-menu-user-link" onClick={() => setIsMobileMenuOpen(false)}>
                      <i className="fas fa-comments"></i> Tin nhắn
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="mobile-menu-user-link" onClick={() => setIsMobileMenuOpen(false)}>
                        <i className="fas fa-cog text-[#cfa006]"></i> Admin
                      </Link>
                    )}
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                    className="mobile-menu-logout"
                  >
                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="mobile-menu-user">
                  <div className="flex flex-col items-stretch gap-3 w-full bg-[#f9fafb] p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500 text-center font-medium">Chào bạn! Vui lòng đăng nhập hoặc đăng ký tài khoản.</p>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Link 
                        href="/login" 
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#45572f] hover:bg-[#607a44] transition-colors text-center shadow-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <i className="fas fa-sign-in-alt"></i> Đăng nhập
                      </Link>
                      <Link 
                        href="/register" 
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-[#45572f] bg-white border border-[#45572f] hover:bg-[#f0f5eb] transition-colors text-center shadow-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <i className="fas fa-user-plus"></i> Đăng ký
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
