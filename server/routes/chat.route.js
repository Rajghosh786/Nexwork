const express = require("express");

const {
    getConversations,
    createConversation,
    getConversationDetails,
    getConversationMembers,
    addConversationMembers,
    markConversationAsRead,
    getMessages,
    sendMessage,
    getWorkspaceMembers,
} = require("../controllers/chat.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/members", authMiddleware, getWorkspaceMembers);

router.get("/", authMiddleware, getConversations);

router.post("/", authMiddleware, createConversation);

router.get("/:id", authMiddleware, getConversationDetails);

router.get("/:id/members", authMiddleware, getConversationMembers);

router.post("/:id/members", authMiddleware, addConversationMembers);

router.patch("/:id/read", authMiddleware, markConversationAsRead);

router.get("/:id/messages", authMiddleware, getMessages);

router.post("/:id/messages", authMiddleware, sendMessage);

module.exports = router;
