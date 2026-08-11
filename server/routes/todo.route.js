const express = require("express");

const {
    getPersonalBoard,
    createList,
    updateList,
    deleteList,
    reorderLists,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
} = require("../controllers/todo.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/personal", authMiddleware, getPersonalBoard);

router.post("/personal/lists", authMiddleware, createList);
router.patch("/personal/lists/:listId", authMiddleware, updateList);
router.delete("/personal/lists/:listId", authMiddleware, deleteList);
router.put("/personal/lists/reorder", authMiddleware, reorderLists);

router.post("/personal/lists/:listId/cards", authMiddleware, createCard);
router.patch("/personal/lists/:listId/cards/:cardId", authMiddleware, updateCard);
router.delete("/personal/lists/:listId/cards/:cardId", authMiddleware, deleteCard);
router.put("/personal/cards/move", authMiddleware, moveCard);

module.exports = router;
