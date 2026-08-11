const express = require("express");

const { getWorkspaces } = require("../controllers/workspace.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getWorkspaces);

module.exports = router;
