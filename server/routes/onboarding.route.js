const express = require("express");

const {
    completeOnboarding,
    createOrganization,
} = require("../controllers/onboarding.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
    "/complete",
    authMiddleware,
    completeOnboarding
);

router.post(
    "/organization",
    authMiddleware,
    createOrganization
);

module.exports = router;