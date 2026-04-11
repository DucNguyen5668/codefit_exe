import { useState, useEffect } from "react";
import api from "../services/api";
import ProgressChart from "../components/ProgressChart";
import { authService } from "../services/auth";
import {
  Star, Clock, Send, CheckCircle2, XCircle,
  Zap, BarChart3, BookOpen
} from "lucide-react";

export default function Progress() {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = authService.getUser();

  useEffect(() => {
    Promise.all([api.get("/users/progress"), api.get("/users/me")])
      .then(([progRes, meRes]) => {
        setData(progRes.data);
        setUserData(meRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );

  const submissions = data?.submissions || [];
  const dailyProgress = data?.dailyProgress || [];
  const userInfo = userData?.user || user || {};

  const totalScore = submissions.reduce((s, sub) => s + sub.finalScore, 0);
  const avgScore = submissions.length ? Math.round(totalScore / submissions.length) : 0;
  const totalTime = submissions.reduce((s, sub) => s + sub.timeSpent, 0);
  const passedCount = submissions.filter((s) => s.status === "passed").length;
  const totalSubmits = submissions.reduce((s, sub) => s + sub.submitCount, 0);

  const levelThresholds = { Beginner: [0, 200], Intermediate: [200, 500], Advanced: [500, 1000] };
  const [xpMin, xpMax] = levelThresholds[userInfo.level] || [0, 200];
  const xpPct = Math.min(100, Math.round(((userInfo.xp - xpMin) / (xpMax - xpMin)) * 100));
  const levelColors = { Beginner: "#00e5a0", Intermediate: "#ffb74d", Advanced: "#ff5252" };
  const levelColor = levelColors[userInfo.level] || "#6c63ff";

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="gradient-text">Tiến độ của tôi</span>
          </h1>
          <p className="text-gray-500">Phân tích chi tiết và theo dõi hiệu suất học tập.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-7 mb-6 flex items-center gap-6 flex-wrap">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${levelColor}33, ${levelColor}11)`, border: `2px solid ${levelColor}66` }}>
            <Zap className="w-8 h-8" style={{ color: levelColor }} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-lg font-bold">{userInfo.name || "Người dùng"}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                ${userInfo.level === "Beginner"
                  ? "bg-success-500/10 text-success-500 border border-success-500/20"
                  : userInfo.level === "Intermediate"
                    ? "bg-warning-500/10 text-warning-500 border border-warning-500/20"
                    : "bg-danger-500/10 text-danger-500 border border-danger-500/20"
                }`}
              >
                {userInfo.level}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-3">
              {userInfo.xp || 0} XP tổng &bull; {passedCount} bài đã đạt
            </p>
            <div className="w-full h-2 bg-dark-900/80 rounded-full overflow-hidden mb-1.5">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${xpPct}%`, background: `linear-gradient(90deg, ${levelColor}88, ${levelColor})` }} />
            </div>
            <p className="text-xs text-gray-600">
              {xpPct}% đến{" "}
              {userInfo.level === "Advanced" ? "Cấp tối đa"
                : userInfo.level === "Beginner" ? "Intermediate (200 XP)"
                  : "Advanced (500 XP)"}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          {[
            { icon: Star, label: "Điểm TB", value: avgScore, unit: "/ 100", color: "#6c63ff", bg: "rgba(108,99,255,0.15)" },
            { icon: Clock, label: "Thời gian học", value: `${Math.round(totalTime / 60)}`, unit: " phút", color: "#4fc3f7", bg: "rgba(79,195,247,0.15)" },
            { icon: Send, label: "Tổng lần nộp", value: totalSubmits, unit: "", color: "#ffb74d", bg: "rgba(255,183,77,0.15)" },
            { icon: CheckCircle2, label: "Bài đã đạt", value: passedCount, unit: "", color: "#00e5a0", bg: "rgba(0,229,160,0.15)" },
          ].map((s) => (
            <div key={s.label} className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/10 rounded-xl p-5
              hover:border-brand-500/30 hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>
                {s.value}
                <span className="text-sm font-normal text-gray-600">{s.unit}</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-400" />
              Điểm theo thời gian
            </h3>
            <ProgressChart data={dailyProgress} type="area" />
          </div>
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-400" />
              Lần nộp mỗi ngày
            </h3>
            <ProgressChart data={dailyProgress} type="bar" />
          </div>
        </div>

        {/* Submission History */}
        <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            Lịch sử nộp bài
          </h3>
          {submissions.length === 0 ? (
            <div className="text-center py-10 text-gray-600">Chưa có lần nộp nào. Hãy bắt đầu làm bài tập!</div>
          ) : (
            <div className="flex flex-col gap-2">
              {submissions.slice(0, 15).map((sub) => (
                <div key={sub._id} className="flex items-center gap-4 p-3 rounded-xl
                  bg-dark-900/40 border border-brand-500/10 flex-wrap">
                  {sub.status === "passed"
                    ? <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0" />
                    : <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-[120px]">
                    <div className="font-semibold text-sm">{sub.exerciseId?.title || "Bài tập"}</div>
                    <div className="text-xs text-gray-600">{sub.courseId?.title || ""}</div>
                  </div>
                  <div className="flex gap-4 flex-wrap text-xs text-gray-500">
                    <span>Test: <strong className={sub.status === "passed" ? "text-success-500" : "text-danger-500"}>{sub.passedTests}/{sub.totalTests}</strong></span>
                    <span>Điểm: <strong className="text-brand-400">{sub.finalScore}</strong></span>
                    <span>Thời gian: <strong>{Math.round(sub.timeSpent / 60)} phút</strong></span>
                    <span>Lần thử: <strong>{sub.submitCount}</strong></span>
                  </div>
                  <span className="text-xs text-gray-700 flex-shrink-0">
                    {new Date(sub.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Score Formula */}
        <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-xl p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            Công thức tính điểm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { label: "Tỷ lệ đạt", formula: "passRate × 50", color: "text-success-500", desc: "Dựa trên test case đạt" },
              { label: "Tốc độ", formula: "~20 điểm", color: "text-cyan-400", desc: "Nhanh hơn = nhiều điểm (tối đa 30 phút)" },
              { label: "Nhất quán", formula: "~30 điểm", color: "text-warning-500", desc: "Ít lần nộp = tốt hơn" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-dark-900/40 border border-brand-500/10">
                <div className={`font-bold mb-1 ${item.color}`}>{item.label}</div>
                <div className="font-mono text-xs text-brand-400 mb-1">{item.formula}</div>
                <div className="text-xs text-gray-700">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/15 font-mono text-sm text-brand-400">
            Điểm = (tỷ_lệ_đạt × 50) + (tốc_độ × 20) + (nhất_quán × 30)
          </div>
        </div>
      </div>
    </div>
  );
}
