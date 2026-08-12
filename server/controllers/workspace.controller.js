const WorkspaceMember = require("../models/WorkspaceMember");

const getWorkspaces = async (req, res) => {
    try {
        const memberships = await WorkspaceMember.find({
            user: req.user._id,
        }).populate("workspace", "name type subscriptionPlan subscriptionStatus");

        const workspaces = memberships
            .filter((membership) => membership.workspace)
            .map((membership) => ({
                id: membership.workspace._id.toString(),
                name: membership.workspace.name,
                type: membership.workspace.type,
                role: membership.role,
                subscriptionPlan: membership.workspace.subscriptionPlan,
                subscriptionStatus: membership.workspace.subscriptionStatus,
            }));

        return res.status(200).json(workspaces);
    } catch (error) {
        console.error("Get workspaces error:", error);

        return res.status(500).json({
            message: "Unable to get workspaces",
        });
    }
};

const getWorkspaceMembers = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const membership = await WorkspaceMember.findOne({
            workspace: workspaceId,
            user: req.user._id,
        });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this workspace",
            });
        }

        const members = await WorkspaceMember.find({
            workspace: workspaceId,
        }).populate("user", "fullName email");

        return res.status(200).json({
            members,
        });
    } catch (error) {
        console.error("Get workspace members error:", error);

        return res.status(500).json({
            message: "Unable to get workspace members",
        });
    }
};

module.exports = {
    getWorkspaces, getWorkspaceMembers
};
