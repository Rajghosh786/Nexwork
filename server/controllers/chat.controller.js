const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const WorkspaceMember = require("../models/WorkspaceMember");
const ConversationRead = require("../models/ConversationRead");
const Notification = require("../models/Notification");
const User = require("../models/User");

const checkWorkspaceAccess = async (userId, workspaceId) => {
    const membership = await WorkspaceMember.findOne({
        user: userId,
        workspace: workspaceId,
    });

    return membership;
};

const isConversationParticipant = (conversation, userId) => {
    return conversation.participants.some((participant) => {
        const participantId = participant._id || participant;

        return participantId.toString() === userId.toString();
    });
};

const getUnreadCount = async (userId, conversationId, lastReadAt) => {
    const query = {
        conversation: conversationId,
        sender: { $ne: userId },
    };

    if (lastReadAt) {
        query.createdAt = { $gt: lastReadAt };
    }

    return Message.countDocuments(query);
};

const formatConversation = async (conversation, userId) => {
    const lastMessage = await Message.findOne({
        conversation: conversation._id,
    })
        .sort({ createdAt: -1 })
        .populate("sender", "fullName");

    let displayName = conversation.name;

    if (conversation.type === "DIRECT") {
        const otherUser = conversation.participants.find(
            (participant) => !participant._id.equals(userId)
        );

        displayName = otherUser?.fullName || "Direct Chat";
    }

    const readRecord = await ConversationRead.findOne({
        user: userId,
        conversation: conversation._id,
    });

    const unreadCount = await getUnreadCount(
        userId,
        conversation._id,
        readRecord?.lastReadAt
    );

    return {
        id: conversation._id,
        type: conversation.type,
        name: displayName,
        participants: conversation.participants,
        lastMessage: lastMessage
            ? {
                  content: lastMessage.content,
                  senderName: lastMessage.sender?.fullName,
                  createdAt: lastMessage.createdAt,
              }
            : null,
        unreadCount,
    };
};

const parseMentions = (content, members) => {
    const mentionedUsers = [];
    const mentionRegex = /@(\w+)/g;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
        const mentionName = match[1].toLowerCase();

        const member = members.find((item) => {
            const fullName = item.fullName.toLowerCase();
            const firstName = fullName.split(" ")[0];

            return (
                firstName === mentionName ||
                fullName.replace(/\s+/g, "") === mentionName ||
                fullName.startsWith(mentionName)
            );
        });

        if (
            member &&
            !mentionedUsers.some(
                (item) => String(item._id) === String(member._id)
            )
        ) {
            mentionedUsers.push(member);
        }
    }

    return mentionedUsers;
};

const getConversations = async (req, res) => {
    try {
        const { workspaceId } = req.query;

        if (!workspaceId) {
            return res.status(400).json({
                message: "Workspace is required",
            });
        }

        const membership = await checkWorkspaceAccess(
            req.user._id,
            workspaceId
        );

        if (!membership) {
            return res.status(403).json({
                message: "You do not have access to this workspace",
            });
        }

        const conversations = await Conversation.find({
            workspace: workspaceId,
            participants: req.user._id,
        })
            .populate("participants", "fullName email")
            .sort({ updatedAt: -1 });

        const formattedConversations = await Promise.all(
            conversations.map((conversation) =>
                formatConversation(conversation, req.user._id)
            )
        );

        return res.status(200).json({
            conversations: formattedConversations,
        });
    } catch (error) {
        console.error("Get conversations error:", error);

        return res.status(500).json({
            message: "Unable to get conversations",
        });
    }
};

