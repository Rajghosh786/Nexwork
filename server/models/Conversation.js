const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        type: {
            type: String,
            enum: ["DIRECT", "GROUP"],
            required: true,
        },

        name: {
            type: String,
            trim: true,
            default: "",
        },

        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
