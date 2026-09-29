const express = require("express");

const {
    createDocument,
    getDocuments,
    updateDocumentStatus
} = require("../controllers/documentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createDocument
);

router.get(
    "/",
    authenticateToken,
    getDocuments
);

router.put(
    "/:id/status",
    authenticateToken,
    updateDocumentStatus
);

module.exports = router;