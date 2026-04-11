import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import { authService } from "../services/auth";
import {
  Map, BarChart3, CreditCard,
  Zap, BookOpen, Globe, Server, Smartphone, Monitor
} from "lucide-react";

const profileLinks = [
  { to: "/ban-do", icon: Map, label: "Khóa học", desc: "Lộ trình học tập" },
  { to: "/progress", icon: BarChart3, label: "Tiến độ", desc: "Theo dõi tiến độ" },
  { to: "/thanh-toan", icon: CreditCard, label: "Thanh toán", desc: "Gói học phí" },
];

const careerPaths = [
  { label: "Web Developer", icon: Globe, color: "#6c63ff" },
  { label: "Backend Engineer", icon: Server, color: "#4fc3f7" },
  { label: "Mobile App Developer", icon: Smartphone, color: "#a78bfa" },
  { label: "Software Engineer", icon: Monitor, color: "#34d399" },
];

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const userLocal = authService.getUser();

  useEffect(() => {
    api.get("/users/me").then((res) => setData(res.data)).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  const user = data?.user || userLocal || {};
  const stats = data?.stats || {};

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Quick Links */}
        <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-5 mb-6">
          <h3 className="font-semibold mb-4">Điều hướng nhanh</h3>
          <div className="grid grid-cols-3 gap-3">
            {profileLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className="group bg-dark-200/60 border border-brand-500/10 rounded-xl p-4 flex items-center gap-3 no-underline text-inherit hover:border-brand-500/30 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <l.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <div className="font-semibold text-sm group-hover:text-brand-400 transition-colors">{l.label}</div>
                  <div className="text-xs text-gray-600">{l.desc}</div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Basic Info */}
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/50 to-cyan-500/40 flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0">
              {user.name?.[0] || "C"}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold mb-1">{user.name || "Người dùng CodeFit"}</h1>
              <p className="text-gray-500 text-sm mb-3">{user.email || "demo@codefit.vn"}</p>
              <div className="flex gap-2 flex-wrap">
                {user.level && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                    ${user.level === "Beginner"
                      ? "bg-success-500/10 text-success-500 border border-success-500/20"
                      : user.level === "Intermediate"
                        ? "bg-warning-500/10 text-warning-500 border border-warning-500/20"
                        : "bg-danger-500/10 text-danger-500 border border-danger-500/20"
                    }`}
                  >
                    {user.level}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  XP: {user.xp ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Thống kê dữ liệu</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Tốc độ hiểu thuật toán", key: "algoSpeed" },
                { label: "Khả năng tư duy logic", key: "logic" },
                { label: "Khả năng kiên nhẫn fix bug", key: "patience" },
                { label: "Tần suất học", key: "frequency" },
                { label: "Mức độ hoàn thành nhiệm vụ", key: "completion" },
              ].map((m) => (
                <div key={m.key} className="flex items-center justify-between p-2.5 rounded-lg bg-dark-900/60 border border-white/5 text-sm">
                  <span className="text-gray-400">{m.label}</span>
                  <span className="font-bold text-brand-400">{stats[m.key] ? Math.round(stats[m.key]) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-5">
            <h3 className="font-semibold mb-2">Tổng quan luyện tập</h3>
            <p className="text-gray-500 text-sm">
              Hoàn thành <strong>{stats.completedCount ?? 0}</strong> bài, tổng cộng <strong>{stats.totalSubmits ?? 0}</strong> lần nộp, điểm TB <strong>{stats.avgScore ?? 0}</strong>.
            </p>
          </div>
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-5">
            <h3 className="font-semibold mb-2">XP & Cấp độ</h3>
            <p className="text-gray-500 text-sm">
              Cấp hiện tại: <strong>{user.level || "Beginner"}</strong> · XP: <strong>{user.xp ?? 0}</strong>.
            </p>
          </div>
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-5">
            <h3 className="font-semibold mb-2">Hỗ trợ còn lại</h3>
            <p className="text-gray-500 text-sm">
              Lượt hỗ trợ còn lại: <strong>{user.aiUsageLeft ?? 10}</strong>. Hãy tận dụng để hỏi khi gặp bế tắc.
            </p>
          </div>
        </div>

        {/* Career Paths */}
        <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Lộ trình nghề nghiệp</h3>
          <div className="flex flex-wrap gap-3">
            {careerPaths.map((career) => (
              <div key={career.label} className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm"
                style={{ background: `${career.color}15`, border: `1px solid ${career.color}40`, color: career.color }}>
                <career.icon className="w-4 h-4" />
                {career.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
