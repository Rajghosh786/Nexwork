const express = require("express");

const {
    createProject,
    getProjects,
    getProject,
    updateProject,
    archiveProject,
    addProjectMember,
    removeProjectMember,
    getProjectMembers,
    deleteProject,
    unarchiveProject
} = require("../controllers/project.controller");

const authMiddleware = require("../middleware/auth.middleware");

// These routes will be mounted under /api/workspaces
// so the path will be /api/workspaces/:workspaceId/projects...
const router = express.Router();

router.post("/:workspaceId/projects", authMiddleware, createProject);
router.get("/:workspaceId/projects", authMiddleware, getProjects);
router.get("/:workspaceId/projects/:projectId", authMiddleware, getProject);
router.patch("/:workspaceId/projects/:projectId", authMiddleware, updateProject);
router.delete("/:workspaceId/projects/:projectId/archive", authMiddleware, archiveProject);

router.get("/:workspaceId/projects/:projectId/members", authMiddleware, getProjectMembers);
router.post("/:workspaceId/projects/:projectId/members", authMiddleware, addProjectMember);
router.delete("/:workspaceId/projects/:projectId/members/:userId", authMiddleware, removeProjectMember);
router.patch("/:workspaceId/projects/:projectId/unarchive",authMiddleware,unarchiveProject);
router.delete("/:workspaceId/projects/:projectId",authMiddleware,deleteProject);

module.exports = router;
