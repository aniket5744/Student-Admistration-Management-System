const pool = require("../config/database");

const createAcademicRecord = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            qualification,
            institution_name,
            board_or_university,
            passing_year,
            percentage,
            grade
        } = req.body;

        // Find the student profile belonging to the logged-in user
        const studentResult = await pool.query(
            `SELECT id
             FROM student_profiles
             WHERE user_id = $1`,
            [userId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const studentId = studentResult.rows[0].id;

        const result = await pool.query(
            `INSERT INTO academic_records
            (
                student_id,
                qualification,
                institution_name,
                board_or_university,
                passing_year,
                percentage,
                grade
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                studentId,
                qualification,
                institution_name,
                board_or_university,
                passing_year,
                percentage,
                grade
            ]
        );

        res.status(201).json({
            message: "Academic record created successfully",
            record: result.rows[0]
        });

    } catch (error) {
        console.error("Create academic record error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAcademicRecords = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT ar.*
             FROM academic_records ar
             INNER JOIN student_profiles sp
                 ON ar.student_id = sp.id
             WHERE sp.user_id = $1
             ORDER BY ar.passing_year DESC`,
            [userId]
        );

        res.json({
            records: result.rows
        });

    } catch (error) {
        console.error("Get academic records error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createAcademicRecord,
    getAcademicRecords
};