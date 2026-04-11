const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
        xp: { type: Number, default: 0 },
        aiUsageLeft: { type: Number, default: 10 },
        completedExercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
        enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
