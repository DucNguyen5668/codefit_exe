import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";
import { useTheme } from "../contexts/ThemeContext";
import {
  Menu, X, Sun, Moon, LogOut, BookOpen,
  LayoutDashboard, Trophy, Settings, ChevronRight,
  Zap
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = authService.getUser();
  const isLoggedIn = authService.isLoggedIn();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center px-6 md:px-8
      dark:bg-[#0a0e1a]/90 bg-white/90 backdrop-blur-xl
      dark:border-brand-500/15 border-b border-gray-200
      transition-colors duration-200"
    >
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 no-underline"
          onClick={closeMenu}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            <span className="gradient-text">CodeFit</span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {isLoggedIn ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 no-underline
                  ${isActive
                    ? "dark:bg-brand-500/10 bg-brand-50 dark:text-brand-400 text-brand-600"
                    : "dark:text-gray-400 text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Trang chủ
              </NavLink>
              <NavLink
                to="/ban-do"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 no-underline
                  ${isActive
                    ? "dark:bg-brand-500/10 bg-brand-50 dark:text-brand-400 text-brand-600"
                    : "dark:text-gray-400 text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`
                }
              >
                <BookOpen className="w-4 h-4" />
                Lộ trình
              </NavLink>
              <NavLink
                to="/bang-xep-hang"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 no-underline
                  ${isActive
                    ? "dark:bg-brand-500/10 bg-brand-50 dark:text-brand-400 text-brand-600"
                    : "dark:text-gray-400 text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`
                }
              >
                <Trophy className="w-4 h-4" />
                Bảng xếp hạng
              </NavLink>
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 no-underline
                    ${isActive
                      ? "dark:bg-brand-500/10 bg-brand-50 dark:text-brand-400 text-brand-600"
                      : "dark:text-gray-400 text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                    }`
                  }
                >
                  <Settings className="w-4 h-4" />
                  Quản trị
                </NavLink>
              )}
            </>
          ) : (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 no-underline
                  ${isActive
                    ? "dark:bg-brand-500/10 bg-brand-50 dark:text-brand-400 text-brand-600"
                    : "dark:text-gray-400 text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`
                }
              >
                Trang chủ
              </NavLink>
              <NavLink
                to="/ban-do"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 no-underline
                  ${isActive
                    ? "dark:bg-brand-500/10 bg-brand-50 dark:text-brand-400 text-brand-600"
                    : "dark:text-gray-400 text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`
                }
              >
                <BookOpen className="w-4 h-4" />
                Lộ trình
              </NavLink>
              <NavLink
                to="/bang-xep-hang"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 no-underline
                  ${isActive
                    ? "dark:bg-brand-500/10 bg-brand-50 dark:text-brand-400 text-brand-600"
                    : "dark:text-gray-400 text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`
                }
              >
                <Trophy className="w-4 h-4" />
                Bảng xếp hạng
              </NavLink>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg dark:text-gray-400 text-gray-500 hover:dark:text-white hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
            title={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}
          >
            {isDark
              ? <Sun className="w-5 h-5" />
              : <Moon className="w-5 h-5" />
            }
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* User pill */}
              <NavLink
                to="/profile"
                className="hidden md:flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full
                  dark:bg-brand-500/10 dark:border-brand-500/20 dark:text-sm dark:font-semibold
                  bg-brand-50 border border-brand-200 text-sm font-semibold no-underline
                  dark:hover:bg-brand-500/20 hover:bg-brand-100 transition-all duration-200"
              >
                <span className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="dark:text-white text-gray-800">{user?.name?.split(" ")[0] || "User"}</span>
                <span className="dark:text-gray-500 text-gray-400 text-xs">{user?.level || "Beginner"}</span>
              </NavLink>

              {/* Mobile user icon */}
              <NavLink
                to="/profile"
                className="md:hidden w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white"
                title={user?.name || "User"}
              >
                <Zap className="w-4 h-4" />
              </NavLink>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg dark:text-gray-400 text-gray-500 dark:hover:text-danger-400 hover:text-danger-600 dark:hover:bg-danger-500/10 hover:bg-danger-50 transition-all duration-200"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="px-4 py-2 rounded-full text-sm font-semibold dark:text-gray-300 text-gray-600 hover:dark:text-white hover:text-gray-800 no-underline
                  dark:hover:bg-white/5 hover:bg-gray-100 transition-all duration-200"
              >
                Đăng nhập
              </NavLink>
              <NavLink
                to="/register"
                className="px-4 py-2 rounded-full text-sm font-semibold text-white no-underline
                  bg-gradient-to-r from-brand-500 to-cyan-500
                  hover:shadow-glow transition-all duration-200"
              >
                Đăng ký
              </NavLink>
            </>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg dark:text-gray-400 text-gray-500 hover:dark:text-white hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 dark:bg-[#0a0e1a]/95 bg-white/95 backdrop-blur-xl dark:border-brand-500/15 border-b border-gray-200 py-3 px-4">
          <div className="flex flex-col gap-1">
            {isLoggedIn ? (
              <>
                <MobileNavLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Trang chủ" onClick={closeMenu} />
                <MobileNavLink to="/ban-do" icon={<BookOpen className="w-4 h-4" />} label="Lộ trình" onClick={closeMenu} />
                <MobileNavLink to="/bang-xep-hang" icon={<Trophy className="w-4 h-4" />} label="Bảng xếp hạng" onClick={closeMenu} />
                {user?.role === "admin" && (
                  <MobileNavLink to="/admin" icon={<Settings className="w-4 h-4" />} label="Quản trị" onClick={closeMenu} />
                )}
              </>
            ) : (
              <>
                <MobileNavLink to="/" icon={null} label="Trang chủ" onClick={closeMenu} />
                <MobileNavLink to="/ban-do" icon={<BookOpen className="w-4 h-4" />} label="Lộ trình" onClick={closeMenu} />
                <MobileNavLink to="/bang-xep-hang" icon={<Trophy className="w-4 h-4" />} label="Bảng xếp hạng" onClick={closeMenu} />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileNavLink({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold no-underline transition-all duration-200
        ${isActive
          ? "dark:bg-brand-500/10 bg-brand-50 dark:text-brand-400 text-brand-600"
          : "dark:text-gray-400 text-gray-500 dark:hover:text-white hover:text-gray-800 dark:hover:bg-white/5 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      {label}
      <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
    </NavLink>
  );
}
