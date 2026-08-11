const User = require("../models/User");
const Workspace = require("../models/Workspace");
const WorkspaceMember = require("../models/WorkspaceMember");

const completeOnboarding = async (req, res) => {
    try {
        const { accountType } = req.body;

        if (!accountType) {
            return res.status(400).json({
                message: "Account type is required",
            });
        }

        if (
            accountType !== "PERSONAL" &&
            accountType !== "ORGANIZATION"
        ) {
            return res.status(400).json({
                message: "Invalid account type",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.onboardingCompleted) {
            return res.status(400).json({
                message: "Onboarding is already completed",
            });
        }

        user.onboardingCompleted = true;

        await user.save();

        return res.status(200).json({
            message: "Onboarding completed successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                platformRole: user.platformRole,
                onboardingCompleted: user.onboardingCompleted,
                personalWorkspace: user.personalWorkspace,
            },
        });
    } catch (error) {
        console.error("Onboarding error:", error);

        return res.status(500).json({
            message: "Unable to complete onboarding",
        });
    }
};

const createOrganization = async (req, res) => {
    try {
        const { organizationName, subscriptionPlan } = req.body;

        if (!organizationName || !organizationName.trim()) {
            return res.status(400).json({
                message: "Organization name is required",
            });
        }

        const allowedPlans = ["BASIC", "PLUS", "PRO"];

        if (!allowedPlans.includes(subscriptionPlan)) {
            return res.status(400).json({
                message: "Invalid subscription plan",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.onboardingCompleted) {
            return res.status(400).json({
                message: "Onboarding is already completed",
            });
        }

        const workspace = await Workspace.create({
            name: organizationName.trim(),
            type: "ORGANIZATION",
            owner: user._id,
            subscriptionPlan,
            subscriptionStatus: "ACTIVE",
        });

        await WorkspaceMember.create({
            user: user._id,
            workspace: workspace._id,
            role: "ADMIN",
        });

        user.onboardingCompleted = true;

        await user.save();

        return res.status(201).json({
            message: "Organization created successfully",
            workspace: {
                id: workspace._id,
                name: workspace.name,
                type: workspace.type,
                subscriptionPlan: workspace.subscriptionPlan,
                subscriptionStatus: workspace.subscriptionStatus,
            },
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                platformRole: user.platformRole,
                onboardingCompleted: user.onboardingCompleted,
                personalWorkspace: user.personalWorkspace,
            },
        });
    } catch (error) {
        console.error("Create organization error:", error);

        return res.status(500).json({
            message: "Unable to create organization",
        });
    }
};

module.exports = {
    completeOnboarding,
    createOrganization,
};