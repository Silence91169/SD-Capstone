const express = require("express");
const protect = require("../middleware/authMiddleware");
const EmergencyController = require("../controllers/EmergencyController");

const router = express.Router();

router.use(protect);

router.get("/me", EmergencyController.getMyProfile);
router.post("/setup", EmergencyController.setupProfile);
router.patch("/toggle", EmergencyController.toggleAccess);
router.post("/regenerate", EmergencyController.regenerateToken);
router.get("/qr", EmergencyController.getQrCode);

module.exports = router;
