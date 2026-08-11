const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },

        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: true,
    }
);

const cardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        priority: {
            type: String,
            enum: ["NONE", "LOW", "MEDIUM", "HIGH", "URGENT"],
            default: "NONE",
        },

        dueDate: {
            type: Date,
            default: null,
        },

        labels: {
            type: [String],
            default: [],
        },

        checklist: {
            type: [checklistItemSchema],
            default: [],
        },

        archived: {
            type: Boolean,
            default: false,
        },

        position: {
            type: Number,
            required: true,
        },
    },
    {
        _id: true,
        timestamps: true,
    }
);

const listSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        position: {
            type: Number,
            required: true,
        },

        cards: {
            type: [cardSchema],
            default: [],
        },
    },
    {
        _id: true,
    }
);

const todoBoardSchema = new mongoose.Schema(
    {
        scope: {
            type: String,
            enum: ["PERSONAL", "ORGANIZATION"],
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            default: null,
        },

        lists: {
            type: [listSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

todoBoardSchema.index(
    { scope: 1, userId: 1 },
    {
        unique: true,
        partialFilterExpression: { scope: "PERSONAL", userId: { $exists: true, $ne: null } },
    }
);

todoBoardSchema.index(
    { scope: 1, workspaceId: 1 },
    {
        unique: true,
        partialFilterExpression: { scope: "ORGANIZATION", workspaceId: { $exists: true, $ne: null } },
    }
);

const TodoBoard = mongoose.model("TodoBoard", todoBoardSchema);

module.exports = TodoBoard;
