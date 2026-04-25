const express = require("express");
const EmergencyController = require("../controllers/EmergencyController");
const emergencyRateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.get("/emergency/:token", emergencyRateLimiter, EmergencyController.getPublicProfile);

module.exports = router;
