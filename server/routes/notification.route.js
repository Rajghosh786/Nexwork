const express = require("express");

const {
    getNotifications,
    markNotificationAsRead,
} = require("../controllers/notification.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);

router.patch("/:id/read", authMiddleware, markNotificationAsRead);

module.exports = router;
