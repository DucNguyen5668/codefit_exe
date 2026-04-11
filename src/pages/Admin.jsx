import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  Users, BookOpen, FileText,
  Plus, Loader2
} from "lucide-react";

export default function Admin() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [exForm, setExForm] = useState({
    courseId: "",
    title: "",
    description: "",
    difficulty: "Easy",
    starterCode: "function solution() {\n  \n}",
    hints: "",
    testCases: [{ input: "", expected: "", description: "" }],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/users/all"),
      api.get("/courses"),
      api.get("/exercises"),
    ])
      .then(([u, c, e]) => {
        setUsers(u.data || []);
        setCourses(c.data || []);
        setExercises(e.data || []);
      })
      .catch(() => {
        setUsers([]);
        setCourses([]);
        setExercises([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const addTestCase = () =>
    setExForm({ ...exForm, testCases: [...exForm.testCases, { input: "", expected: "", description: "" }] });
  const removeTestCase = (i) =>
    setExForm({ ...exForm, testCases: exForm.testCases.filter((_, idx) => idx !== i) });
  const updateTestCase = (i, field, val) => {
    const tcs = [...exForm.testCases];
    tcs[i] = { ...tcs[i], [field]: val };
    setExForm({ ...exForm, testCases: tcs });
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...exForm,
        hints: exForm.hints.split("\n").filter(Boolean),
        testCases: exForm.testCases.filter((tc) => tc.expected),
      };
      await api.post("/exercises", payload);
      toast.success("Tạo bài tập thành công!");
      setExForm({
        courseId: "", title: "", description: "", difficulty: "Easy",
        starterCode: "function solution() {\n  \n}",
        hints: "",
        testCases: [{ input: "", expected: "", description: "" }],
      });
      const res = await api.get("/exercises");
      setExercises(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi tạo bài tập");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  const levelColors = { Beginner: "#00e5a0", Intermediate: "#ffb74d", Advanced: "#ff5252" };

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="gradient-text">Quản trị</span>
          </h1>
          <p className="text-gray-500">Quản lý người dùng, khóa học và bài tập.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: "Tổng người dùng", value: users.length, color: "#6c63ff", bg: "rgba(108,99,255,0.15)" },
            { icon: BookOpen, label: "Khóa học", value: courses.length, color: "#4fc3f7", bg: "rgba(79,195,247,0.15)" },
            { icon: FileText, label: "Bài tập", value: exercises.length, color: "#00e5a0", bg: "rgba(0,229,160,0.15)" },
          ].map((s) => (
            <div key={s.label} className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/10 rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-brand-500/15 pb-0">
          {[
            { key: "users", label: "Người dùng" },
            { key: "exercises", label: "Bài tập" },
            { key: "create", label: "Tạo bài tập" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 border-none cursor-pointer
                ${tab === t.key
                  ? "text-brand-400 border-b-2 border-brand-400"
                  : "text-gray-500 hover:text-gray-300 border-b-2 border-transparent"
                }`}
            >
              {t.key === "create" && <Plus className="w-3.5 h-3.5 inline mr-1" />}
              {t.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === "users" && (
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-dark-900/60 border-b border-brand-500/10">
                    {["Tên", "Email", "Cấp độ", "XP", "Vai trò", "AI còn", "Ngày tham gia"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-white/5 hover:bg-dark-200/20 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">{u.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: levelColors[u.level] || "#fff" }}>
                          {u.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-brand-400 whitespace-nowrap">{u.xp}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                          ${u.role === "admin" ? "bg-brand-500/20 text-brand-400" : "bg-dark-900/60 text-gray-500"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">{u.aiUsageLeft ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Exercises Tab */}
        {tab === "exercises" && (
          <div className="flex flex-col gap-3">
            {exercises.length === 0 ? (
              <div className="text-center py-12 text-gray-600">Chưa có bài tập nào.</div>
            ) : (
              exercises.map((ex) => {
                const course = courses.find((c) => c._id === ex.courseId);
                return (
                  <div key={ex._id} className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/10 rounded-xl p-4 flex items-center gap-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase whitespace-nowrap
                      ${ex.difficulty === "Easy" ? "bg-success-500/10 text-success-500 border border-success-500/20"
                        : ex.difficulty === "Medium" ? "bg-warning-500/10 text-warning-500 border border-warning-500/20"
                          : "bg-danger-500/10 text-danger-500 border border-danger-500/20"}`}>
                      {ex.difficulty}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{ex.title}</div>
                      <div className="text-xs text-gray-600">{course?.title || "Chưa gán khóa"}</div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{ex.testCases?.length || 0} test</span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Create Exercise Tab */}
        {tab === "create" && (
          <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-7">
            <h3 className="font-bold mb-6">Tạo bài tập mới</h3>
            <form onSubmit={handleCreateExercise} className="flex flex-col gap-5">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Khóa học *</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-dark-900/60 border border-brand-500/15 text-white text-sm
                      focus:outline-none focus:border-brand-500 transition-all"
                    value={exForm.courseId}
                    onChange={(e) => setExForm({ ...exForm, courseId: e.target.value })}
                    required
                  >
                    <option value="">Chọn khóa học</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>{c.title} ({c.level})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Độ khó</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-dark-900/60 border border-brand-500/15 text-white text-sm
                      focus:outline-none focus:border-brand-500 transition-all"
                    value={exForm.difficulty}
                    onChange={(e) => setExForm({ ...exForm, difficulty: e.target.value })}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tiêu đề *</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/60 border border-brand-500/15 text-white text-sm
                    placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-all"
                  value={exForm.title}
                  onChange={(e) => setExForm({ ...exForm, title: e.target.value })}
                  placeholder="VD: Tổng hai số"
                  required
                />
              </div>

              {/* Row 3 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mô tả</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/60 border border-brand-500/15 text-white text-sm
                    placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-all resize-none"
                  value={exForm.description}
                  onChange={(e) => setExForm({ ...exForm, description: e.target.value })}
                  rows={3}
                  placeholder="Viết hàm solution(a, b) trả về..."
                />
              </div>

              {/* Row 4 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mã mẫu</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/60 border border-brand-500/15 text-white text-sm
                    font-mono focus:outline-none focus:border-brand-500 transition-all resize-none"
                  value={exForm.starterCode}
                  onChange={(e) => setExForm({ ...exForm, starterCode: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Row 5 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gợi ý (mỗi dòng một)</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-dark-900/60 border border-brand-500/15 text-white text-sm
                    placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-all"
                  value={exForm.hints}
                  onChange={(e) => setExForm({ ...exForm, hints: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Test Cases */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Test cases</label>
                  <button type="button" onClick={addTestCase} className="px-3 py-1.5 rounded-lg text-xs font-semibold
                    bg-dark-900/60 border border-brand-500/15 text-gray-400 hover:border-brand-500/30 hover:text-white transition-all">
                    + Thêm test
                  </button>
                </div>
                {exForm.testCases.map((tc, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-2">
                    <input className="px-3 py-2 rounded-lg bg-dark-900/60 border border-brand-500/15 text-white text-xs
                      placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-all"
                      placeholder="Input" value={tc.input} onChange={(e) => updateTestCase(i, "input", e.target.value)} />
                    <input className="px-3 py-2 rounded-lg bg-dark-900/60 border border-brand-500/15 text-white text-xs
                      placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-all"
                      placeholder="Expected *" value={tc.expected} onChange={(e) => updateTestCase(i, "expected", e.target.value)} required />
                    <input className="px-3 py-2 rounded-lg bg-dark-900/60 border border-brand-500/15 text-white text-xs
                      placeholder:text-gray-600 focus:outline-none focus:border-brand-500 transition-all"
                      placeholder="Mô tả" value={tc.description} onChange={(e) => updateTestCase(i, "description", e.target.value)} />
                    {i > 0 && (
                      <button type="button" onClick={() => removeTestCase(i)}
                        className="px-2 py-2 rounded-lg bg-danger-500/10 border border-danger-500/20 text-danger-400
                          hover:bg-danger-500/20 transition-all text-xs font-bold">
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="submit" disabled={saving}
                className="mt-2 py-3 rounded-xl text-sm font-bold text-white
                  bg-gradient-to-r from-brand-500 to-cyan-500
                  hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang tạo...</> : "Tạo bài tập"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
