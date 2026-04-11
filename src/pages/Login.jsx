import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { authService } from "../services/auth";
import { toast } from "react-toastify";
import { Zap, Mail, Lock, User, Loader2 } from "lucide-react";

export default function Login({ defaultTab = "login" }) {
  const [tab, setTab] = useState(defaultTab);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await authService.login(form.email, form.password);
        toast.success("Chào mừng bạn quay trở lại!");
        navigate("/dashboard");
      } else {
        if (!form.name) {
          setError("Vui lòng nhập tên");
          setLoading(false);
          return;
        }
        await authService.register(form.name, form.email, form.password);
        toast.success("Tạo tài khoản thành công!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center px-4
      bg-gradient-radial from-brand-500/10 via-transparent to-transparent
      dark:bg-gradient-radial dark:from-brand-500/10 dark:via-transparent dark:to-transparent
      bg-gray-50">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="gradient-text">CodeFit</span>
          </span>
        </div>

        {/* Card */}
        <div className="dark:bg-[#141d35]/70 bg-white/80 backdrop-blur-xl border dark:border-brand-500/15 border-gray-200 rounded-2xl p-8 shadow-card">
          {/* Tabs */}
          <div className="flex dark:bg-[#0a0e1a]/80 bg-gray-100 rounded-xl p-1 mb-6">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border-none cursor-pointer
                  ${tab === t
                    ? "bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-glow-sm"
                    : "dark:text-gray-500 text-gray-400 hover:dark:text-gray-300 hover:text-gray-600"
                  }`}
              >
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-1">
            {tab === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản"}
          </h2>
          <p className="dark:text-gray-500 text-gray-400 text-sm mb-6">
            {tab === "login"
              ? "Đăng nhập để tiếp tục học tập"
              : "Bắt đầu hành trình lập trình của bạn ngay hôm nay"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl dark:bg-danger-500/10 dark:border dark:border-danger-500/20 dark:text-danger-400
              bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">Họ tên</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-gray-600 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:dark:text-gray-600 placeholder:text-gray-400
                      dark:bg-dark-900/60 dark:border dark:border-brand-500/15 dark:text-white
                      bg-gray-50 border border-gray-200 text-gray-900
                      focus:outline-none focus:dark:border-brand-500 focus:dark:bg-brand-500/5
                      focus:outline-none focus:border-brand-500 focus:bg-brand-50
                      transition-all duration-200"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-gray-600 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:dark:text-gray-600 placeholder:text-gray-400
                    dark:bg-dark-900/60 dark:border dark:border-brand-500/15 dark:text-white
                    bg-gray-50 border border-gray-200 text-gray-900
                    focus:outline-none focus:dark:border-brand-500 focus:dark:bg-brand-500/5
                    focus:outline-none focus:border-brand-500 focus:bg-brand-50
                    transition-all duration-200"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-gray-600 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder:dark:text-gray-600 placeholder:text-gray-400
                    dark:bg-dark-900/60 dark:border dark:border-brand-500/15 dark:text-white
                    bg-gray-50 border border-gray-200 text-gray-900
                    focus:outline-none focus:dark:border-brand-500 focus:dark:bg-brand-500/5
                    focus:outline-none focus:border-brand-500 focus:bg-brand-50
                    transition-all duration-200"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3 rounded-xl text-sm font-bold text-white
                bg-gradient-to-r from-brand-500 to-cyan-500
                hover:shadow-glow transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
              ) : (
                tab === "login" ? "Đăng nhập" : "Tạo tài khoản"
              )}
            </button>
          </form>

          {tab === "login" && (
            <div className="mt-5 p-3 rounded-xl dark:bg-dark-900/60 dark:border dark:border-brand-500/10
              bg-gray-100 border border-gray-200">
              <p className="dark:text-gray-600 text-gray-500 text-xs mb-1">
                Demo: <span className="dark:text-cyan-400 text-cyan-600 font-mono text-xs">demo@codefit.vn / 123456</span>
              </p>
              <p className="dark:text-gray-600 text-gray-500 text-xs">
                Admin: <span className="dark:text-brand-400 text-brand-600 font-mono text-xs">admin@codefit.vn / 123456</span>
              </p>
            </div>
          )}

          <p className="text-center mt-5 text-sm dark:text-gray-500 text-gray-400">
            {tab === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button
              onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
              className="dark:text-brand-400 text-brand-600 font-semibold hover:dark:text-brand-300 hover:text-brand-700 transition-colors bg-none border-none cursor-pointer"
            >
              {tab === "login" ? "Đăng ký" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
