const express = require("express");

const {
    createProfile,
    getProfile,
    updateProfile
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

router.put(
    "/profile",
    authenticateToken,
    updateProfile
);

module.exports = router;