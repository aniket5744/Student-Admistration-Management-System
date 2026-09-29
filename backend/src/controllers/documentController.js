const pool = require("../config/database");

const createDocument = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            application_id,
            document_type,
            file_name,
            file_url,
            file_size,
            mime_type
        } = req.body;

        // Verify that the application belongs to the logged-in student
        const applicationResult = await pool.query(
            `SELECT aa.id
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

        const result = await pool.query(
            `INSERT INTO documents
            (
                application_id,
                document_type,
                file_name,
                file_url,
                file_size,
                mime_type
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                application_id,
                document_type,
                file_name,
                file_url,
                file_size || null,
                mime_type || null
            ]
        );

        res.status(201).json({
            message: "Document added successfully",
            document: result.rows[0]
        });

    } catch (error) {
        console.error("Create document error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getDocuments = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT d.*
             FROM documents d
             INNER JOIN admission_applications aa
                 ON d.application_id = aa.id
             INNER JOIN student_profiles sp
                 ON aa.student_id = sp.id
             WHERE sp.user_id = $1
             ORDER BY d.uploaded_at DESC`,
            [userId]
        );

        res.json({
            documents: result.rows
        });

    } catch (error) {
        console.error("Get documents error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateDocumentStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const {
            verification_status,
            rejection_reason
        } = req.body;

        const allowedStatuses = [
            "pending",
            "verified",
            "rejected"
        ];

        if (!allowedStatuses.includes(verification_status)) {
            return res.status(400).json({
                message: "Invalid verification status"
            });
        }

        const result = await pool.query(
            `UPDATE documents d
             SET
                verification_status = $1,
                rejection_reason = $2,
                verified_at =
                    CASE
                        WHEN $1 = 'verified'
                        THEN CURRENT_TIMESTAMP
                        ELSE verified_at
                    END
             FROM admission_applications aa
             INNER JOIN student_profiles sp
                 ON aa.student_id = sp.id
             WHERE d.id = $3
             AND d.application_id = aa.id
             AND sp.user_id = $4
             RETURNING d.*`,
            [
                verification_status,
                rejection_reason || null,
                id,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        res.json({
            message: "Document status updated successfully",
            document: result.rows[0]
        });

    } catch (error) {
        console.error("Update document error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createDocument,
    getDocuments,
    updateDocumentStatus
};