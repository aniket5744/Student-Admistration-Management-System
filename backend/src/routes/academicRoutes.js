const express = require("express");

const {
    createAcademicRecord,
    getAcademicRecords,
    updateAcademicRecord
} = require("../controllers/academicController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createAcademicRecord
);

router.get(
    "/",
    authenticateToken,
    getAcademicRecords
);

module.exports = router;