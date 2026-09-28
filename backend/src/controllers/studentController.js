const pool = require("../config/database");

const createProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            date_of_birth,
            gender,
            phone,
            address,
            city,
            state,
            postal_code
        } = req.body;

        const existingProfile = await pool.query(
            "SELECT id FROM student_profiles WHERE user_id = $1",
            [userId]
        );

        if (existingProfile.rows.length > 0) {
            return res.status(409).json({
                message: "Student profile already exists"
            });
        }

        const result = await pool.query(
            `INSERT INTO student_profiles
            (
                user_id,
                date_of_birth,
                gender,
                phone,
                address,
                city,
                state,
                postal_code
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                userId,
                date_of_birth,
                gender,
                phone,
                address,
                city,
                state,
                postal_code
            ]
        );

        res.status(201).json({
            message: "Student profile created successfully",
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Create profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT *
             FROM student_profiles
             WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.json({
            profile: result.rows[0]
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createProfile,
    getProfile
};