import { NavLink } from "react-router-dom";
import {
  BookOpen, ArrowRight, Lock, Sparkles,
  CheckCircle2
} from "lucide-react";

const path1 = [
  { id: "c1", label: "JS Cơ bản", unlocked: true, courseId: "c1", desc: "Biến, hàm, vòng lặp" },
  { id: "c2", label: "JS Nâng cao", unlocked: true, courseId: "c2", desc: "ES6+, Map, Filter" },
  { id: "c3", label: "Thuật Toán", unlocked: true, courseId: "c3", desc: "Tìm kiếm, Sắp xếp" },
];

const path2 = [
  { id: "c4", label: "HTML Cơ bản", unlocked: false, courseId: "c4", desc: "Thẻ, cấu trúc trang" },
  { id: "c5", label: "HTML Trung cấp", unlocked: false, courseId: "c5", desc: "Semantic, Form nâng cao" },
  { id: "c6", label: "HTML Nâng cao", unlocked: false, courseId: "c6", desc: "SEO, Performance" },
];

function PathNode({ node, isLast }) {
  const locked = !node.unlocked;
  return (
    <div className="relative flex flex-col items-center">
      <NavLink
        to={!locked ? `/course/${node.courseId}` : "#"}
        className={`group block w-36 text-center no-underline
          bg-dark-200/70 border rounded-xl p-5
          transition-all duration-200
          ${locked
            ? "opacity-50 cursor-not-allowed border-brand-500/10"
            : "border-brand-500/30 hover:border-brand-500/60 hover:-translate-y-1 hover:shadow-glow-sm"
          }`}
        onClick={(e) => locked && e.preventDefault()}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-cyan-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-3">
          {locked
            ? <Lock className="w-5 h-5 text-gray-600" />
            : <BookOpen className="w-5 h-5 text-brand-400" />
          }
        </div>
        <div className={`text-sm font-bold mb-1 ${locked ? "text-gray-600" : "text-white group-hover:text-brand-400 transition-colors"}`}>
          {locked ? "???" : node.label}
        </div>
        <div className="text-xs text-gray-700 mb-3 min-h-[32px]">
          {locked ? "Chưa mở khóa" : node.desc}
        </div>
        <div className={`w-full py-1.5 rounded-lg text-xs font-bold text-center
          ${locked
            ? "bg-dark-900/60 text-gray-600 border border-white/5"
            : "bg-gradient-to-r from-brand-500 to-cyan-500 text-white"
          }`}
        >
          {locked ? "Chưa mở khóa" : "Vào học"}
        </div>
      </NavLink>

      {!isLast && (
        <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-brand-500/60 to-transparent" />
      )}
    </div>
  );
}

export default function Map() {
  return (
    <div className="min-h-screen pt-[72px]">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            <span className="gradient-text">Bản Đồ Học Tập</span>
          </h1>
          <p className="text-gray-500">
            Hoàn thành <strong>Lộ trình 1</strong> để mở khóa <strong>Lộ trình 2</strong>
          </p>
        </div>

        {/* Path 1 */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1 bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full text-xs font-bold text-white">
              LỘ TRÌNH 1
            </div>
            <h2 className="text-base font-bold">JavaScript — Từ Cơ Bản đến Thuật Toán</h2>
          </div>
          <div className="bg-dark-100/50 border border-brand-500/15 rounded-2xl p-8 flex items-center gap-6 flex-wrap">
            {path1.map((node, i) => (
              <PathNode key={node.id} node={node} isLast={i === path1.length - 1} />
            ))}
            <div className="ml-auto px-5 py-3 rounded-xl bg-success-500/8 border border-success-500/20 text-center">
              <CheckCircle2 className="w-6 h-6 text-success-500 mx-auto mb-1" />
              <div className="text-xs font-bold text-success-500">MỞ KHÓA LỘ TRÌNH 2</div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="text-center mb-14">
          <div className="w-8 h-8 rounded-full bg-dark-200/80 border border-brand-500/20 flex items-center justify-center mx-auto mb-2 text-gray-600">
            ↓
          </div>
          <div className="text-xs text-gray-600">Hoàn thành Lộ trình 1 để mở khóa</div>
        </div>

        {/* Path 2 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-500 rounded-full text-xs font-bold text-white">
              LỘ TRÌNH 2
            </div>
            <h2 className="text-base font-bold">HTML — Từ Cơ Bản đến SEO & Performance</h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-gray-600 border border-brand-500/10 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Yêu cầu hoàn thành Lộ trình 1
            </span>
          </div>
          <div className="bg-dark-100/30 border border-dashed border-brand-500/15 rounded-2xl p-8 flex items-center gap-6 flex-wrap opacity-70">
            {path2.map((node, i) => (
              <PathNode key={node.id} node={node} isLast={i === path2.length - 1} />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-10 flex-wrap">
          <NavLink to="/courses" className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white no-underline
            bg-gradient-to-r from-brand-500 to-cyan-500 hover:shadow-glow transition-all duration-200">
            <BookOpen className="w-4 h-4" />
            Xem tất cả khóa học
          </NavLink>
          <NavLink to="/course/c1" className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-400 no-underline
            bg-dark-100/60 border border-brand-500/15 hover:border-brand-500/30 hover:text-white transition-all">
            <Sparkles className="w-4 h-4" />
            Bắt đầu JS Cơ bản
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}
