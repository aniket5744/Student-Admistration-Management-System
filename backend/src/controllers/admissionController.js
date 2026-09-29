const pool = require("../config/database");

const createApplication = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            course_id,
            remarks
        } = req.body;

        // Find the student profile
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

        // Check that the course exists and is active
        const courseResult = await pool.query(
            `SELECT id
             FROM courses
             WHERE id = $1
             AND status = 'active'`,
            [course_id]
        );

        if (courseResult.rows.length === 0) {
            return res.status(404).json({
                message: "Active course not found"
            });
        }

        // Generate application number
        const applicationNumber =
            `APP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const result = await pool.query(
            `INSERT INTO admission_applications
            (
                student_id,
                course_id,
                application_number,
                status,
                submitted_at,
                remarks
            )
            VALUES ($1, $2, $3, 'submitted', CURRENT_TIMESTAMP, $4)
            RETURNING *`,
            [
                studentId,
                course_id,
                applicationNumber,
                remarks || null
            ]
        );

        res.status(201).json({
            message: "Admission application submitted successfully",
            application: result.rows[0]
        });

    } catch (error) {
        console.error("Create application error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getApplications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT
                aa.*,
                c.course_code,
                c.course_name
             FROM admission_applications aa
             INNER JOIN student_profiles sp
                 ON aa.student_id = sp.id
             INNER JOIN courses c
                 ON aa.course_id = c.id
             WHERE sp.user_id = $1
             ORDER BY aa.created_at DESC`,
            [userId]
        );

        res.json({
            applications: result.rows
        });

    } catch (error) {
        console.error("Get applications error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getApplicationById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                aa.*,
                c.course_code,
                c.course_name
             FROM admission_applications aa
             INNER JOIN student_profiles sp
                 ON aa.student_id = sp.id
             INNER JOIN courses c
                 ON aa.course_id = c.id
             WHERE aa.id = $1
             AND sp.user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Admission application not found"
            });
        }

        res.json({
            application: result.rows[0]
        });

    } catch (error) {
        console.error("Get application error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateApplication = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const {
            status,
            remarks
        } = req.body;

        const allowedStatuses = [
            "draft",
            "submitted",
            "under_review",
            "approved",
            "rejected",
            "withdrawn"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const result = await pool.query(
            `UPDATE admission_applications aa
             SET
                status = $1,
                remarks = $2,
                reviewed_at =
                    CASE
                        WHEN $1 IN ('approved', 'rejected')
                        THEN CURRENT_TIMESTAMP
                        ELSE reviewed_at
                    END,
                updated_at = CURRENT_TIMESTAMP
             FROM student_profiles sp
             WHERE aa.id = $3
             AND aa.student_id = sp.id
             AND sp.user_id = $4
             RETURNING aa.*`,
            [
                status,
                remarks || null,
                id,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Admission application not found"
            });
        }

        res.json({
            message: "Admission application updated successfully",
            application: result.rows[0]
        });

    } catch (error) {
        console.error("Update application error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication
};