const Project = require("../models/Project");
const WorkspaceMember = require("../models/WorkspaceMember");
const User = require("../models/User");
const Workspace = require("../models/Workspace");

// Helper to check if a user is an organization ADMIN
const getOrgAdminMembership = async (userId, workspaceId) => {
    return await WorkspaceMember.findOne({
        user: userId,
        workspace: workspaceId,
        role: "ADMIN"
    });
};

// Helper to check if a user is any member of the organization
const getOrgMembership = async (userId, workspaceId) => {
    return await WorkspaceMember.findOne({
        user: userId,
        workspace: workspaceId,
    });
};

const createProject = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Project name is required" });
        }

        // Verify workspace is an ORGANIZATION
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        if (workspace.type !== "ORGANIZATION") {
            return res.status(400).json({ message: "Projects can only be created in organization workspaces" });
        }

        // Verify the user belongs to the organization
        const membership = await getOrgMembership(req.user._id, workspaceId);
        if (!membership) {
            return res.status(403).json({ message: "You are not a member of this organization" });
        }

        // Create the members array
        const projectMembers = [];

        // Add creator as PROJECT_ADMIN
        projectMembers.push({
            user: req.user._id,
            role: "PROJECT_ADMIN"
        });

        // Find organization admins to add them to the project
        const orgAdmins = await WorkspaceMember.find({
            workspace: workspaceId,
            role: "ADMIN"
        });

        for (const admin of orgAdmins) {
            // Avoid adding the creator twice if the creator is an org admin
            if (admin.user.toString() !== req.user._id.toString()) {
                projectMembers.push({
                    user: admin.user,
                    role: "PROJECT_ADMIN"
                });
            }
        }

        const project = await Project.create({
            name: name.trim(),
            description: description ? description.trim() : "",
            workspace: workspaceId,
            members: projectMembers
        });

        return res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Create project error:", error);
        return res.status(500).json({ message: "Unable to create project" });
    }
};

const getProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { archived } = req.query;

        // Verify organization membership
        const membership = await getOrgMembership(req.user._id, workspaceId);

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this organization"
            });
        }

        const filter = {
            workspace: workspaceId
        };

        // Only filter archived status when explicitly requested
        if (archived === "true") {
            filter.archived = true;
        } else {
            filter.archived = false;
        }

        let projects = [];

        if (membership.role === "ADMIN") {
            projects = await Project.find(filter)
                .populate("members.user", "fullName email");
        } else {
            projects = await Project.find({
                ...filter,
                "members.user": req.user._id
            }).populate("members.user", "fullName email");
        }

        return res.status(200).json(projects);

    } catch (error) {
        console.error("Get projects error:", error);
        return res.status(500).json({
            message: "Unable to get projects"
        });
    }
};

const getProject = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;

        const membership = await getOrgMembership(req.user._id, workspaceId);
        if (!membership) {
            return res.status(403).json({ message: "You are not a member of this organization" });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        }).populate("members.user", "fullName email");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Verify project access
        if (membership.role !== "ADMIN") {
            const isProjectMember = project.members.some(m => m.user._id.toString() === req.user._id.toString());
            if (!isProjectMember) {
                return res.status(403).json({ message: "You do not have access to this project" });
            }
        }

        return res.status(200).json(project);

    } catch (error) {
        console.error("Get project error:", error);
        return res.status(500).json({ message: "Unable to get project" });
    }
};

const updateProject = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;
        const { name, description } = req.body;

        const membership = await getOrgMembership(req.user._id, workspaceId);
        if (!membership) {
            return res.status(403).json({ message: "You are not a member of this organization" });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Verify project admin or org admin
        let hasPermission = membership.role === "ADMIN";
        if (!hasPermission) {
            const memberObj = project.members.find(m => m.user.toString() === req.user._id.toString());
            if (memberObj && memberObj.role === "PROJECT_ADMIN") {
                hasPermission = true;
            }
        }

        if (!hasPermission) {
            return res.status(403).json({ message: "You do not have permission to update this project" });
        }

        if (name !== undefined) {
            if (!name.trim()) return res.status(400).json({ message: "Project name cannot be empty" });
            project.name = name.trim();
        }
        if (description !== undefined) {
            project.description = description.trim();
        }

        await project.save();

        return res.status(200).json({
            message: "Project updated",
            project
        });

    } catch (error) {
        console.error("Update project error:", error);
        return res.status(500).json({ message: "Unable to update project" });
    }
};

const archiveProject = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;

        const membership = await getOrgMembership(req.user._id, workspaceId);
        if (!membership) {
            return res.status(403).json({ message: "You are not a member of this organization" });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Verify project admin or org admin
        let hasPermission = membership.role === "ADMIN";
        if (!hasPermission) {
            const memberObj = project.members.find(m => m.user.toString() === req.user._id.toString());
            if (memberObj && memberObj.role === "PROJECT_ADMIN") {
                hasPermission = true;
            }
        }

        if (!hasPermission) {
            return res.status(403).json({ message: "You do not have permission to archive this project" });
        }

        project.archived = true;
        await project.save();

        return res.status(200).json({ message: "Project archived" });

    } catch (error) {
        console.error("Archive project error:", error);
        return res.status(500).json({ message: "Unable to archive project" });
    }
};

