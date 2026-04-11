require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected:", process.env.MONGO_URI);
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
    });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/exercises", require("./routes/exercises"));
app.use("/api/submissions", require("./routes/submissions"));
app.use("/api/ai", require("./routes/ai"));

// Health check
app.get("/", (req, res) => {
    res.json({ message: "CodeFit API running...", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});