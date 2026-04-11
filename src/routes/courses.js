const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { authMiddleware } = require("../middleware/auth");

// GET /api/courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: 1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/courses/:id
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/courses (admin)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
