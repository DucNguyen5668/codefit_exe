import fs from 'fs';
import path from 'path';

// Trích xuất logic từ mockData.js và api.js
const mockExercises = {
  c1: [
    { 
      _id: "e1", title: "Tính tổng hai số", description: "Viết hàm trả về tổng của hai số nguyên a và b.", difficulty: "Easy",
      instruction: "ĐĂNG NHẬP HỆ THỐNG...",
      starterCode: "function solution(a, b) {\n  // Viết code của bạn ở đây\n  \n}",
      hints: ["Hãy sử dụng toán tử cộng (+).", "Đảm bảo rằng bạn dùng từ khóa `return` để trả về kết quả.", "Cách viết: `return a + b;`"],
      testCases: [
        { input: "1, 2", args: [1, 2], expected: 3, description: "Số dương" },
        { input: "-1, 5", args: [-1, 5], expected: 4, description: "Cộng số âm" },
        { input: "0, 0", args: [0, 0], expected: 0, description: "Số không" }
      ],
      rewards: { xp: 100, coins: 50 },
    }
  ]
};

async function testHandleRun() {
    const body = { exerciseId: "e1", code: "function solution(a, b) {\n  return a + b;\n}" };
    try {
        const payloadStr = typeof body === "string" ? body : JSON.stringify(body);
        const codeJson = JSON.parse(payloadStr);
        const { exerciseId, code } = codeJson;

        let targetEx = null;
        for (const list of Object.values(mockExercises)) {
          const f = list.find((e) => e._id === exerciseId);
          if (f) { targetEx = f; break; }
        }

        if (!targetEx || !targetEx.testCases || !targetEx.testCases[0].args) {
          console.log("Fallback execution triggered.");
          return;
        }

        const tests = targetEx.testCases;
        const results = [];
        let passCount = 0;

        try {
          const fnMatch = code.match(/function\s+[a-zA-Z0-9_]+\s*\(([^)]*)\)\s*\{([\s\S]*)\}/);
          let userFn;

          if (fnMatch) {
            const argsList = fnMatch[1];
            const functionBody = fnMatch[2];
            userFn = new Function(argsList, functionBody);
          } else {
            userFn = new Function("return (" + code + ")");
          }

          for (let i = 0; i < tests.length; i++) {
            const tc = tests[i];
            let got;
            let expectedStr = JSON.stringify(tc.expected);
            let gotStr;
            let passed = false;

            try {
              if (fnMatch) {
                got = userFn(...tc.args);
              } else {
                got = userFn()(...tc.args);
              }
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
          results.push({
            passed: false,
            description: "Cú pháp code",
            expected: "Hợp lệ",
            got: parseErr.message || "Syntax Error",
          });
        }

        const finalScore = tests.length > 0 ? Math.round((passCount / tests.length) * 100) : 0;
        const finalStatus = passCount === tests.length ? "passed" : "failed";

        console.log(JSON.stringify({
          data: {
            testResults: results,
            total: tests.length,
            submission: {
              status: finalStatus,
              finalScore: finalScore,
              passedTests: passCount,
              totalTests: tests.length,
              submitCount: 1,
            }
          }
        }, null, 2));

      } catch (e) {
        console.error("Mock execution failed: " + e.message);
      }
}

testHandleRun();
