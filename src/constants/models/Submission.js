const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise", required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        code: { type: String, required: true },
        language: { type: String, default: "javascript" },
        status: { type: String, enum: ["passed", "failed", "error"], default: "failed" },
        passedTests: { type: Number, default: 0 },
        totalTests: { type: Number, default: 0 },
        passRate: { type: Number, default: 0 },
        errorMessage: { type: String, default: "" },
        // Deep tracking fields
        startTime: { type: Date },
        endTime: { type: Date },
        timeSpent: { type: Number, default: 0 }, // seconds
        submitCount: { type: Number, default: 1 },
        aiRequestCount: { type: Number, default: 0 },
        // Score breakdown
        speedScore: { type: Number, default: 0 },
        consistencyScore: { type: Number, default: 0 },
        finalScore: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
