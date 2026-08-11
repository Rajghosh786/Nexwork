const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user._id,
        })
            .populate("sender", "fullName")
            .populate("conversation", "name type")
            .populate("message", "content")
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            notifications: notifications.map((notification) => ({
                id: notification._id,
                type: notification.type,
                read: notification.read,
                sender: {
                    fullName: notification.sender.fullName,
                },
                conversation: {
                    id: notification.conversation._id,
                    name: notification.conversation.name,
                    type: notification.conversation.type,
                },
                message: {
                    content: notification.message.content,
                },
                createdAt: notification.createdAt,
            })),
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        return res.status(500).json({
            message: "Unable to get notifications",
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found",
            });
        }

        notification.read = true;
        await notification.save();

        return res.status(200).json({
            message: "Notification marked as read",
        });
    } catch (error) {
        console.error("Mark notification read error:", error);

        return res.status(500).json({
            message: "Unable to mark notification as read",
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
};
