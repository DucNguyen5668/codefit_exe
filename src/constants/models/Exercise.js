const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
    input: { type: String },
    expected: { type: String, required: true },
    description: { type: String },
});

const exerciseSchema = new mongoose.Schema(
    {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
        language: { type: String, default: "javascript" },
        starterCode: { type: String, default: "// Write your solution here\n" },
        solution: { type: String, default: "" },
        testCases: [testCaseSchema],
        hints: [String],
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
