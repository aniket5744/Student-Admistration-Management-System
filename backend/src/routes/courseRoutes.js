const express = require("express");

const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse
} = require("../controllers/courseController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    getCourses
);

router.get(
    "/:id",
    authenticateToken,
    getCourseById
);

router.post(
    "/",
    authenticateToken,
    createCourse
);

router.put(
    "/:id",
    authenticateToken,
    updateCourse
);

module.exports = router;