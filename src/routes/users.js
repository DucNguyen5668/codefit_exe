const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Submission = require("../models/Submission");
const { authMiddleware } = require("../middleware/auth");

// GET /api/users/me - current user profile + dashboard data
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const submissions = await Submission.find({ userId: req.user.id });
        const totalSubmits = submissions.reduce((s, sub) => s + sub.submitCount, 0);
        const totalTimeSpent = submissions.reduce((s, sub) => s + sub.timeSpent, 0);
        const avgScore = submissions.length
            ? Math.round(submissions.reduce((s, sub) => s + sub.finalScore, 0) / submissions.length)
            : 0;
        const passedCount = submissions.filter((s) => s.status === "passed").length;

        // Progress percentage (based on xp, max 1000 for display)
        const progressPct = Math.min(100, Math.round((user.xp / 1000) * 100));

        res.json({
            user,
            stats: {
                totalSubmits,
                totalTimeSpent,
                avgScore,
                passedCount,
                completedCount: user.completedExercises.length,
                progressPct,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/users/progress - detailed progress data for charts
router.get("/progress", authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find({ userId: req.user.id })
            .populate("exerciseId", "title difficulty")
            .populate("courseId", "title")
            .sort({ createdAt: 1 });

        // Group by day for chart
        const dailyMap = {};
        submissions.forEach((sub) => {
            const day = sub.createdAt.toISOString().split("T")[0];
            if (!dailyMap[day]) dailyMap[day] = { date: day, score: 0, submits: 0, timeSpent: 0 };
            dailyMap[day].score = Math.max(dailyMap[day].score, sub.finalScore);
            dailyMap[day].submits += sub.submitCount;
            dailyMap[day].timeSpent += sub.timeSpent;
        });

        const dailyProgress = Object.values(dailyMap).slice(-14); // last 14 days

        res.json({ submissions, dailyProgress });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/users/all (admin only - simplified)
router.get("/all", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
