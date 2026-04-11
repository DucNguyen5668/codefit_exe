const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const Exercise = require("../models/Exercise");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");

// Helper: evaluate JavaScript code against test cases
function runTests(code, testCases) {
    const results = [];
    for (const tc of testCases) {
        try {
            // We wrap user code so we can call a function named "solution"
            const wrappedCode = `
        ${code}
        // Try to find exported function
        const __fn = typeof solution !== 'undefined' ? solution : (typeof module !== 'undefined' && module.exports) ? module.exports : null;
        return __fn ? JSON.stringify(__fn(${tc.input || ""})) : "null"
      `;
            // eslint-disable-next-line no-new-func
            const result = new Function(wrappedCode)();
            const expected = tc.expected.trim();
            const passed = String(result).trim() === expected || result === expected;
            results.push({ passed, got: String(result), expected, description: tc.description || "" });
        } catch (e) {
            results.push({ passed: false, got: `Error: ${e.message}`, expected: tc.expected, description: tc.description || "" });
        }
    }
    return results;
}

// POST /api/submissions/run (run without saving)
router.post("/run", authMiddleware, async (req, res) => {
    try {
        const { exerciseId, code } = req.body;
        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) return res.status(404).json({ message: "Exercise not found" });

        const testResults = runTests(code, exercise.testCases);
        const passed = testResults.filter((r) => r.passed).length;

        res.json({ testResults, passed, total: testResults.length });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/submissions/submit
router.post("/submit", authMiddleware, async (req, res) => {
    try {
        const { exerciseId, code, startTime, aiRequestCount = 0 } = req.body;
        const userId = req.user.id;

        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) return res.status(404).json({ message: "Exercise not found" });

        const endTime = new Date();
        const start = startTime ? new Date(startTime) : new Date();
        const timeSpent = Math.round((endTime - start) / 1000);

        const testResults = runTests(code, exercise.testCases);
        const passedTests = testResults.filter((r) => r.passed).length;
        const totalTests = testResults.length;
        const passRate = totalTests > 0 ? passedTests / totalTests : 0;
        const status = passRate === 1 ? "passed" : passRate > 0 ? "failed" : "failed";

        // Check if user already has a submission for this exercise
        const existing = await Submission.findOne({ userId, exerciseId });
        const submitCount = existing ? existing.submitCount + 1 : 1;

        // Deep tracking score calculation
        const maxTime = 1800; // 30 minutes baseline
        const speedScore = Math.max(0, 20 - (timeSpent / maxTime) * 20);
        const consistencyScore = Math.max(0, 30 - submitCount * 3);
        const finalScore = Math.round(passRate * 50 + speedScore + consistencyScore);

        const submissionData = {
            userId, exerciseId,
            courseId: exercise.courseId,
            code, language: exercise.language || "javascript",
            status, passedTests, totalTests, passRate,
            startTime: start, endTime, timeSpent,
            submitCount, aiRequestCount,
            speedScore: Math.round(speedScore),
            consistencyScore: Math.round(consistencyScore),
            finalScore,
        };

        let submission;
        if (existing) {
            submission = await Submission.findByIdAndUpdate(existing._id, submissionData, { new: true });
        } else {
            submission = await Submission.create(submissionData);
        }

        // Update user stats
        const user = await User.findById(userId);
        if (status === "passed" && !user.completedExercises.includes(exerciseId)) {
            const xpGain = finalScore;
            await User.findByIdAndUpdate(userId, {
                $addToSet: { completedExercises: exerciseId },
                $inc: { xp: xpGain },
            });
            // Update level based on xp
            const totalXP = user.xp + xpGain;
            let newLevel = "Beginner";
            if (totalXP >= 500) newLevel = "Advanced";
            else if (totalXP >= 200) newLevel = "Intermediate";
            await User.findByIdAndUpdate(userId, { level: newLevel });
        }

        // Decrement AI usage if used
        if (aiRequestCount > 0) {
            await User.findByIdAndUpdate(userId, { $inc: { aiUsageLeft: -aiRequestCount } });
        }

        res.json({ submission, testResults });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/submissions/my
router.get("/my", authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user.id })
            .populate("exerciseId", "title difficulty")
            .populate("courseId", "title")
            .sort({ updatedAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/submissions/exercise/:id (user's submission for specific exercise)
router.get("/exercise/:id", authMiddleware, async (req, res) => {
    try {
        const submission = await Submission.findOne({ userId: req.user.id, exerciseId: req.params.id });
        res.json(submission || null);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
