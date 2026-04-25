const express = require("express");
const protect = require("../middleware/authMiddleware");
const AnalyticsController = require("../controllers/AnalyticsController");

const router = express.Router();

router.use(protect);

router.post("/vitals", AnalyticsController.createVitalLog);
router.get("/vitals", AnalyticsController.getVitalsHistory);
router.put("/vitals/:id", AnalyticsController.updateVitalLog);
router.delete("/vitals/:id", AnalyticsController.deleteVitalLog);

router.get("/dashboard", AnalyticsController.getDashboard);
router.get("/summary", AnalyticsController.getSummary);

module.exports = router;
