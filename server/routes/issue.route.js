const express = require("express");

const {
    createIssue,
    getProjectIssues,
    getIssue,
    updateIssue,
    deleteIssue,
    addComment
} = require("../controllers/issue.controller");

const authMiddleware = require("../middleware/auth.middleware");

// These routes will be mounted under /api/workspaces/:workspaceId/projects
// so the path will be /api/workspaces/:workspaceId/projects/:projectId/issues...
const router = express.Router({ mergeParams: true }); 
// Note: express router mergeParams is needed if mounted with params in parent router.
// But we will mount it directly on app in server.js or similarly handle it.
// Let's just define the full path here to be safe and clear.

const issueRouter = express.Router();

issueRouter.post("/:workspaceId/projects/:projectId/issues", authMiddleware, createIssue);
issueRouter.get("/:workspaceId/projects/:projectId/issues", authMiddleware, getProjectIssues);
issueRouter.get("/:workspaceId/projects/:projectId/issues/:issueId", authMiddleware, getIssue);
issueRouter.patch("/:workspaceId/projects/:projectId/issues/:issueId", authMiddleware, updateIssue);
issueRouter.delete("/:workspaceId/projects/:projectId/issues/:issueId", authMiddleware, deleteIssue);

issueRouter.post("/:workspaceId/projects/:projectId/issues/:issueId/comments", authMiddleware, addComment);

module.exports = issueRouter;
