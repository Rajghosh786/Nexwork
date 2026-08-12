const express = require("express");

const { getWorkspaces, getWorkspaceMembers } = require("../controllers/workspace.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId/members", authMiddleware, getWorkspaceMembers);
module.exports = router;
