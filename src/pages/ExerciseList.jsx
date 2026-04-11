import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import api from "../services/api";
import { CheckCircle2, Circle, ChevronRight, BookOpen } from "lucide-react";

const difficultyBadge = {
  Easy:    { bg: "bg-success-500/10",  text: "text-success-500",  border: "border-success-500/20"  },
  Medium:  { bg: "bg-warning-500/10", text: "text-warning-500",  border: "border-warning-500/20" },
  Hard:    { bg: "bg-danger-500/10",  text: "text-danger-500",   border: "border-danger-500/20"  },
};
const statusText = { passed: "Hoàn thành", failed: "Đang làm", none: "Chưa bắt đầu" };

export default function ExerciseList() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${courseId}`),
      api.get(`/exercises?courseId=${courseId}`),
      api.get("/submissions/my"),
    ])
      .then(([courseRes, exRes, subRes]) => {
        setCourse(courseRes.data);
        setExercises(exRes.data || []);
        const subMap = {};
        (subRes.data || []).forEach((s) => {
          const eid = s.exerciseId?._id || s.exerciseId;
          if (eid) subMap[eid] = s.status;
        });
        setSubmissions(subMap);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading)
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );

  const passedCount = exercises.filter((e) => submissions[e._id] === "passed").length;
  const progressPct = exercises.length > 0 ? Math.round((passedCount / exercises.length) * 100) : 0;

  return (
    <div className="min-h-screen pt-[72px]">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <NavLink to="/courses" className="hover:text-brand-400 transition-colors no-underline">Khóa học</NavLink>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{course?.title || "Khóa học"}</span>
        </div>

        {/* Course Card */}
        <div className="bg-dark-100/70 backdrop-blur-xl border border-brand-500/15 rounded-2xl p-7 mb-7">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-bold">{course?.title}</h1>
                {course?.level && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                    ${course.level === "Beginner"
                      ? "bg-success-500/10 text-success-500 border border-success-500/20"
                      : course.level === "Intermediate"
                        ? "bg-warning-500/10 text-warning-500 border border-warning-500/20"
                        : "bg-danger-500/10 text-danger-500 border border-danger-500/20"
                    }`}
                  >
                    {course.level}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm max-w-lg">{course?.description}</p>
            </div>
            <div className="text-right min-w-[100px]">
              <div className="text-3xl font-black text-brand-500">{progressPct}%</div>
              <div className="text-xs text-gray-600">Hoàn thành</div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1.5">
              <span>{passedCount} / {exercises.length} bài đã hoàn thành</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-dark-900/80 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex flex-col gap-3">
          {exercises.map((ex, idx) => {
            const status = submissions[ex._id] || "none";
            const isPassed = status === "passed";
            const db = difficultyBadge[ex.difficulty] || difficultyBadge.Easy;
            return (
              <NavLink key={ex._id} to={`/exercise/${ex._id}`} className="no-underline group">
                <div className={`bg-dark-100/70 backdrop-blur-xl border rounded-xl p-4 flex items-center gap-4
                  hover:-translate-y-0.5 transition-all duration-200
                  ${isPassed ? "border-success-500/25" : "border-brand-500/10 hover:border-brand-500/30"}`}>
                  {/* Number / Check */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm
                    ${isPassed
                      ? "bg-success-500/15 text-success-500 border border-success-500/30"
                      : "bg-dark-900/60 text-gray-600 border border-brand-500/10"
                    }`}
                  >
                    {isPassed
                      ? <CheckCircle2 className="w-5 h-5" />
                      : idx + 1
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm group-hover:text-brand-400 transition-colors">{ex.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${db.bg} ${db.text} ${db.border} border`}>
                        {ex.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs truncate">
                      {ex.description?.split("\n")[0] || "Bài tập lập trình"}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold ${isPassed ? "text-success-500" : "text-gray-600"}`}>
                      {statusText[status]}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-brand-400 transition-colors" />
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