const createConversation = async (req, res) => {
    try {
        const { workspaceId, type, participantIds, name } = req.body;

        if (!workspaceId || !type) {
            return res.status(400).json({
                message: "Workspace and conversation type are required",
            });
        }

        if (type !== "DIRECT" && type !== "GROUP") {
            return res.status(400).json({
                message: "Invalid conversation type",
            });
        }

        const membership = await checkWorkspaceAccess(
            req.user._id,
            workspaceId
        );

        if (!membership) {
            return res.status(403).json({
                message: "You do not have access to this workspace",
            });
        }

        if (type === "DIRECT") {
            if (!participantIds || participantIds.length !== 1) {
                return res.status(400).json({
                    message: "Direct chat requires one other participant",
                });
            }

            const otherUserId = participantIds[0];

            const otherMembership = await WorkspaceMember.findOne({
                user: otherUserId,
                workspace: workspaceId,
            });

            if (!otherMembership) {
                return res.status(400).json({
                    message: "That user is not in this workspace",
                });
            }

            const existingConversation = await Conversation.findOne({
                workspace: workspaceId,
                type: "DIRECT",
                participants: {
                    $all: [req.user._id, otherUserId],
                    $size: 2,
                },
            }).populate("participants", "fullName email");

            if (existingConversation) {
                const otherUser = existingConversation.participants.find(
                    (participant) =>
                        !participant._id.equals(req.user._id)
                );

                return res.status(200).json({
                    conversation: {
                        id: existingConversation._id,
                        type: existingConversation.type,
                        name: otherUser?.fullName || "Direct Chat",
                        participants: existingConversation.participants,
                    },
                });
            }

            const conversation = await Conversation.create({
                workspace: workspaceId,
                type: "DIRECT",
                participants: [req.user._id, otherUserId],
                createdBy: req.user._id,
            });

            const populatedConversation = await Conversation.findById(
                conversation._id
            ).populate("participants", "fullName email");

            const otherUser = populatedConversation.participants.find(
                (participant) => !participant._id.equals(req.user._id)
            );

            return res.status(201).json({
                conversation: {
                    id: populatedConversation._id,
                    type: populatedConversation.type,
                    name: otherUser?.fullName || "Direct Chat",
                    participants: populatedConversation.participants,
                },
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Channel name is required",
            });
        }

        const channelName = name.trim();

        const existingChannel = await Conversation.findOne({
            workspace: workspaceId,
            type: "GROUP",
            name: channelName,
        });

        if (existingChannel) {
            return res.status(400).json({
                message: "A channel with this name already exists",
            });
        }

        const uniqueParticipantIds = [
            ...new Set((participantIds || []).map((id) => id.toString())),
        ];

        for (const participantId of uniqueParticipantIds) {
            if (participantId === req.user._id.toString()) {
                continue;
            }

            const participantMembership = await WorkspaceMember.findOne({
                user: participantId,
                workspace: workspaceId,
            });

            if (!participantMembership) {
                return res.status(400).json({
                    message: "One or more users are not in this workspace",
                });
            }
        }

        const allParticipants = [
            req.user._id,
            ...uniqueParticipantIds.filter(
                (id) => id !== req.user._id.toString()
            ),
        ];

        const conversation = await Conversation.create({
            workspace: workspaceId,
            type: "GROUP",
            name: name.trim(),
            participants: allParticipants,
            createdBy: req.user._id,
        });

        await ConversationRead.create({
            user: req.user._id,
            conversation: conversation._id,
            lastReadAt: new Date(),
        });

        const populatedConversation = await Conversation.findById(
            conversation._id
        ).populate("participants", "fullName email");

        const io = req.app.get("io");

        for (const participantId of allParticipants) {
            if (participantId.equals(req.user._id)) {
                continue;
            }

            io.to(`user:${participantId}`).emit("channel_added", {
                conversation: await formatConversation(
                    populatedConversation,
                    participantId
                ),
            });
        }

        return res.status(201).json({
            conversation: {
                id: populatedConversation._id,
                type: populatedConversation.type,
                name: populatedConversation.name,
                participants: populatedConversation.participants,
            },
        });
    } catch (error) {
        console.error("Create conversation error:", error);

        return res.status(500).json({
            message: "Unable to create conversation",
        });
    }
};

const getConversationDetails = async (req, res) => {
    try {
        const conversation = await Conversation.findById(
            req.params.id
        ).populate("participants", "fullName email");

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        if (!isConversationParticipant(conversation, req.user._id)) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const membership = await checkWorkspaceAccess(
            req.user._id,
            conversation.workspace
        );

        if (!membership) {
            return res.status(403).json({
                message: "You do not have access to this workspace",
            });
        }

        const formatted = await formatConversation(
            conversation,
            req.user._id
        );

        return res.status(200).json({
            conversation: formatted,
        });
    } catch (error) {
        console.error("Get conversation details error:", error);

        return res.status(500).json({
            message: "Unable to get conversation",
        });
    }
};