const addProjectMember = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;
        const { userId, role } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const memberRole = role === "PROJECT_ADMIN" ? "PROJECT_ADMIN" : "MEMBER";

        const membership = await getOrgMembership(req.user._id, workspaceId);
        if (!membership) {
            return res.status(403).json({ message: "You are not a member of this organization" });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Verify project admin or org admin
        let hasPermission = membership.role === "ADMIN";
        if (!hasPermission) {
            const memberObj = project.members.find(m => m.user.toString() === req.user._id.toString());
            if (memberObj && memberObj.role === "PROJECT_ADMIN") {
                hasPermission = true;
            }
        }

        if (!hasPermission) {
            return res.status(403).json({ message: "You do not have permission to add members to this project" });
        }

        // Verify target user is in the organization
        const targetOrgMembership = await getOrgMembership(userId, workspaceId);
        if (!targetOrgMembership) {
            return res.status(400).json({ message: "Target user is not a member of this organization" });
        }

        // Check if already in project
        const alreadyMember = project.members.find(m => m.user.toString() === userId.toString());
        if (alreadyMember) {
            return res.status(400).json({ message: "User is already a member of this project" });
        }

        project.members.push({
            user: userId,
            role: memberRole
        });

        await project.save();

        return res.status(200).json({
            message: "Member added to project",
            project
        });

    } catch (error) {
        console.error("Add project member error:", error);
        return res.status(500).json({ message: "Unable to add project member" });
    }
};

const removeProjectMember = async (req, res) => {
    try {
        const { workspaceId, projectId, userId } = req.params;

        const membership = await getOrgMembership(req.user._id, workspaceId);
        if (!membership) {
            return res.status(403).json({ message: "You are not a member of this organization" });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Verify project admin or org admin
        let hasPermission = membership.role === "ADMIN";
        if (!hasPermission) {
            const memberObj = project.members.find(m => m.user.toString() === req.user._id.toString());
            if (memberObj && memberObj.role === "PROJECT_ADMIN") {
                hasPermission = true;
            }
        }

        if (!hasPermission) {
            return res.status(403).json({ message: "You do not have permission to remove members from this project" });
        }

        // Cannot remove last project admin (unless there's an org admin around, but better to just prevent it)
        const admins = project.members.filter(m => m.role === "PROJECT_ADMIN");
        const targetMember = project.members.find(m => m.user.toString() === userId.toString());
        
        if (!targetMember) {
            return res.status(404).json({ message: "User is not a member of this project" });
        }

        if (targetMember.role === "PROJECT_ADMIN" && admins.length <= 1) {
            return res.status(400).json({ message: "Cannot remove the last project admin" });
        }

        project.members = project.members.filter(m => m.user.toString() !== userId.toString());
        await project.save();

        return res.status(200).json({
            message: "Member removed from project",
            project
        });

    } catch (error) {
        console.error("Remove project member error:", error);
        return res.status(500).json({ message: "Unable to remove project member" });
    }
};

const getProjectMembers = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;

        const membership = await getOrgMembership(req.user._id, workspaceId);
        if (!membership) {
            return res.status(403).json({ message: "You are not a member of this organization" });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        }).populate("members.user", "fullName email");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Verify project access
        if (membership.role !== "ADMIN") {
            const isProjectMember = project.members.some(m => m.user._id.toString() === req.user._id.toString());
            if (!isProjectMember) {
                return res.status(403).json({ message: "You do not have access to this project" });
            }
        }

        return res.status(200).json(project.members);

    } catch (error) {
        console.error("Get project members error:", error);
        return res.status(500).json({ message: "Unable to get project members" });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;

        const membership = await getOrgMembership(
            req.user._id,
            workspaceId
        );

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this organization"
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        let hasPermission = membership.role === "ADMIN";

        if (!hasPermission) {
            const memberObj = project.members.find(
                (member) =>
                    member.user.toString() === req.user._id.toString()
            );

            if (memberObj?.role === "PROJECT_ADMIN") {
                hasPermission = true;
            }
        }

        if (!hasPermission) {
            return res.status(403).json({
                message: "You do not have permission to delete this project"
            });
        }

        await Project.findByIdAndDelete(projectId);

        return res.status(200).json({
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(500).json({
            message: "Unable to delete project"
        });
    }
};

const unarchiveProject = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;

        const membership = await getOrgMembership(
            req.user._id,
            workspaceId
        );

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this organization"
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            workspace: workspaceId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        let hasPermission = membership.role === "ADMIN";

        if (!hasPermission) {
            const memberObj = project.members.find(
                (member) =>
                    member.user.toString() === req.user._id.toString()
            );

            if (memberObj?.role === "PROJECT_ADMIN") {
                hasPermission = true;
            }
        }

        if (!hasPermission) {
            return res.status(403).json({
                message: "You do not have permission to unarchive this project"
            });
        }

        project.archived = false;

        await project.save();

        return res.status(200).json({
            message: "Project unarchived successfully",
            project
        });
    } catch (error) {
        console.error("Unarchive project error:", error);

        return res.status(500).json({
            message: "Unable to unarchive project"
        });
    }
};

module.exports = {
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
};
