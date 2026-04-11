const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");
const Course = require("../models/Course");
const { authMiddleware } = require("../middleware/auth");

// GET /api/exercises?courseId=xxx
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.query;
        const filter = courseId ? { courseId } : {};
        const exercises = await Exercise.find(filter).select("-solution").sort({ order: 1 });
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/exercises/:id
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id).select("-solution");
        if (!exercise) return res.status(404).json({ message: "Exercise not found" });
        res.json(exercise);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/exercises (admin)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const exercise = await Exercise.create(req.body);
        // Update course exerciseCount
        await Course.findByIdAndUpdate(req.body.courseId, { $inc: { exerciseCount: 1 } });
        res.status(201).json(exercise);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
