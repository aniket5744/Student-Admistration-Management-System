const express = require("express");

const {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication
} = require("../controllers/admissionController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createApplication
);

router.get(
    "/",
    authenticateToken,
    getApplications
);

router.get(
    "/:id",
    authenticateToken,
    getApplicationById
);

router.put(
    "/:id",
    authenticateToken,
    updateApplication
);

module.exports = router;