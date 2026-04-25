const ApiResponse = require("../utils/ApiResponse");
const Validator = require("../utils/Validator");
const EmergencyProfileRepository = require("../repositories/EmergencyProfileRepository");
const EmergencyService = require("../services/EmergencyService");
const TokenService = require("../services/TokenService");
const QRCodeService = require("../services/QRCodeService");

class EmergencyController {
  constructor(emergencyService) {
    this.emergencyService = emergencyService;
  }

  getRequestOrigin(req) {
    return `${req.protocol}://${req.get("host")}`;
  }

  getMyProfile = async (req, res) => {
    try {
      const data = await this.emergencyService.getMyProfile(req.user.id, this.getRequestOrigin(req));
      return ApiResponse.success(res, data, "Emergency profile fetched", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to fetch emergency profile");
    }
  };

  setupProfile = async (req, res) => {
    try {
      const data = await this.emergencyService.setupProfile(req.user.id, req.body, this.getRequestOrigin(req));
      return ApiResponse.success(res, data, "Emergency profile saved", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to save emergency profile");
    }
  };

  toggleAccess = async (req, res) => {
    try {
      const data = await this.emergencyService.toggleAccess(req.user.id, req.body.enabled, this.getRequestOrigin(req));
      return ApiResponse.success(res, data, "Emergency access updated", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to update emergency access");
    }
  };

  regenerateToken = async (req, res) => {
    try {
      const data = await this.emergencyService.regenerateToken(req.user.id, this.getRequestOrigin(req));
      return ApiResponse.success(res, data, "Emergency token regenerated", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to regenerate emergency token");
    }
  };

  getQrCode = async (req, res) => {
    try {
      const data = await this.emergencyService.getQrCode(req.user.id, this.getRequestOrigin(req));
      return ApiResponse.success(res, data, "Emergency QR code generated", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to generate emergency QR code");
    }
  };

  getPublicProfile = async (req, res) => {
    try {
      const token = Validator.validateToken(req.params.token);
      const data = await this.emergencyService.getPublicProfile(token);
      return ApiResponse.success(res, data, "Emergency profile fetched", 200);
    } catch (error) {
      return ApiResponse.error(res, error, "Failed to fetch emergency profile");
    }
  };
}

const emergencyService = new EmergencyService({
  emergencyProfileRepository: EmergencyProfileRepository,
  tokenService: new TokenService(EmergencyProfileRepository),
  qrCodeService: new QRCodeService(),
  validator: Validator,
});

module.exports = new EmergencyController(emergencyService);
