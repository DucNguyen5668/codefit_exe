import { useState, useEffect, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  ChevronLeft, Play, Send, CheckCircle2,
  XCircle, Clock, BarChart3, Lock
} from "lucide-react";

export default function Exercise() {
    const { id } = useParams();
    const [exercise, setExercise] = useState(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [missionState, setMissionState] = useState("briefing");
    const [unlockedHints, setUnlockedHints] = useState(0);
    const [pendingHintIdx, setPendingHintIdx] = useState(null);
    const [seconds, setSeconds] = useState(0);
    const [actualSubmissions, setActualSubmissions] = useState(0);
    const startTimeRef = useRef(new Date().toISOString());

    const isTutorial = exercise?.title?.includes("[Mẫu]");

    useEffect(() => {
        let interval;
        if (missionState === "active" && !isTutorial) {
            interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [missionState, isTutorial]);

    useEffect(() => {
        if (seconds >= 1800 && missionState === "active" && !isTutorial) {
            handleSubmit();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seconds, missionState, isTutorial]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    const getTimerColor = () => {
        if (seconds < 900) return "#00e517";
        if (seconds < 1200) return "#ffd166";
        return "#ff5252";
    };
    const progressWidth = Math.min((seconds / 1800) * 100, 100);
    const getEvaluationData = () => {
        if (exercise?.difficulty?.toLowerCase() !== 'easy') return { label: "HOÀN THÀNH", color: "#6c63ff" };
        if (seconds < 180) return { label: "HOÀN THÀNH XUẤT SẮC", color: "#00ff1e" };
        if (seconds < 600) return { label: "HOÀN THÀNH TỐT", color: "#00e554" };
        if (seconds < 1800) return { label: "HOÀN THÀNH TỐI THIỂU", color: "#FFD166" };
        return { label: "KẾT QUẢ: HẾT GIỜ", color: "#FF5252" };
    };

    useEffect(() => {
        Promise.all([
            api.get(`/exercises/${id}`),
            api.get(`/submissions/exercise/${id}`),
        ]).then(([exRes, subRes]) => {
            const ex = exRes.data;
            setExercise(ex);
            if (subRes.data) {
                setSubmission(subRes.data);
                setActualSubmissions(subRes.data.submitCount || 0);
                setCode(subRes.data.code || ex.starterCode);
            } else {
                setCode(ex.starterCode);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    const handleRun = async () => {
        toast.info("Đang xử lý kết quả máy chủ...");
        setActualSubmissions(prev => prev + 1);
        setRunning(true);
        try {
            const res = await api.post("/submissions/run", { exerciseId: id, code });
            const results = res.data.testResults;
            setTestResults(results);
            const passed = results.filter((t) => t.passed).length;
            const total = results.length;
            if (passed < total) toast.warn(`Chạy xong: ${passed}/${total} test case đạt.`);
            else toast.success(`Tất cả ${total} test case đều đạt.`);
        } catch (err) {
            toast.error("Lỗi khi chạy code: " + err.message);
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        setActualSubmissions(prev => prev + 1);
        setSubmitting(true);
        try {
            const res = await api.post("/submissions/submit", {
                exerciseId: id, code,
                startTime: startTimeRef.current,
                errorCount: 0,
                hintsUsed: unlockedHints
            });
            setSubmission(res.data.submission);
            if (res.data.submission.submitCount !== undefined) {
                setActualSubmissions(prev => Math.max(prev, res.data.submission.submitCount));
            }
            setTestResults(res.data.testResults);
            const passed = res.data.testResults.filter((t) => t.passed).length;
            const total = res.data.testResults.length;
            if (passed === total) {
                toast.success(`Tất cả ${total} test đạt! Cập nhật tiến trình...`);
                setMissionState("completed");
            } else {
                toast.warn(`${passed}/${total} test đạt`);
            }
        } catch {
            toast.error("Lỗi nộp bài");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-[72px] flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
        </div>
    );

    if (!exercise) return (
        <div className="min-h-screen pt-[72px] flex items-center justify-center flex-col gap-4">
            <p className="text-gray-500">Không tìm thấy bài tập</p>
            <NavLink to="/courses" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white no-underline
                bg-gradient-to-r from-brand-500 to-cyan-500 hover:shadow-glow transition-all">
                Quay lại Khóa học
            </NavLink>
        </div>
    );

    const passedAll = submission?.status === "passed";

    return (
        <div className="min-h-screen flex flex-col" style={{ paddingTop: 72, position: "relative" }}>
            {/* Gamification Overlays */}
            {missionState === "briefing" && (
                <div className="mission-overlay">
                    <h2 className="mission-title">SYSTEM BRIEFING</h2>
                    <div className="mission-brief">
                        {exercise.instruction || exercise.description}
                    </div>
                    {exercise.rewards && (
                        <div className="mission-rewards">
                            <div className="reward-box">+{exercise.rewards.xp} XP</div>
                            <div className="reward-box">+{exercise.rewards.coins} CORE</div>
                        </div>
                    )}
                    <button className="btn-mission" onClick={() => setMissionState("active")}>
                        NHẬN NHIỆM VỤ
                    </button>
                </div>
            )}

            {missionState === "completed" && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 100,
                    background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    animation: "zoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}>
                    <div className="text-center" style={{ width: "100%", maxWidth: 800, animation: "slideDown 0.6s cubic-bezier(0.23, 1, 0.32, 1)" }}>
                        <h2 className="accomplished-title" style={{ fontSize: "4.5rem", marginBottom: 10 }}>
                            MISSION ACCOMPLISHED
                        </h2>

                        {!isTutorial && (
                            <div style={{ margin: "40px 0" }}>
                                <div style={{
                                    background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "30px 60px",
                                    boxShadow: `0 0 50px ${getEvaluationData().color}20`
                                }}>
                                    <div style={{
                                        color: getEvaluationData().color, fontSize: "1.8rem", fontWeight: 900,
                                        letterSpacing: 2, textTransform: "uppercase", marginBottom: 25,
                                        textShadow: `0 0 20px ${getEvaluationData().color}40`
                                    }}>
                                        XẾP HẠNG: {getEvaluationData().label}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "center", gap: 60 }}>
                                        <div className="text-center">
                                            <div className="text-xs uppercase tracking-widest text-gray-600 mb-2">Thời gian</div>
                                            <div className="text-2xl font-bold font-mono text-white">{formatTime(seconds)}</div>
                                        </div>
                                        <div className="w-px bg-white/10" />
                                        <div className="text-center">
                                            <div className="text-xs uppercase tracking-widest text-gray-600 mb-2">Lần nộp</div>
                                            <div className="text-2xl font-bold font-mono text-white">{actualSubmissions}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mb-12">
                            <div className="text-white text-xl font-medium mb-2">
                                ĐIỂM GHI NHẬN: <span className="text-success-500 font-black">{submission?.finalScore || 100}</span>
                            </div>
                            <div className="text-gray-500 text-base">
                                PHẦN THƯỞNG: <span className="text-warning-500 font-bold">{exercise.rewards?.xp || 100} XP</span>
                            </div>
                        </div>

                        <div className="flex gap-5 justify-center flex-wrap">
                            <button className="btn-mission" onClick={() => setMissionState("active")}
                                style={{ fontSize: "1rem", padding: "16px 36px", color: "#fff", borderColor: "rgba(255,255,255,0.3)", borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
                                PHÂN TÍCH LẠI CODE
                            </button>
                            <NavLink to={`/course/${exercise.courseId}`} className="btn-mission"
                                style={{ fontSize: "1rem", padding: "16px 40px", background: "#00e5a0", color: "#000", textDecoration: "none", borderRadius: 12, fontWeight: 700 }}>
                                KẾT THÚC NHIỆM VỤ
                            </NavLink>
                        </div>
                    </div>
                </div>
            )}

            {/* Top bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3
                bg-dark-100/80 backdrop-blur-xl border-b border-brand-500/15"
                style={{ zIndex: 50 }}>
                <div className="flex items-center gap-3">
                    <NavLink to={`/course/${exercise.courseId}`} className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors no-underline text-sm">
                        <ChevronLeft className="w-4 h-4" />
                        Quay lại
                    </NavLink>
                    <span className="text-gray-800">|</span>
                    <h3 className="text-sm font-semibold">{exercise.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase
                        ${exercise.difficulty === "Easy" ? "bg-success-500/10 text-success-500 border border-success-500/20"
                        : exercise.difficulty === "Medium" ? "bg-warning-500/10 text-warning-500 border border-warning-500/20"
                        : "bg-danger-500/10 text-danger-500 border border-danger-500/20"}`}>
                        {exercise.difficulty}
                    </span>
                    {passedAll && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold
                            bg-success-500/10 text-success-500 border border-success-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Hoàn thành
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRun}
                        disabled={running}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white
                            bg-brand-500/20 border border-brand-500/40
                            hover:bg-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {running
                            ? <><div className="w-3.5 h-3.5 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin" /></>
                            : <Play className="w-3.5 h-3.5" />
                        }
                        Chạy thử
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-black
                            bg-gradient-to-r from-success-500 to-emerald-400
                            hover:shadow-success-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting
                            ? <><div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" /></>
                            : <Send className="w-3.5 h-3.5" />
                        }
                        Nộp bài
                    </button>
                </div>
            </div>

            {/* Timer */}
            {!isTutorial && (
                <div className="flex items-center gap-4 px-5 py-2 bg-black/20 border-b border-white/5">
                    <div className="flex items-center gap-2 min-w-[140px]">
                        <Clock className="w-3.5 h-3.5" style={{ color: getTimerColor() }} />
                        <span className="font-mono text-sm font-bold" style={{ color: getTimerColor() }}>
                            {formatTime(seconds)}
                        </span>
                        <span className="text-gray-700 text-xs">• {actualSubmissions} lần nộp</span>
                    </div>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div style={{
                            width: `${progressWidth}%`, height: "100%",
                            background: getTimerColor(),
                            transition: "width 1s linear, background 0.5s ease"
                        }} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Description */}
                <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-brand-500/15 p-5 bg-dark-100/50">
                    <h3 className="font-bold mb-3">{exercise.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line mb-5">
                        {exercise.description}
                    </p>

                    {/* Test Cases */}
                    <div className="mb-5">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Test case</h4>
                        {exercise.testCases?.map((tc, i) => (
                            <div key={i} className="mb-2 p-3 rounded-lg bg-dark-900/60 border border-brand-500/10 text-xs">
                                <div className="text-gray-500 mb-1">{tc.description || `Test ${i + 1}`}</div>
                                {tc.input && <div className="font-mono text-cyan-400 mb-0.5">Đầu vào: {tc.input}</div>}
                                <div className="font-mono text-success-500">Kỳ vọng: {String(tc.expected)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Hints */}
                    {exercise.hints?.length > 0 && (
                        <div className="mb-5">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Dữ liệu giải mã</h4>
                            {exercise.hints.map((hint, i) => {
                                if (i < unlockedHints || isTutorial) {
                                    return (
                                        <div key={i} className="hint-unlocked leading-relaxed">
                                            {hint}
                                        </div>
                                    );
                                } else if (i === unlockedHints) {
                                    return (
                                        <div key={i} className="hint-locked">
                                            <button className="hint-btn flex items-center gap-2" onClick={() => setPendingHintIdx(i)}>
                                                <Lock className="w-3.5 h-3.5" />
                                                GIẢI MÃ CẤP {i + 1}
                                            </button>
                                            {pendingHintIdx === i && (
                                                <div className="mt-3 p-3 rounded-lg bg-warning-500/10 border border-warning-500/30 text-xs text-warning-500" style={{ animation: "fadeIn 0.2s ease" }}>
                                                    <div className="font-bold mb-2">Cảnh báo điểm trừ</div>
                                                    <div className="opacity-70 mb-3">Mở gợi ý này sẽ bị trừ <strong>10%</strong> tổng điểm. Bạn có chắc?</div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => { setUnlockedHints(u => u + 1); setPendingHintIdx(null); }}
                                                            className="px-3 py-1.5 rounded text-xs font-bold cursor-pointer
                                                                bg-danger-500/20 border border-danger-500/50 text-danger-400
                                                                hover:bg-danger-500/30 transition-all"
                                                        >Chấp nhận (-10%)</button>
                                                        <button
                                                            onClick={() => setPendingHintIdx(null)}
                                                            className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer
                                                                bg-dark-900/60 border border-white/10 text-gray-500
                                                                hover:bg-white/5 transition-all"
                                                        >Hủy</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}

                    {/* Score */}
                    {submission && !isTutorial && (
                        <div className="p-3 rounded-lg bg-brand-500/5 border border-brand-500/15">
                            <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                                <BarChart3 className="w-3.5 h-3.5 text-brand-400" />
                                Lần nộp gần nhất
                            </h4>
                            <div className="flex gap-3 flex-wrap text-xs text-gray-500">
                                <span>Điểm: <strong className="text-brand-400">{submission.finalScore}</strong></span>
                                <span>Test: <strong className={submission.status === "passed" ? "text-success-500" : "text-danger-500"}>
                                    {submission.passedTests}/{submission.totalTests}
                                </strong></span>
                                <span>Lần thứ: <strong>{submission.submitCount}</strong></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Center: Editor */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            language="javascript"
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            theme="vs-dark"
                            options={{
                                fontSize: 14, minimap: { enabled: false },
                                scrollBeyondLastLine: false, padding: { top: 16 },
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                fontLigatures: true, lineNumbers: "on",
                                glyphMargin: false, automaticLayout: true, tabSize: 2,
                            }}
                        />
                    </div>

                    {/* Test Results */}
                    {testResults && (
                        <div className="h-44 overflow-y-auto bg-[#0d1117] border-t border-brand-500/15 p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold">Kết quả test</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold
                                    ${testResults.filter((t) => t.passed).length === testResults.length
                                        ? "bg-success-500/20 text-success-500"
                                        : "bg-danger-500/20 text-danger-500"}`}>
                                    {testResults.filter((t) => t.passed).length}/{testResults.length} đạt
                                </span>
                            </div>
                            {testResults.map((tr, i) => (
                                <div key={i} className={`flex items-start gap-2 mb-1.5 p-2 rounded-lg text-xs
                                    ${tr.passed ? "bg-success-500/7 border border-success-500/20" : "bg-danger-500/7 border border-danger-500/20"}`}>
                                    {tr.passed
                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-success-500 flex-shrink-0 mt-0.5" />
                                        : <XCircle className="w-3.5 h-3.5 text-danger-500 flex-shrink-0 mt-0.5" />
                                    }
                                    <div className="font-mono leading-relaxed">
                                        <span className="text-gray-500">{tr.description || `Test ${i + 1}`}: </span>
                                        {!tr.passed && <span className="text-danger-400">Nhận: {tr.got}, Kỳ vọng: {tr.expected}</span>}
                                        {tr.passed && <span className="text-success-400">Đạt</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
