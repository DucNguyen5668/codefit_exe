import { useState } from "react";
import { NavLink } from "react-router-dom";
import { mockUsers } from "../services/mockData";
import { Trophy, Zap, ArrowRight, Medal } from "lucide-react";

export default function Leaderboard() {
  const [period, setPeriod] = useState("week");
  const leaders = [...mockUsers].sort((a, b) => b.xp - a.xp);

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-yellow-500" />
            <span className="gradient-text">Bảng xếp hạng</span>
          </h1>
          <p className="text-gray-500">Xem ai đang dẫn đầu cộng đồng CodeFit</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-7 flex-wrap">
          {["week", "month", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                ${period === p
                  ? "bg-gradient-to-r from-brand-500 to-cyan-500 text-white border-transparent shadow-glow-sm"
                  : "bg-dark-100/50 text-gray-400 border-brand-500/15 hover:border-brand-500/30 hover:text-white"
                }`}
            >
              {p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Tất cả"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-dark-900/60 border-b border-brand-500/10">
                  {["#", "Người dùng", "XP", "Cấp độ"].map((h) => (
                    <th key={h} className={`px-5 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider ${h === "#" ? "w-16" : ""} ${h === "XP" ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaders.map((u, i) => (
                  <tr key={u._id} className={`border-b border-white/5 transition-colors hover:bg-dark-200/30
                    ${i < 3 ? "bg-brand-500/3" : ""}`}>
                    <td className="px-5 py-4">
                      {i === 0 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <Medal className="w-4 h-4 text-white" />
                        </div>
                      ) : i === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                          <Medal className="w-4 h-4 text-white" />
                        </div>
                      ) : i === 2 ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                          <Medal className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-600">{i + 1}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{u.name}</div>
                          <div className="text-xs text-gray-600">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-brand-400">{u.xp} XP</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                        ${u.level === "Beginner"
                          ? "bg-success-500/10 text-success-500 border border-success-500/20"
                          : u.level === "Intermediate"
                            ? "bg-warning-500/10 text-warning-500 border border-warning-500/20"
                            : "bg-danger-500/10 text-danger-500 border border-danger-500/20"
                        }`}
                      >
                        {u.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <NavLink to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white no-underline
            bg-gradient-to-r from-brand-500 to-cyan-500 hover:shadow-glow transition-all duration-200">
            <Zap className="w-4 h-4" />
            Tham gia và leo hạng
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}
