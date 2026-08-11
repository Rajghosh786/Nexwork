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

module.exports = {
    getWorkspaces,
};
