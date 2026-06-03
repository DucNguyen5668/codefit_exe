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
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [showUserMenu]);

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
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
              <div className="header-account-menu relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:text-[#f7ca3a] transition-colors"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-white/30" />
                  ) : (
                    <i className="fas fa-user-circle"></i>
                  )}
                  <span className="max-w-[120px] truncate">{user?.name || "Tài khoản"}</span>
                  <i className="fas fa-chevron-down text-[10px]"></i>
                </button>

                {showUserMenu && (
                  <div className="fixed right-6 top-12 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 min-w-[220px] z-[9999] animate-fadeIn overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                      <i className="fas fa-user-edit text-[#45572f]"></i> Tài khoản của tôi
                    </Link>
                    <Link href="/order-history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                      <i className="fas fa-box text-[#45572f]"></i> Đơn hàng của tôi
                    </Link>
                    <Link href="/messages" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                      <i className="fas fa-comments text-[#45572f]"></i> Tin nhắn
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                        <i className="fas fa-cog text-[#cfa006]"></i> Quản trị Admin
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                      <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                  </div>
                )}
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
            className="md:hidden text-2xl text-[#45572f] hover:text-[#cfa006] focus:outline-none order-first"
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

          <div className="logo z-10 flex justify-center w-full md:w-2/12 py-1 md:py-0">
            <Link href="/" className="outline-none flex justify-center items-center">
              <img 
                src="/Logo.png" 
                alt="Nutricore Tây Nguyên Logo" 
                className="w-[120px] h-[120px] object-contain hover:scale-105 transition-transform" 
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

          <div className="w-8 md:hidden"></div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 flex flex-col space-y-4 shadow-inner animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#45572f]"></i>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full rounded-full border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#45572f]"
              />
            </form>
            <Link href="/" className={`font-semibold text-sm uppercase ${isActive("/") ? "text-[#45572f]" : "text-gray-700"}`} onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
            <Link href="/products" className={`font-semibold text-sm uppercase ${isActive("/products") ? "text-[#45572f]" : "text-gray-700"}`} onClick={() => setIsMobileMenuOpen(false)}>Sản phẩm</Link>
            <Link href="/nutrition" className={`font-semibold text-sm uppercase ${isActive("/nutrition") ? "text-[#45572f]" : "text-gray-700"}`} onClick={() => setIsMobileMenuOpen(false)}>Dinh dưỡng</Link>
            <Link href="/about" className={`font-semibold text-sm uppercase ${isActive("/about") ? "text-[#45572f]" : "text-gray-700"}`} onClick={() => setIsMobileMenuOpen(false)}>Về chúng tôi</Link>
            <Link href="/customer-care" className={`font-semibold text-sm uppercase ${isActive("/customer-care") ? "text-[#45572f]" : "text-gray-700"}`} onClick={() => setIsMobileMenuOpen(false)}>Chăm sóc khách hàng</Link>
          </div>
        )}
      </nav>
    </>
  );
}
