const Issue = require("../models/Issue");
const Project = require("../models/Project");
const WorkspaceMember = require("../models/WorkspaceMember");

// Helper to check if a user is any member of the organization
const getOrgMembership = async (userId, workspaceId) => {
    return await WorkspaceMember.findOne({
        user: userId,
        workspace: workspaceId,
    });
};

// Helper to check project access
const getProjectAccess = async (userId, workspaceId, projectId) => {
    const membership = await getOrgMembership(userId, workspaceId);
    if (!membership) return { error: "You are not a member of this organization", status: 403 };

    const project = await Project.findOne({ _id: projectId, workspace: workspaceId });
    if (!project) return { error: "Project not found", status: 404 };

    let isOrgAdmin = membership.role === "ADMIN";
    let projectMember = project.members.find(m => m.user.toString() === userId.toString());
    
    if (!isOrgAdmin && !projectMember) {
        return { error: "You do not have access to this project", status: 403 };
    }

    let isProjectAdmin = isOrgAdmin || (projectMember && projectMember.role === "PROJECT_ADMIN");

    return { project, isOrgAdmin, isProjectAdmin, projectMember };
};

const createIssue = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;
        const { title, description, status, priority, assignee, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Issue title is required" });
        }

        const access = await getProjectAccess(req.user._id, workspaceId, projectId);
        if (access.error) {
            return res.status(access.status).json({ message: access.error });
        }

        // If assignee is provided, verify they are a valid project member
        if (assignee) {
            const isValidAssignee = access.project.members.some(m => m.user.toString() === assignee.toString());
            if (!isValidAssignee) {
                return res.status(400).json({ message: "Assignee must be a valid project member" });
            }
        }

        const issue = await Issue.create({
            title: title.trim(),
            description: description ? description.trim() : "",
            status: status || "TODO",
            priority: priority || "NONE",
            assignee: assignee || null,
            reporter: req.user._id,
            project: projectId,
            workspace: workspaceId,
            dueDate: dueDate ? new Date(dueDate) : null
        });

        return res.status(201).json({
            message: "Issue created successfully",
            issue
        });

    } catch (error) {
        console.error("Create issue error:", error);
        return res.status(500).json({ message: "Unable to create issue" });
    }
};

const getProjectIssues = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params;

        const access = await getProjectAccess(req.user._id, workspaceId, projectId);
        if (access.error) {
            return res.status(access.status).json({ message: access.error });
        }

        const issues = await Issue.find({
            project: projectId,
            workspace: workspaceId,
            archived: false
        })
        .populate("assignee", "fullName email")
        .populate("reporter", "fullName email")
        .sort({ createdAt: -1 });

        return res.status(200).json(issues);

    } catch (error) {
        console.error("Get project issues error:", error);
        return res.status(500).json({ message: "Unable to get issues" });
    }
};

const getIssue = async (req, res) => {
    try {
        const { workspaceId, projectId, issueId } = req.params;

        const access = await getProjectAccess(req.user._id, workspaceId, projectId);
        if (access.error) {
            return res.status(access.status).json({ message: access.error });
        }

        const issue = await Issue.findOne({
            _id: issueId,
            project: projectId,
            workspace: workspaceId
        })
        .populate("assignee", "fullName email")
        .populate("reporter", "fullName email")
        .populate("comments.author", "fullName email");

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        return res.status(200).json(issue);

    } catch (error) {
        console.error("Get issue error:", error);
        return res.status(500).json({ message: "Unable to get issue" });
    }
};

const updateIssue = async (req, res) => {
    try {
        const { workspaceId, projectId, issueId } = req.params;
        const updates = req.body;

        const access = await getProjectAccess(req.user._id, workspaceId, projectId);
        if (access.error) {
            return res.status(access.status).json({ message: access.error });
        }

        const issue = await Issue.findOne({
            _id: issueId,
            project: projectId,
            workspace: workspaceId
        });

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        // Project members can update issues
        const allowedFields = ["title", "description", "status", "priority", "assignee", "dueDate", "archived"];

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                if (field === "title") {
                    if (!updates.title || !updates.title.trim()) {
                        return res.status(400).json({ message: "Title cannot be empty" });
                    }
                    issue.title = updates.title.trim();
                } else if (field === "description") {
                    issue.description = typeof updates.description === "string" ? updates.description.trim() : "";
                } else if (field === "status") {
                    const validStatuses = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
                    if (!validStatuses.includes(updates.status)) {
                        return res.status(400).json({ message: "Invalid status value" });
                    }
                    issue.status = updates.status;
                } else if (field === "priority") {
                    const validPriorities = ["NONE", "LOW", "MEDIUM", "HIGH", "URGENT"];
                    if (!validPriorities.includes(updates.priority)) {
                        return res.status(400).json({ message: "Invalid priority value" });
                    }
                    issue.priority = updates.priority;
                } else if (field === "assignee") {
                    if (updates.assignee === null) {
                        issue.assignee = null;
                    } else {
                        const isValidAssignee = access.project.members.some(m => m.user.toString() === updates.assignee.toString());
                        if (!isValidAssignee) {
                            return res.status(400).json({ message: "Assignee must be a valid project member" });
                        }
                        issue.assignee = updates.assignee;
                    }
                } else if (field === "dueDate") {
                    issue.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
                } else if (field === "archived") {
                    if (!access.isProjectAdmin) {
                        return res.status(403).json({ message: "Only project admins can archive issues" });
                    }
                    issue.archived = Boolean(updates.archived);
                }
            }
        }

        await issue.save();
        
        await issue.populate("assignee", "fullName email");
        await issue.populate("reporter", "fullName email");

        return res.status(200).json({
            message: "Issue updated",
            issue
        });

    } catch (error) {
        console.error("Update issue error:", error);
        return res.status(500).json({ message: "Unable to update issue" });
    }
};

const deleteIssue = async (req, res) => {
    try {
        const { workspaceId, projectId, issueId } = req.params;

        const access = await getProjectAccess(req.user._id, workspaceId, projectId);
        if (access.error) {
            return res.status(access.status).json({ message: access.error });
        }

        if (!access.isProjectAdmin) {
            return res.status(403).json({ message: "Only project admins can delete issues" });
        }

        const issue = await Issue.findOneAndDelete({
            _id: issueId,
            project: projectId,
            workspace: workspaceId
        });

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        return res.status(200).json({ message: "Issue deleted successfully" });

    } catch (error) {
        console.error("Delete issue error:", error);
        return res.status(500).json({ message: "Unable to delete issue" });
    }
};

const addComment = async (req, res) => {
    try {
        const { workspaceId, projectId, issueId } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const access = await getProjectAccess(req.user._id, workspaceId, projectId);
        if (access.error) {
            return res.status(access.status).json({ message: access.error });
        }

        const issue = await Issue.findOne({
            _id: issueId,
            project: projectId,
            workspace: workspaceId
        });

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        issue.comments.push({
            text: text.trim(),
            author: req.user._id
        });

        await issue.save();
        
        // Return the newly created comment (the last one)
        const newComment = issue.comments[issue.comments.length - 1];
        await issue.populate("comments.author", "fullName email");
        
        return res.status(201).json({
            message: "Comment added",
            comment: issue.comments[issue.comments.length - 1]
        });

    } catch (error) {
        console.error("Add comment error:", error);
        return res.status(500).json({ message: "Unable to add comment" });
    }
};

module.exports = {
    createIssue,
    getProjectIssues,
    getIssue,
    updateIssue,
    deleteIssue,
    addComment
};