const getConversationMembers = async (req, res) => {
    try {
        const conversation = await Conversation.findById(
            req.params.id
        ).populate("participants", "fullName email");

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        if (!isConversationParticipant(conversation, req.user._id)) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const members = conversation.participants.map((participant) => ({
            id: participant._id,
            fullName: participant.fullName,
            email: participant.email,
        }));

        return res.status(200).json({
            members,
        });
    } catch (error) {
        console.error("Get conversation members error:", error);

        return res.status(500).json({
            message: "Unable to get conversation members",
        });
    }
};

const addConversationMembers = async (req, res) => {
    try {
        const { memberIds } = req.body;

        if (!memberIds || memberIds.length === 0) {
            return res.status(400).json({
                message: "At least one member is required",
            });
        }

        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        if (!isConversationParticipant(conversation, req.user._id)) {
            return res.status(403).json({
                message: "You are not a member of this channel",
            });
        }

        if (conversation.type !== "GROUP") {
            return res.status(400).json({
                message: "Members can only be added to channels",
            });
        }

        const uniqueMemberIds = [
            ...new Set(memberIds.map((id) => id.toString())),
        ];

        const addedMembers = [];

        for (const memberId of uniqueMemberIds) {
            const alreadyMember = conversation.participants.some(
                (participant) => participant.toString() === memberId
            );

            if (alreadyMember) {
                continue;
            }

            const workspaceMembership = await WorkspaceMember.findOne({
                user: memberId,
                workspace: conversation.workspace,
            });

            if (!workspaceMembership) {
                return res.status(400).json({
                    message: "One or more users are not in this workspace",
                });
            }

            conversation.participants.push(memberId);
            addedMembers.push(memberId);
        }

        await conversation.save();

        const populatedConversation = await Conversation.findById(
            conversation._id
        ).populate("participants", "fullName email");

        const io = req.app.get("io");

        for (const memberId of addedMembers) {
            io.to(`user:${memberId}`).emit("channel_added", {
                conversation: await formatConversation(
                    populatedConversation,
                    memberId
                ),
            });
        }

        io.to(`conversation:${conversation._id}`).emit(
            "channel_members_updated",
            {
                conversationId: conversation._id,
            }
        );

        return res.status(200).json({
            message: "Members added successfully",
            members: populatedConversation.participants.map(
                (participant) => ({
                    id: participant._id,
                    fullName: participant.fullName,
                    email: participant.email,
                })
            ),
        });
    } catch (error) {
        console.error("Add conversation members error:", error);

        return res.status(500).json({
            message: "Unable to add members",
        });
    }
};

