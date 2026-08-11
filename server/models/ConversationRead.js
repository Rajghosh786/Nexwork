const mongoose = require("mongoose");

const conversationReadSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },

        lastReadAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

conversationReadSchema.index(
    { user: 1, conversation: 1 },
    { unique: true }
);

const ConversationRead = mongoose.model(
    "ConversationRead",
    conversationReadSchema
);

module.exports = ConversationRead;
