const express = require("express");

const {register, login, logout, getCurrentUser} = require("../controllers/auth.controller.js");

const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;