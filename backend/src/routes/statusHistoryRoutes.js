const express = require("express");

const {
    createStatusHistory,
    getStatusHistory
} = require("../controllers/statusHistoryController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createStatusHistory
);

router.get(
    "/:application_id",
    authenticateToken,
    getStatusHistory
);

module.exports = router;