const express = require("express");

const {
    createProfile,
    getProfile
} = require("../controllers/studentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/profile",
    authenticateToken,
    createProfile
);

router.get(
    "/profile",
    authenticateToken,
    getProfile
);

module.exports = router;
