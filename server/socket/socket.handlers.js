const Conversation = require("../models/Conversation");
const { isConversationParticipant } = require("../controllers/chat.controller");

const setupSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join_user", (userId) => {
            socket.userId = String(userId);
            socket.join(`user:${userId}`);
        });

        socket.on("join_conversation", async (conversationId) => {
            try {
                if (!socket.userId) {
                    return;
                }

                const conversation = await Conversation.findById(
                    conversationId
                );

                if (!conversation) {
                    return;
                }

                const isMember = isConversationParticipant(
                    conversation,
                    socket.userId
                );

                if (!isMember) {
                    console.log(
                        "Socket join denied for user",
                        socket.userId,
                        "conversation",
                        conversationId
                    );
                    return;
                }

                socket.join(`conversation:${conversationId}`);
            } catch (error) {
                console.error("Socket join conversation error:", error);
            }
        });

        socket.on("leave_conversation", (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });
};

module.exports = setupSocketHandlers;
