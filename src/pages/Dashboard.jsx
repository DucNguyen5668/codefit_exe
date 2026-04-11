import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import { authService } from "../services/auth";
import ProgressChart from "../components/ProgressChart";
import {
  Trophy, Send, Sparkles, Star,
  BookOpen, BarChart3, CreditCard, Settings,
  Zap, CheckCircle2
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getUser();

  useEffect(() => {
    Promise.all([api.get("/users/me"), api.get("/users/progress")])
      .then(([meRes, progressRes]) => {
        setData(meRes.data);
        setProgressData(progressRes.data?.dailyProgress || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center
        dark:bg-[#0a0e1a] bg-gray-50">
        <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );

  const stats = data?.stats || {};
  const userData = data?.user || {};
  const levelColors = { Beginner: "#00e5a0", Intermediate: "#ffb74d", Advanced: "#ff5252" };
  const levelColor = levelColors[userData.level] || "#6c63ff";

  const xpThresholds = { Beginner: [0, 200], Intermediate: [200, 500], Advanced: [500, 1000] };
  const [xpMin, xpMax] = xpThresholds[userData.level] || [0, 200];
  const xpProgress = Math.min(100, Math.round(((userData.xp - xpMin) / (xpMax - xpMin)) * 100));

  return (
    <div className="min-h-screen pt-[72px] dark:bg-[#0a0e1a] bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold dark:text-white text-gray-900">
              Chào mừng trở lại, <span className="gradient-text">{userData.name?.split(" ")[0] || "Bạn"}</span>
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
              ${userData.level === "Beginner"
                ? "dark:bg-success-500/10 dark:text-success-500 dark:border dark:border-success-500/20 bg-green-50 text-green-600 border border-green-200"
                : userData.level === "Intermediate"
                  ? "dark:bg-warning-500/10 dark:text-warning-500 dark:border dark:border-warning-500/20 bg-yellow-50 text-yellow-600 border border-yellow-200"
                  : "dark:bg-danger-500/10 dark:text-danger-500 dark:border dark:border-danger-500/20 bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {userData.level}
            </span>
          </div>
          <p className="dark:text-gray-500 text-gray-400">Tiến độ học tập của bạn.</p>
        </div>

        {/* XP Progress */}
        <div className="dark:bg-[#141d35]/70 bg-white border dark:border-brand-500/15 border-gray-200
          backdrop-blur-xl rounded-2xl p-6 mb-7">
          <div className="flex justify-between items-start mb-3 flex-wrap gap-3">
            <div>
              <h3 className="font-semibold dark:text-white text-gray-900 mb-1">Tiến độ cấp độ</h3>
              <p className="dark:text-gray-500 text-gray-400 text-sm">
                {userData.xp} XP &mdash; {userData.level} &rarr;{" "}
                {userData.level === "Beginner"
                  ? "Intermediate lúc 200 XP"
                  : userData.level === "Intermediate"
                    ? "Advanced lúc 500 XP"
                    : "Cấp tối đa!"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black" style={{ color: levelColor }}>{xpProgress}%</span>
            </div>
          </div>
          <div className="w-full h-2.5 dark:bg-dark-900/80 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${xpProgress}%`, background: `linear-gradient(90deg, ${levelColor}88, ${levelColor})` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          {[
            { icon: Trophy, label: "Bài đã hoàn thành", value: stats.completedCount || 0, color: "#00e5a0", bg: "rgba(0,229,160,0.15)" },
            { icon: Send, label: "Tổng lần nộp", value: stats.totalSubmits || 0, color: "#6c63ff", bg: "rgba(108,99,255,0.15)" },
            { icon: Sparkles, label: "Lượt hỗ trợ còn lại", value: userData.aiUsageLeft ?? 0, color: "#4fc3f7", bg: "rgba(79,195,247,0.15)" },
            { icon: Star, label: "Điểm trung bình", value: stats.avgScore || 0, color: "#ffb74d", bg: "rgba(255,183,77,0.15)" },
          ].map((s) => (
            <div key={s.label} className="dark:bg-[#141d35]/70 bg-white border dark:border-brand-500/10 border-gray-200
              backdrop-blur-xl rounded-xl p-5
              hover:dark:border-brand-500/30 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs dark:text-gray-500 text-gray-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Chart */}
          <div className="dark:bg-[#141d35]/70 bg-white border dark:border-brand-500/15 border-gray-200 backdrop-blur-xl rounded-2xl p-6">
            <h3 className="font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-500" />
              Biểu đồ tiến độ (14 ngày gần nhất)
            </h3>
            {progressData.length > 0 ? (
              <ProgressChart data={progressData} />
            ) : (
              <div className="text-center py-12 dark:text-gray-600 text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có dữ liệu &mdash; hãy bắt đầu làm bài tập!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Quick Actions */}
            <div className="dark:bg-[#141d35]/70 bg-white border dark:border-brand-500/15 border-gray-200 backdrop-blur-xl rounded-xl p-5">
              <h3 className="font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning-500" />
                Hành động nhanh
              </h3>
              <div className="flex flex-col gap-2">
                <NavLink to="/courses" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold
                  bg-gradient-to-r from-brand-500 to-cyan-500 text-white
                  hover:shadow-glow transition-all duration-200 no-underline">
                  <BookOpen className="w-4 h-4" />
                  Xem khóa học
                </NavLink>
                <NavLink to="/progress" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold
                  dark:bg-dark-900/60 dark:border dark:border-brand-500/20 dark:text-gray-300
                  bg-gray-50 border border-gray-200 text-gray-600
                  hover:dark:border-brand-500/40 hover:dark:text-white hover:bg-gray-100
                  transition-all duration-200 no-underline">
                  <BarChart3 className="w-4 h-4" />
                  Xem tiến độ
                </NavLink>
                <NavLink to="/thanh-toan" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold
                  dark:bg-dark-900/40 dark:border dark:border-white/5 dark:text-gray-500
                  bg-gray-50 border border-gray-200 text-gray-500
                  hover:dark:text-gray-300 hover:bg-gray-100
                  transition-all duration-200 no-underline">
                  <CreditCard className="w-4 h-4" />
                  Thanh toán
                </NavLink>
                {user?.role === "admin" && (
                  <NavLink to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold
                    dark:bg-dark-900/40 dark:border dark:border-white/5 dark:text-gray-500
                    bg-gray-50 border border-gray-200 text-gray-500
                    hover:dark:text-gray-300 hover:bg-gray-100
                    transition-all duration-200 no-underline">
                    <Settings className="w-4 h-4" />
                    Quản trị
                  </NavLink>
                )}
              </div>
            </div>

            {/* Stats Detail */}
            <div className="dark:bg-[#141d35]/70 bg-white border dark:border-brand-500/15 border-gray-200 backdrop-blur-xl rounded-xl p-5">
              <h3 className="font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                Theo dõi chi tiết
              </h3>
              {[
                { label: "Thời gian học", value: `${Math.round((stats.totalTimeSpent || 0) / 60)} phút` },
                { label: "Bài đã đạt", value: stats.passedCount || 0 },
                { label: "Tổng XP", value: `${userData.xp || 0} XP` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2.5 border-b dark:border-white/5 border-gray-100 last:border-0">
                  <span className="dark:text-gray-500 text-gray-400 text-sm">{item.label}</span>
                  <span className="font-semibold text-sm dark:text-white text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
