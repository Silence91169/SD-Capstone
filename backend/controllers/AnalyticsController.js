const ApiResponse = require("../utils/ApiResponse");
const DateUtils = require("../utils/DateUtils");
const Validators = require("../utils/Validators");

const VitalLog = require("../models/VitalLog");
const AnalyticsSnapshot = require("../models/AnalyticsSnapshot");
const MedicalRecord = require("../models/MedicalRecord");
const MedicalDocument = require("../models/MedicalDocument");

const VitalsService = require("../services/VitalsService");
const RiskEngineService = require("../services/RiskEngineService");
const HealthScoreService = require("../services/HealthScoreService");
const ReportAnalysisService = require("../services/ReportAnalysisService");
const AnalyticsService = require("../services/AnalyticsService");

class AnalyticsController {
  constructor({ vitalsService, analyticsService }) {
    this.vitalsService = vitalsService;
    this.analyticsService = analyticsService;
  }

  createVitalLog = async (req, res) => {
    try {
      const data = await this.vitalsService.createVitalLog(req.user.id, req.body);
      return ApiResponse.success(res, data, "Vitals log created", 201);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to create vitals log");
    }
  };

  getVitalsHistory = async (req, res) => {
    try {
      const data = await this.vitalsService.getVitalsHistory(req.user.id);
      return ApiResponse.success(res, data, "Vitals history fetched", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to fetch vitals history");
    }
  };

  updateVitalLog = async (req, res) => {
    try {
      const data = await this.vitalsService.updateVitalLog(req.user.id, req.params.id, req.body);
      return ApiResponse.success(res, data, "Vitals log updated", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to update vitals log");
    }
  };

  deleteVitalLog = async (req, res) => {
    try {
      const data = await this.vitalsService.deleteVitalLog(req.user.id, req.params.id);
      return ApiResponse.success(res, data, "Vitals log deleted", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to delete vitals log");
    }
  };

  getDashboard = async (req, res) => {
    try {
      const data = await this.analyticsService.getDashboard(req.user.id);
      return ApiResponse.success(res, data, "Analytics dashboard fetched", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to fetch analytics dashboard");
    }
  };

  getSummary = async (req, res) => {
    try {
      const data = await this.analyticsService.getSummary(req.user.id);
      return ApiResponse.success(res, data, "Analytics summary fetched", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to fetch analytics summary");
    }
  };
}

const vitalsService = new VitalsService({
  vitalLogModel: VitalLog,
  validators: Validators,
  dateUtils: DateUtils,
});

const analyticsService = new AnalyticsService({
  vitalsService,
  riskEngineService: new RiskEngineService(),
  healthScoreService: new HealthScoreService(),
  reportAnalysisService: new ReportAnalysisService({
    medicalRecordModel: MedicalRecord,
    medicalDocumentModel: MedicalDocument,
    dateUtils: DateUtils,
  }),
  analyticsSnapshotModel: AnalyticsSnapshot,
  dateUtils: DateUtils,
});

module.exports = new AnalyticsController({
  vitalsService,
  analyticsService,
});