const markConversationAsRead = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.id);

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        if (!isConversationParticipant(conversation, req.user._id)) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        await ConversationRead.findOneAndUpdate(
            {
                user: req.user._id,
                conversation: conversation._id,
            },
            {
                lastReadAt: new Date(),
            },
            {
                upsert: true,
                new: true,
            }
        );

        return res.status(200).json({
            message: "Marked as read",
            unreadCount: 0,
        });
    } catch (error) {
        console.error("Mark as read error:", error);

        return res.status(500).json({
            message: "Unable to mark as read",
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const conversation = await Conversation.findById(
            req.params.id
        );

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        if (!isConversationParticipant(conversation, req.user._id)) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        const membership = await checkWorkspaceAccess(
            req.user._id,
            conversation.workspace
        );

        if (!membership) {
            return res.status(403).json({
                message: "You do not have access to this workspace",
            });
        }

        const messages = await Message.find({
            conversation: conversation._id,
        })
            .populate("sender", "fullName email")
            .populate("mentions", "fullName")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            messages: messages.map((message) => ({
                id: message._id,
                content: message.content,
                sender: {
                    id: message.sender._id,
                    fullName: message.sender.fullName,
                },
                mentions: (message.mentions || []).map((mention) => ({
                    id: mention._id,
                    fullName: mention.fullName,
                })),
                createdAt: message.createdAt,
            })),
        });
    } catch (error) {
        console.error("Get messages error:", error);

        return res.status(500).json({
            message: "Unable to get messages",
        });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: "Message content is required",
            });
        }

        const conversation = await Conversation.findById(
            req.params.id
        ).populate("participants", "fullName email");

        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            });
        }

        if (!isConversationParticipant(conversation, req.user._id)) {
            return res.status(403).json({
                message: "You are not part of this conversation",
            });
        }

        const membership = await checkWorkspaceAccess(
            req.user._id,
            conversation.workspace
        );

        if (!membership) {
            return res.status(403).json({
                message: "You do not have access to this workspace",
            });
        }

        const channelMembers = await User.find({
            _id: { $in: conversation.participants },
        }).select("fullName email");

        const mentionedUsers = parseMentions(
            content.trim(),
            channelMembers
        );

        const validMentions = mentionedUsers.filter((mentionedUser) =>
            conversation.participants.some((participant) =>
                participant._id.equals(mentionedUser._id)
            )
        );

        const message = await Message.create({
            conversation: conversation._id,
            workspace: conversation.workspace,
            sender: req.user._id,
            content: content.trim(),
            mentions: validMentions.map((item) => item._id),
        });

        conversation.updatedAt = new Date();
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "fullName email")
            .populate("mentions", "fullName");

        const messageData = {
            id: populatedMessage._id,
            conversationId: conversation._id,
            content: populatedMessage.content,
            sender: {
                id: populatedMessage.sender._id,
                fullName: populatedMessage.sender.fullName,
            },
            mentions: (populatedMessage.mentions || []).map((mention) => ({
                id: mention._id,
                fullName: mention.fullName,
            })),
            createdAt: populatedMessage.createdAt,
        };

        const io = req.app.get("io");

        io.to(`conversation:${conversation._id}`).emit(
            "new_message",
            messageData
        );

        for (const participant of conversation.participants) {
            if (participant._id.equals(req.user._id)) {
                continue;
            }

            const readRecord = await ConversationRead.findOne({
                user: participant._id,
                conversation: conversation._id,
            });

            const unreadCount = await getUnreadCount(
                participant._id,
                conversation._id,
                readRecord?.lastReadAt
            );

            io.to(`user:${participant._id}`).emit("unread_update", {
                conversationId: conversation._id,
                unreadCount,
            });
        }

        for (const mentionedUser of validMentions) {
            if (mentionedUser._id.equals(req.user._id)) {
                continue;
            }

            const notification = await Notification.create({
                recipient: mentionedUser._id,
                sender: req.user._id,
                conversation: conversation._id,
                message: message._id,
                type: "MENTION",
            });

            const populatedNotification = await Notification.findById(
                notification._id
            )
                .populate("sender", "fullName")
                .populate("conversation", "name type");

            io.to(`user:${mentionedUser._id}`).emit(
                "new_notification",
                {
                    id: populatedNotification._id,
                    type: populatedNotification.type,
                    sender: {
                        fullName: populatedNotification.sender.fullName,
                    },
                    conversation: {
                        id: populatedNotification.conversation._id,
                        name:
                            populatedNotification.conversation.type ===
                            "GROUP"
                                ? populatedNotification.conversation.name
                                : req.user.fullName,
                    },
                    message: {
                        content: populatedMessage.content,
                    },
                    read: false,
                    createdAt: populatedNotification.createdAt,
                }
            );
        }

        return res.status(201).json({
            message: messageData,
        });
    } catch (error) {
        console.error("Send message error:", error);

        return res.status(500).json({
            message: "Unable to send message",
        });
    }
};

const getWorkspaceMembers = async (req, res) => {
    try {
        const { workspaceId } = req.query;

        if (!workspaceId) {
            return res.status(400).json({
                message: "Workspace is required",
            });
        }

        const membership = await checkWorkspaceAccess(
            req.user._id,
            workspaceId
        );

        if (!membership) {
            return res.status(403).json({
                message: "You do not have access to this workspace",
            });
        }

        const memberships = await WorkspaceMember.find({
            workspace: workspaceId,
        }).populate("user", "fullName email");

        const members = memberships.map((item) => ({
            id: item.user._id,
            fullName: item.user.fullName,
            email: item.user.email,
            role: item.role,
        }));

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
    getConversations,
    createConversation,
    getConversationDetails,
    getConversationMembers,
    addConversationMembers,
    markConversationAsRead,
    getMessages,
    sendMessage,
    getWorkspaceMembers,
    isConversationParticipant,
};
