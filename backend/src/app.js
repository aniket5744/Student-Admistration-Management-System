require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");

const pool = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const academicRoutes = require("./routes/academicRoutes");
const courseRoutes = require("./routes/courseRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const documentRoutes = require("./routes/documentRoutes");
const statusHistoryRoutes = require("./routes/statusHistoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/academic-records", academicRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admission-applications", admissionRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/application-status-history", statusHistoryRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Student Admission Management API is running"
    });
});

app.get("/api/health/db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            status: "success",
            message: "Database connection is working",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        res.status(500).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});