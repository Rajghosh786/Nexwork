const TodoBoard = require("../models/TodoBoard");

const getPersonalBoard = async (req, res) => {
    try {
        let board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            board = await TodoBoard.create({
                scope: "PERSONAL",
                userId: req.user._id,
                lists: [],
            });
        }

        return res.status(200).json({ board });
    } catch (error) {
        console.error("Get personal board error:", error);

        return res.status(500).json({
            message: "Unable to get todo board",
        });
    }
};

const createList = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "List title is required",
            });
        }

        const board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            return res.status(404).json({
                message: "Todo board not found",
            });
        }

        const maxPosition =
            board.lists.length > 0
                ? Math.max(...board.lists.map((list) => list.position))
                : -1;

        board.lists.push({
            title: title.trim(),
            position: maxPosition + 1,
            cards: [],
        });

        await board.save();

        const newList = board.lists[board.lists.length - 1];

        return res.status(201).json({
            message: "List created",
            list: newList,
        });
    } catch (error) {
        console.error("Create list error:", error);

        return res.status(500).json({
            message: "Unable to create list",
        });
    }
};

const updateList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "List title is required",
            });
        }

        const board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            return res.status(404).json({
                message: "Todo board not found",
            });
        }

        const list = board.lists.id(listId);

        if (!list) {
            return res.status(404).json({
                message: "List not found",
            });
        }

        list.title = title.trim();

        await board.save();

        return res.status(200).json({
            message: "List updated",
            list,
        });
    } catch (error) {
        console.error("Update list error:", error);

        return res.status(500).json({
            message: "Unable to update list",
        });
    }
};

const deleteList = async (req, res) => {
    try {
        const { listId } = req.params;

        const board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            return res.status(404).json({
                message: "Todo board not found",
            });
        }

        const list = board.lists.id(listId);

        if (!list) {
            return res.status(404).json({
                message: "List not found",
            });
        }

        board.lists.pull({ _id: listId });

        await board.save();

        return res.status(200).json({
            message: "List deleted",
        });
    } catch (error) {
        console.error("Delete list error:", error);

        return res.status(500).json({
            message: "Unable to delete list",
        });
    }
};

const reorderLists = async (req, res) => {
    try {
        const { listOrder } = req.body;

        if (!Array.isArray(listOrder) || listOrder.length === 0) {
            return res.status(400).json({
                message: "List order is required",
            });
        }

        const board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            return res.status(404).json({
                message: "Todo board not found",
            });
        }

        for (let i = 0; i < listOrder.length; i++) {
            const list = board.lists.id(listOrder[i]);

            if (list) {
                list.position = i;
            }
        }

        board.lists.sort((a, b) => a.position - b.position);

        await board.save();

        return res.status(200).json({
            message: "Lists reordered",
            board,
        });
    } catch (error) {
        console.error("Reorder lists error:", error);

        return res.status(500).json({
            message: "Unable to reorder lists",
        });
    }
};

const createCard = async (req, res) => {
    try {
        const { listId } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Card title is required",
            });
        }

        const board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            return res.status(404).json({
                message: "Todo board not found",
            });
        }

        const list = board.lists.id(listId);

        if (!list) {
            return res.status(404).json({
                message: "List not found",
            });
        }

        const maxPosition =
            list.cards.length > 0
                ? Math.max(...list.cards.map((card) => card.position))
                : -1;

        list.cards.push({
            title: title.trim(),
            position: maxPosition + 1,
        });

        await board.save();

        const newCard = list.cards[list.cards.length - 1];

        return res.status(201).json({
            message: "Card created",
            card: newCard,
        });
    } catch (error) {
        console.error("Create card error:", error);

        return res.status(500).json({
            message: "Unable to create card",
        });
    }
};

