const pool = require("../config/database");

const createStatusHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { application_id, new_status, remarks } = req.body;

        const applicationResult = await pool.query(
            `SELECT aa.id, aa.status
             FROM admission_applications aa
             INNER JOIN student_profiles sp
                 ON aa.student_id = sp.id
             WHERE aa.id = $1
             AND sp.user_id = $2`,
            [application_id, userId]
        );

        if (applicationResult.rows.length === 0) {
            return res.status(404).json({
                message: "Admission application not found"
            });
        }

        const oldStatus = applicationResult.rows[0].status;

        const allowedStatuses = [
            "draft",
            "submitted",
            "under_review",
            "approved",
            "rejected",
            "withdrawn"
        ];

        if (!allowedStatuses.includes(new_status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const result = await pool.query(
            `INSERT INTO application_status_history
            (
                application_id,
                old_status,
                new_status,
                changed_by,
                remarks
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                application_id,
                oldStatus,
                new_status,
                userId,
                remarks || null
            ]
        );

        // Update application status
        await pool.query(
            `UPDATE admission_applications
             SET
                status = $1,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [new_status, application_id]
        );

        res.status(201).json({
            message: "Application status updated successfully",
            history: result.rows[0]
        });

    } catch (error) {
        console.error("Create status history error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getStatusHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { application_id } = req.params;

        const result = await pool.query(
            `SELECT ash.*
             FROM application_status_history ash
             INNER JOIN admission_applications aa
                 ON ash.application_id = aa.id
             INNER JOIN student_profiles sp
                 ON aa.student_id = sp.id
             WHERE ash.application_id = $1
             AND sp.user_id = $2
             ORDER BY ash.changed_at ASC`,
            [application_id, userId]
        );

        res.json({
            history: result.rows
        });

    } catch (error) {
        console.error("Get status history error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createStatusHistory,
    getStatusHistory
};