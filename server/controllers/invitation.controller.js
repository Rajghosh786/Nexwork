const Invitation = require("../models/Invitation");
const User = require("../models/User");
const Workspace = require("../models/Workspace");
const WorkspaceMember = require("../models/WorkspaceMember");

const sendInvitation = async (req, res) => {
    try {
        const { email, workspaceId } = req.body;

        if (!email || !workspaceId) {
            return res.status(400).json({
                message: "Email and workspace are required",
            });
        }

        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({
                message: "Workspace not found",
            });
        }

        if (workspace.type !== "ORGANIZATION") {
            return res.status(400).json({
                message: "Invitations can only be sent from organizations",
            });
        }

        if (workspace.subscriptionStatus !== "ACTIVE") {
            return res.status(403).json({
                message: "Your organization plan is not active",
            });
        }

        const senderMembership = await WorkspaceMember.findOne({
            user: req.user._id,
            workspace: workspaceId,
        });

        if (!senderMembership || senderMembership.role !== "ADMIN") {
            return res.status(403).json({
                message: "Only organization admins can send invitations",
            });
        }

        const recipient = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!recipient) {
            return res.status(404).json({
                message: "No user exists with this email",
            });
        }

        if (recipient._id.equals(req.user._id)) {
            return res.status(400).json({
                message: "You cannot invite yourself",
            });
        }

        const existingMember = await WorkspaceMember.findOne({
            user: recipient._id,
            workspace: workspaceId,
        });

        if (existingMember) {
            return res.status(400).json({
                message: "This user is already a member of the organization",
            });
        }

        const existingInvitation = await Invitation.findOne({
            sender: req.user._id,
            recipient: recipient._id,
            workspace: workspaceId,
            status: "PENDING",
        });

        if (existingInvitation) {
            return res.status(400).json({
                message: "Invitation already sent",
            });
        }

        const invitation = await Invitation.create({
            sender: req.user._id,
            recipient: recipient._id,
            workspace: workspaceId,
        });

        const populatedInvitation = await Invitation.findById(
            invitation._id
        )
            .populate("sender", "fullName email")
            .populate("workspace", "name");

        const io = req.app.get("io");

        io.to(`user:${recipient._id}`).emit(
            "new_invitation",
            populatedInvitation
        );

        return res.status(201).json({
            message: "Invitation sent successfully",
            invitation: populatedInvitation,
        });
    } catch (error) {
        console.error("Send invitation error:", error);

        return res.status(500).json({
            message: "Unable to send invitation",
        });
    }
};

const getInvitations = async (req, res) => {
    try {
        const invitations = await Invitation.find({
            recipient: req.user._id,
            status: "PENDING",
        })
            .populate("sender", "fullName email")
            .populate("workspace", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            invitations,
        });
    } catch (error) {
        console.error("Get invitations error:", error);

        return res.status(500).json({
            message: "Unable to get invitations",
        });
    }
};

const acceptInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findOne({
            _id: req.params.id,
            recipient: req.user._id,
            status: "PENDING",
        });

        if (!invitation) {
            return res.status(404).json({
                message: "Invitation not found",
            });
        }

        const existingMember = await WorkspaceMember.findOne({
            user: req.user._id,
            workspace: invitation.workspace,
        });

        if (!existingMember) {
            await WorkspaceMember.create({
                user: req.user._id,
                workspace: invitation.workspace,
                role: "MEMBER",
            });
        }

        invitation.status = "ACCEPTED";
        await invitation.save();

        return res.status(200).json({
            message: "Invitation accepted",
        });
    } catch (error) {
        console.error("Accept invitation error:", error);

        return res.status(500).json({
            message: "Unable to accept invitation",
        });
    }
};

const rejectInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findOne({
            _id: req.params.id,
            recipient: req.user._id,
            status: "PENDING",
        });

        if (!invitation) {
            return res.status(404).json({
                message: "Invitation not found",
            });
        }

        invitation.status = "REJECTED";

        await invitation.save();

        return res.status(200).json({
            message: "Invitation rejected",
        });
    } catch (error) {
        console.error("Reject invitation error:", error);

        return res.status(500).json({
            message: "Unable to reject invitation",
        });
    }
};

module.exports = {
    sendInvitation,
    getInvitations,
    acceptInvitation,
    rejectInvitation,
};