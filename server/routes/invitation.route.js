const express = require("express");

const {
    sendInvitation,
    getInvitations,
    acceptInvitation,
    rejectInvitation,
} = require("../controllers/invitation.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getInvitations);

router.post("/send", authMiddleware, sendInvitation);

router.patch(
    "/:id/accept",
    authMiddleware,
    acceptInvitation
);

router.patch(
    "/:id/reject",
    authMiddleware,
    rejectInvitation
);

module.exports = router;