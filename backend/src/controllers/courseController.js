const pool = require("../config/database");

const getCourses = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM courses
             WHERE status = 'active'
             ORDER BY course_name ASC`
        );

        res.json({
            courses: result.rows
        });

    } catch (error) {
        console.error("Get courses error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM courses
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            course: result.rows[0]
        });

    } catch (error) {
        console.error("Get course error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const createCourse = async (req, res) => {
    try {
        const {
            course_code,
            course_name,
            description,
            duration_years,
            total_seats,
            available_seats,
            eligibility_criteria,
            application_fee,
            status
        } = req.body;

        const result = await pool.query(
            `INSERT INTO courses
            (
                course_code,
                course_name,
                description,
                duration_years,
                total_seats,
                available_seats,
                eligibility_criteria,
                application_fee,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                course_code,
                course_name,
                description,
                duration_years,
                total_seats,
                available_seats,
                eligibility_criteria,
                application_fee || 0,
                status || "active"
            ]
        );

        res.status(201).json({
            message: "Course created successfully",
            course: result.rows[0]
        });

    } catch (error) {
        console.error("Create course error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            course_code,
            course_name,
            description,
            duration_years,
            total_seats,
            available_seats,
            eligibility_criteria,
            application_fee,
            status
        } = req.body;

        const result = await pool.query(
            `UPDATE courses
             SET
                course_code = $1,
                course_name = $2,
                description = $3,
                duration_years = $4,
                total_seats = $5,
                available_seats = $6,
                eligibility_criteria = $7,
                application_fee = $8,
                status = $9,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $10
             RETURNING *`,
            [
                course_code,
                course_name,
                description,
                duration_years,
                total_seats,
                available_seats,
                eligibility_criteria,
                application_fee,
                status,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Course updated successfully",
            course: result.rows[0]
        });

    } catch (error) {
        console.error("Update course error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse
};