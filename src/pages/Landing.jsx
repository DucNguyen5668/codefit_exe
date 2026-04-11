import { NavLink } from "react-router-dom";
import { authService } from "../services/auth";
import {
  Trophy, BookOpen, Target,
  Zap, ArrowRight, Code2, Users, TrendingUp
} from "lucide-react";

const bottomFeatures = [
  { icon: Trophy, title: "Bảng xếp hạng", to: "/bang-xep-hang", desc: "Xem thứ hạng", color: "from-yellow-500 to-orange-500" },
  { icon: BookOpen, title: "Bài học", to: "/courses", desc: "Khóa học", color: "from-brand-500 to-cyan-500" },
  { icon: Target, title: "Nhiệm vụ", to: "/courses", desc: "Bài tập", color: "from-green-500 to-emerald-500" },
];

const stats = [
  { icon: Users, value: "2,400+", label: "Học viên" },
  { icon: Code2, value: "200+", label: "Bài tập" },
  { icon: TrendingUp, value: "94%", label: "Tỷ lệ đạt" },
];

export default function Landing() {
  const isLoggedIn = authService.isLoggedIn();

  return (
    <div className="min-h-screen pt-[72px] overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">

        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

        <p className="text-xs font-bold tracking-[0.25em] dark:text-gray-500 text-gray-400 uppercase mb-4">
          Chào mừng đến với
        </p>

        <h1 className="text-7xl md:text-8xl font-black mb-6 leading-none">
          <span className="gradient-text">CodeFit</span>
        </h1>

        <p className="text-lg dark:text-gray-400 text-gray-500 max-w-xl mb-10 leading-relaxed">
          Trải nghiệm lập trình trong 3 tuần với các thử thách như trò chơi để khám phá năng lực IT thật sự của bạn.
        </p>

        <NavLink
          to={isLoggedIn ? "/courses" : "/register"}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold text-white no-underline
            bg-gradient-to-r from-brand-500 to-cyan-500
            hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
        >
          <Zap className="w-5 h-5" />
          Bắt đầu ngay
          <ArrowRight className="w-5 h-5" />
        </NavLink>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-20 flex-wrap justify-center">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg dark:bg-brand-500/10 bg-brand-50 flex items-center justify-center">
                <s.icon className="w-5 h-5 dark:text-brand-400 text-brand-600" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold dark:text-white text-gray-900">{s.value}</div>
                <div className="text-xs dark:text-gray-500 text-gray-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bottomFeatures.map((f) => (
              <NavLink
                key={f.title}
                to={f.to}
                className="group relative dark:bg-[#141d35]/70 bg-white border dark:border-brand-500/15 border-gray-200
                  backdrop-blur-xl rounded-xl p-8
                  dark:hover:border-brand-500/40 hover:-translate-y-1 transition-all duration-300
                  no-underline text-inherit"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-lg font-bold dark:text-white text-gray-900 mb-2 group-hover:text-brand-500 transition-colors">
                  {f.title}
                </div>
                <div className="text-sm dark:text-gray-500 text-gray-400">{f.desc}</div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dark:border-t border-white/5 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 dark:text-gray-600 text-gray-400 text-sm font-medium mb-2">
          <Zap className="w-4 h-4 text-brand-500" />
          CodeFit &mdash; Nền tảng học lập trình
        </div>
        <p className="dark:text-gray-700 text-gray-400 text-xs">&#169; 2026 CodeFit. Xây dựng với passion cho developer.</p>
      </footer>
    </div>
  );
}
