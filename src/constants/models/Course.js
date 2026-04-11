const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
        language: { type: String, default: "javascript" },
        thumbnail: { type: String, default: "" },
        tags: [String],
        exerciseCount: { type: Number, default: 0 },
        duration: { type: String, default: "2 hours" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
