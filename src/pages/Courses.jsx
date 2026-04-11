import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import { BookOpen, Clock, FileText, ArrowRight, Sparkles } from "lucide-react";

const levelColors = {
  Beginner: { bg: "bg-success-500/10", text: "text-success-500", border: "border-success-500/20" },
  Intermediate: { bg: "bg-warning-500/10", text: "text-warning-500", border: "border-warning-500/20" },
  Advanced: { bg: "bg-danger-500/10", text: "text-danger-500", border: "border-danger-500/20" },
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data || [])).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "All" ? courses : courses.filter((c) => c.level === filter);

  if (loading)
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="gradient-text">Khóa học</span>
          </h1>
          <p className="text-gray-500">Chọn lộ trình học và bắt đầu xây dựng kỹ năng.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-7 flex-wrap">
          {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                ${filter === level
                  ? "bg-gradient-to-r from-brand-500 to-cyan-500 text-white border-transparent shadow-glow-sm"
                  : "bg-dark-100/50 text-gray-400 border-brand-500/15 hover:border-brand-500/30 hover:text-white"
                }`}
            >
              {level === "All" ? "Tất cả" : level}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">Không tìm thấy khóa học nào.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const lc = levelColors[course.level] || levelColors.Beginner;
              return (
                <div key={course._id} className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl
                  overflow-hidden hover:border-brand-500/35 hover:-translate-y-1 transition-all duration-300">
                  {/* Card Header */}
                  <div className="p-6 pb-5 bg-gradient-to-br from-dark-200/50 to-transparent border-b border-brand-500/10">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${lc.bg} ${lc.text} ${lc.border} border`}>
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-2 leading-snug">{course.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{course.description}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(course.tags || []).map((tag) => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-semibold
                          bg-brand-500/10 text-brand-400 border border-brand-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex justify-between items-center mb-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {course.exerciseCount || 0} bài tập
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration || "—"}
                      </span>
                    </div>

                    <NavLink
                      to={`/course/${course._id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white no-underline
                        bg-gradient-to-r from-brand-500 to-cyan-500
                        hover:shadow-glow transition-all duration-200"
                    >
                      <Sparkles className="w-4 h-4" />
                      Bắt đầu
                      <ArrowRight className="w-4 h-4" />
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