const updateCard = async (req, res) => {
    try {
        const { listId, cardId } = req.params;
        const updates = req.body;

        const board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            return res.status(404).json({
                message: "Todo board not found",
            });
        }

        const list = board.lists.id(listId);

        if (!list) {
            return res.status(404).json({
                message: "List not found",
            });
        }

        const card = list.cards.id(cardId);

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        const allowedFields = [
            "title",
            "description",
            "priority",
            "dueDate",
            "labels",
            "checklist",
            "archived",
        ];

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                if (field === "title") {
                    if (!updates.title || !updates.title.trim()) {
                        return res.status(400).json({
                            message: "Card title cannot be empty",
                        });
                    }

                    card.title = updates.title.trim();
                } else if (field === "description") {
                    card.description =
                        typeof updates.description === "string"
                            ? updates.description.trim()
                            : "";
                } else if (field === "priority") {
                    const validPriorities = [
                        "NONE",
                        "LOW",
                        "MEDIUM",
                        "HIGH",
                        "URGENT",
                    ];

                    if (!validPriorities.includes(updates.priority)) {
                        return res.status(400).json({
                            message: "Invalid priority value",
                        });
                    }

                    card.priority = updates.priority;
                } else if (field === "dueDate") {
                    card.dueDate = updates.dueDate
                        ? new Date(updates.dueDate)
                        : null;
                } else if (field === "labels") {
                    if (!Array.isArray(updates.labels)) {
                        return res.status(400).json({
                            message: "Labels must be an array",
                        });
                    }

                    card.labels = updates.labels
                        .filter((label) => typeof label === "string" && label.trim())
                        .map((label) => label.trim());
                } else if (field === "checklist") {
                    if (!Array.isArray(updates.checklist)) {
                        return res.status(400).json({
                            message: "Checklist must be an array",
                        });
                    }

                    card.checklist = updates.checklist
                        .filter(
                            (item) =>
                                item &&
                                typeof item.text === "string" &&
                                item.text.trim()
                        )
                        .map((item) => ({
                            text: item.text.trim(),
                            completed: Boolean(item.completed),
                        }));
                } else if (field === "archived") {
                    card.archived = Boolean(updates.archived);
                }
            }
        }

        await board.save();

        return res.status(200).json({
            message: "Card updated",
            card,
        });
    } catch (error) {
        console.error("Update card error:", error);

        return res.status(500).json({
            message: "Unable to update card",
        });
    }
};

const deleteCard = async (req, res) => {
    try {
        const { listId, cardId } = req.params;

        const board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            return res.status(404).json({
                message: "Todo board not found",
            });
        }

        const list = board.lists.id(listId);

        if (!list) {
            return res.status(404).json({
                message: "List not found",
            });
        }

        const card = list.cards.id(cardId);

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        list.cards.pull({ _id: cardId });

        await board.save();

        return res.status(200).json({
            message: "Card deleted",
        });
    } catch (error) {
        console.error("Delete card error:", error);

        return res.status(500).json({
            message: "Unable to delete card",
        });
    }
};

const moveCard = async (req, res) => {
    try {
        const { sourceListId, cardId, targetListId, targetPosition } =
            req.body;

        if (!sourceListId || !cardId || !targetListId || targetPosition === undefined) {
            return res.status(400).json({
                message:
                    "sourceListId, cardId, targetListId, and targetPosition are required",
            });
        }

        const board = await TodoBoard.findOne({
            scope: "PERSONAL",
            userId: req.user._id,
        });

        if (!board) {
            return res.status(404).json({
                message: "Todo board not found",
            });
        }

        const sourceList = board.lists.id(sourceListId);

        if (!sourceList) {
            return res.status(404).json({
                message: "Source list not found",
            });
        }

        const cardIndex = sourceList.cards.findIndex(
            (card) => card._id.toString() === cardId
        );

        if (cardIndex === -1) {
            return res.status(404).json({
                message: "Card not found in source list",
            });
        }

        const [movedCard] = sourceList.cards.splice(cardIndex, 1);

        sourceList.cards.forEach((card, index) => {
            card.position = index;
        });

        const targetList = board.lists.id(targetListId);

        if (!targetList) {
            return res.status(404).json({
                message: "Target list not found",
            });
        }

        const insertAt = Math.min(
            Math.max(0, targetPosition),
            targetList.cards.length
        );

        movedCard.position = insertAt;

        targetList.cards.splice(insertAt, 0, movedCard);

        targetList.cards.forEach((card, index) => {
            card.position = index;
        });

        await board.save();

        return res.status(200).json({
            message: "Card moved",
            board,
        });
    } catch (error) {
        console.error("Move card error:", error);

        return res.status(500).json({
            message: "Unable to move card",
        });
    }
};

module.exports = {
    getPersonalBoard,
    createList,
    updateList,
    deleteList,
    reorderLists,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
};
