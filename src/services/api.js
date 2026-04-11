import axios from "axios";
import { DEMO_MODE } from "../config";
import * as mockData from "./mockData";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Lịch sử persistence cho progress bar và profile
const getMockSubmissions = () => {
  try {
    return JSON.parse(localStorage.getItem("mock_submissions") || "[]");
  } catch {
    return [];
  }
};

const saveMockSubmissions = (subs) => {
  localStorage.setItem("mock_submissions", JSON.stringify(subs));
};

// Mock API cho chế độ demo (Netlify deploy)
const mockApi = {
  get: async (url) => {
    await new Promise((r) => setTimeout(r, 300));
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (url === "/courses") return { data: mockData.mockCourses };
    if (url.startsWith("/courses/")) {
      const id = url.split("/")[2];
      const course = mockData.mockCourses.find((c) => c._id === id);
      return { data: course || mockData.mockCourses[0] };
    }
    if (url.startsWith("/exercises") && !url.includes("/exercises/")) {
      const params = new URLSearchParams(url.split("?")[1] || "");
      const courseId = params.get("courseId");
      const list = courseId
        ? (mockData.mockExercises[courseId] || mockData.mockExercises.c1)
        : Object.values(mockData.mockExercises).flat();
      return { data: list };
    }
    if (url.startsWith("/exercises/")) {
      const id = url.split("/")[2];
      let ex = null, courseId = "c1";
      for (const [cid, list] of Object.entries(mockData.mockExercises)) {
        const found = list.find((e) => e._id === id);
        if (found) {
          ex = found;
          courseId = cid;
          break;
        }
      }
      ex = ex || Object.values(mockData.mockExercises).flat()[0];
      return {
        data: {
          ...ex,
          description: ex.description || "Mô tả bài tập.",
          instruction: ex.instruction || "ĐĂNG NHẬP HỆ THỐNG...\n\nCHÀO MỪNG ĐẶC VỤ TỚI VỚI NHIỆM VỤ.",
          rewards: ex.rewards || { xp: 100, coins: 50 },
          starterCode: ex.starterCode || "function solution(a, b) {\n  // Viết code của bạn ở đây\n  return a + b;\n}",
          hints: ex.hints || [
            "Dữ liệu phân tích 1: Kiểm tra lại các kiểu dữ liệu đầu vào.",
            "Dữ liệu phân tích 2: Tối ưu hóa vòng lặp.",
            "Dữ liệu phân tích cuối: Sử dụng cấu trúc dữ liệu Map."
          ],
          testCases: ex.testCases || [{ input: "1, 2", expected: "3", description: "Test cơ bản" }],
          courseId,
        },
      };
    }
    if (url === "/users/me") {
      const submissions = getMockSubmissions();
      const passedSubs = submissions.filter(s => s.status === "passed");
      
      const totalSubmits = submissions.reduce((sum, s) => sum + (s.submitCount || 1), 0);
      const completedCount = passedSubs.length;
      const avgScore = passedSubs.length > 0 
        ? Math.round(passedSubs.reduce((sum, s) => sum + s.finalScore, 0) / passedSubs.length) 
        : 0;

      // Tính toán các metric cho Profile (0-100)
      const stats = {
        completedCount,
        totalSubmits,
        avgScore,
        // Tốc độ: dựa trên thời gian trung bình (giả định < 5p là 100%, > 20p là 20%)
        algoSpeed: passedSubs.length > 0 
          ? Math.max(20, Math.min(100, 100 - (passedSubs.reduce((sum, s) => sum + (s.timeSpentSec || 300), 0) / passedSubs.length / 12))) 
          : 0,
        // Tư duy logic: dựa trên điểm số trung bình
        logic: avgScore,
        // Kiên nhẫn: dựa trên số lỗi/lần thử trước khi pass
        patience: passedSubs.length > 0
          ? Math.max(30, Math.min(100, 100 - (passedSubs.reduce((sum, s) => sum + (s.errorCount || 0), 0) / passedSubs.length) * 5))
          : 0,
        // Tần suất: dựa trên số lượng bài hoàn thành (demo đơn giản)
        frequency: Math.min(100, completedCount * 15),
        // Hoàn thành: % so với tổng số bài (giả định ~50 bài)
        completion: Math.min(100, Math.round((completedCount / 50) * 100))
      };

      return { 
        data: {
          user: user || { name: "Học viên CodeFit", level: "Beginner", xp: completedCount * 100 },
          stats
        } 
      };
    }
    if (url === "/users/progress") return { data: mockData.mockProgress(user) };
    if (url === "/users/all") return { data: mockData.mockUsers };
    if (url === "/submissions/my") return { data: getMockSubmissions() };
    if (url.startsWith("/submissions/exercise/")) {
      const exId = url.split("/").pop();
      const sub = getMockSubmissions().find(s => s.exerciseId === exId);
      return { data: sub || null };
    }
    return { data: null };
  },
  post: async (url, body) => {
    await new Promise((r) => setTimeout(r, 600));
    if (url === "/ai/explain") {
      return {
        data: {
          explanation: "Đây là chế độ demo. Kết nối backend để sử dụng AI giải thích lỗi và gợi ý code.",
          suggestion: "// Gợi ý: Kiểm tra cú pháp và logic của hàm của bạn.",
        },
      };
    }
    if (url === "/ai/chat") {
      return {
        data: {
          reply: "Đây là chế độ demo. Kết nối backend để trò chuyện với AI hỗ trợ học tập.",
        },
      };
    }
    await new Promise((r) => setTimeout(r, 400));
    if (url === "/auth/login" || url === "/auth/register") throw new Error("Use authService");

    // === THỰC THI JS TRÊN FRONTEND (MOCK DEMO RUN/SUBMIT) ===
    if (url === "/submissions/run" || url === "/submissions/submit") {
      try {
        const payloadStr = typeof body === "string" ? body : JSON.stringify(body);
        const codeJson = JSON.parse(payloadStr);
        const { exerciseId, code, startTime, errorCount = 0, hintsUsed = 0 } = codeJson;

        let targetEx = null;
        for (const list of Object.values(mockData.mockExercises)) {
          const f = list.find((e) => e._id === exerciseId);
          if (f) { targetEx = f; break; }
        }

        if (!targetEx || !targetEx.testCases || !targetEx.testCases[0]) {
          // Fallback if no testCases
          return {
            data: { testResults: [{ passed: true, description: "Test bypass (HTML/Mock)", expected: "Pass", got: "Pass" }], total: 1, submission: { status: "passed", finalScore: 100, passedTests: 1, totalTests: 1, submitCount: 1 } }
          };
        }

        // Detect HTML exercise (args is [] or missing)
        const isHtmlExercise = !targetEx.testCases[0].args || targetEx.testCases[0].args.length === 0;

        const tests = targetEx.testCases;
        const results = [];
        let passCount = 0;

        if (isHtmlExercise) {
          // HTML exercises: run solution() and check if output includes expected substring
          const htmlTests = targetEx.testCases;
          for (let i = 0; i < htmlTests.length; i++) {
            const tc = htmlTests[i];
            let passed = false;
            let gotStr = "";
            try {
              const wrapperCode = `${code}; return solution();`;
              const htmlFn = new Function(wrapperCode);
              const output = htmlFn();
              gotStr = typeof output === "string" ? output : JSON.stringify(output);
              passed = gotStr.includes(tc.expected);
            } catch(err) {
              gotStr = err.message || "Runtime Error";
            }
            if (passed) passCount++;
            results.push({ passed, description: tc.description || `Test ${i + 1}`, expected: tc.expected, got: passed ? "Chứa nội dung đúng ✓" : gotStr });
          }
        } else {
          // JS exercises: run with args
          try {
            const wrapperCode = `
              ${code};
              if (typeof solution === "function") {
                return solution(...args);
              }
              throw new Error("Không tìm thấy hàm tên là 'solution'");
            `;
            const userFn = new Function("...args", wrapperCode);

            for (let i = 0; i < tests.length; i++) {
              const tc = tests[i];
              let got;
              let expectedStr = JSON.stringify(tc.expected);
              let gotStr;
              let passed = false;

              try {
                got = userFn(...tc.args);
                gotStr = JSON.stringify(got);
                if (gotStr === expectedStr) passed = true;
              } catch (err) {
                passed = false;
                gotStr = err.message || "Runtime Error";
              }

              if (passed) passCount++;
              results.push({
                passed,
                description: tc.description || `Test ${i + 1}`,
                expected: expectedStr,
                got: gotStr,
              });
            }
          } catch (parseErr) {
            // Find standard line:column error in stack trace if present
            let errPos = "";
            const stackMatch = parseErr.stack?.match(/<anonymous>:(\d+:\d+)/);
            if (stackMatch) errPos = ` (Dòng ${stackMatch[1]})`;
            
            results.push({
              passed: false,
              description: "Cú pháp code" + errPos,
              expected: "Hợp lệ",
              got: parseErr.message || "Syntax Error",
            });
          }
        }

        let finalScore = 0;
        let finalStatus = "failed";

        if (tests.length > 0 && passCount === tests.length) {
          finalStatus = "passed";
          if (url === "/submissions/submit") {
            const isTutorial = targetEx && targetEx.title && targetEx.title.includes("[Mẫu]");
            if (isTutorial) {
              finalScore = 100; // No deductions for tutorial
            } else {
              // Calculate dynamic score
              let baseScore = 100;
              const timeSpentSec = startTime ? Math.floor((Date.now() - new Date(startTime).getTime()) / 1000) : 0;
              const timeDeduction = Math.floor(timeSpentSec / 10); // -1 pt every 10 sec
              const errorDeduction = errorCount * 5; // -5 pt per error
              const hintDeduction = hintsUsed * 10; // -10 pt per hint

              finalScore = baseScore - timeDeduction - errorDeduction - hintDeduction;
              if (finalScore < 0) finalScore = 0;
            }
          } else {
             finalScore = 100;
          }
        }

        const timeSpentSec = startTime ? Math.floor((Date.now() - new Date(startTime).getTime()) / 1000) : 0;
        
        const submissionData = {
          status: finalStatus,
          finalScore: finalScore,
          passedTests: passCount,
          totalTests: tests.length,
          submitCount: 1,
          exerciseId,
          code,
          timeSpentSec,
          errorCount,
          hintsUsed,
          createdAt: new Date().toISOString()
        };

        if (url === "/submissions/submit" && finalStatus === "passed") {
          // Save to persistence
          const subs = getMockSubmissions();
          const existingIdx = subs.findIndex(s => s.exerciseId === exerciseId);
          if (existingIdx >= 0) {
            // Update if better score or just update
            submissionData.submitCount = (subs[existingIdx].submitCount || 1) + 1;
            subs[existingIdx] = submissionData;
          } else {
            subs.push(submissionData);
          }
          saveMockSubmissions(subs);
        }

        return {
          data: {
            testResults: results,
            total: tests.length,
            submission: submissionData
          }
        };

      } catch (e) {
        throw new Error("Mock execution failed: " + e.message);
      }
    }

    return { data: {} };
  },
};

const originalGet = api.get.bind(api);
const originalPost = api.post.bind(api);

api.get = async (url, config) => {
  if (DEMO_MODE) return mockApi.get(url);
  try {
    return await originalGet(url, config);
  } catch (e) {
    if (e.message === "Network Error" || e.code === "ERR_NETWORK") {
      return mockApi.get(url);
    }
    throw e;
  }
};

api.post = async (url, data, config) => {
  if (DEMO_MODE) return mockApi.post(url, data);
  try {
    return await originalPost(url, data, config);
  } catch (e) {
    if (e.message === "Network Error" || e.code === "ERR_NETWORK") {
      return mockApi.post(url, data);
    }
    throw e;
  }
};

export default api;
