const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Workspace = require("../models/Workspace");
const WorkspaceMember = require("../models/WorkspaceMember");

const createToken = (userId) => {
    return jwt.sign({userId,},process.env.JWT_SECRET,{expiresIn: "7d",});
};

const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const getSafeUser = (user) => {
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        platformRole: user.platformRole,
        onboardingCompleted: user.onboardingCompleted,
        personalWorkspace: user.personalWorkspace,
    };
};

const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Full name, email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedFullName = fullName.trim();

        if (!trimmedFullName) {
            return res.status(400).json({
                message: "Full name is required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName: trimmedFullName,
            email: normalizedEmail,
            password: hashedPassword,
            platformRole: "USER",
        });

        try {
            const workspace = await Workspace.create({
                name: `${trimmedFullName}'s Personal Workspace`,
                type: "PERSONAL",
                owner: user._id,
                subscriptionPlan: "FREE",
                subscriptionStatus: "ACTIVE",
            });

            await WorkspaceMember.create({
                user: user._id,
                workspace: workspace._id,
                role: "PERSONAL",
            });

            user.personalWorkspace = workspace._id;

            await user.save();
        } catch (workspaceError) {
            await User.findByIdAndDelete(user._id);

            throw workspaceError;
        }

        const token = createToken(user._id);

        setAuthCookie(res, token);

        return res.status(201).json({
            message: "Account created successfully",
            user: getSafeUser(user),
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Unable to create account",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = createToken(user._id);

        setAuthCookie(res, token);

        return res.status(200).json({
            message: "Login successful",
            user: getSafeUser(user),
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Unable to log in",
        });
    }
};

const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Logout successful",
    });
};

const getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json({
            user: getSafeUser(req.user),
        });
    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            message: "Unable to get current user",
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
};