const UserRepository = require("../repositories/UserRepository");

class EmergencyService {
  constructor({ emergencyProfileRepository, tokenService, qrCodeService, validator }) {
    this.emergencyProfileRepository = emergencyProfileRepository;
    this.tokenService = tokenService;
    this.qrCodeService = qrCodeService;
    this.validator = validator;
  }

  resolvePublicBaseUrl(requestOrigin) {
    const configuredBaseUrl =
      process.env.PUBLIC_EMERGENCY_BASE_URL ||
      process.env.APP_BASE_URL ||
      process.env.CLIENT_BASE_URL;

    const baseUrl = configuredBaseUrl || requestOrigin || "http://localhost:3001";
    return baseUrl.replace(/\/+$/, "");
  }

  buildPublicUrl(token, requestOrigin) {
    const baseUrl = this.resolvePublicBaseUrl(requestOrigin);
    return `${baseUrl}/api/public/emergency/${token}`;
  }

  mapPrivateProfile(record, requestOrigin) {
    return {
      emergencyAccessEnabled: Boolean(record.emergencyAccessEnabled),
      emergencyToken: record.emergencyToken,
      publicUrl: this.buildPublicUrl(record.emergencyToken, requestOrigin),
      emergencyProfile: {
        fullName: record.emergencyProfile?.fullName || "",
        age: record.emergencyProfile?.age ?? null,
        bloodGroup: record.emergencyProfile?.bloodGroup || "",
        allergies: record.emergencyProfile?.allergies || [],
        conditions: record.emergencyProfile?.conditions || [],
        medications: record.emergencyProfile?.medications || [],
        emergencyContacts: record.emergencyProfile?.emergencyContacts || [],
        notes: record.emergencyProfile?.notes || "",
      },
      updatedAt: record.updatedAt,
    };
  }

  mapPublicProfile(record) {
    return {
      fullName: record.emergencyProfile?.fullName || "",
      age: record.emergencyProfile?.age ?? null,
      bloodGroup: record.emergencyProfile?.bloodGroup || "",
      allergies: record.emergencyProfile?.allergies || [],
      conditions: record.emergencyProfile?.conditions || [],
      medications: record.emergencyProfile?.medications || [],
      emergencyContacts: record.emergencyProfile?.emergencyContacts || [],
      notes: record.emergencyProfile?.notes || "",
    };
  }

  async getOrCreateProfile(userId) {
    const existingProfile = await this.emergencyProfileRepository.findByUserId(userId);
    if (existingProfile) {
      return existingProfile;
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const token = await this.tokenService.generateUniqueToken();
    return this.emergencyProfileRepository.create({
      user: userId,
      emergencyToken: token,
      emergencyProfile: {
        fullName: user.name || "",
      },
    });
  }

  async getMyProfile(userId, requestOrigin) {
    const profile = await this.getOrCreateProfile(userId);
    return this.mapPrivateProfile(profile, requestOrigin);
  }

  async setupProfile(userId, payload, requestOrigin) {
    const validatedPayload = this.validator.validateEmergencyPayload(payload);
    const profile = await this.getOrCreateProfile(userId);

    profile.emergencyProfile = validatedPayload;
    await this.emergencyProfileRepository.save(profile);

    return this.mapPrivateProfile(profile, requestOrigin);
  }

  async toggleAccess(userId, enabled, requestOrigin) {
    const normalizedEnabled = this.validator.optionalBoolean(enabled, "enabled");
    const profile = await this.getOrCreateProfile(userId);

    profile.emergencyAccessEnabled = normalizedEnabled;
    await this.emergencyProfileRepository.save(profile);

    return this.mapPrivateProfile(profile, requestOrigin);
  }

  async regenerateToken(userId, requestOrigin) {
    const profile = await this.getOrCreateProfile(userId);
    profile.emergencyToken = await this.tokenService.generateUniqueToken();
    await this.emergencyProfileRepository.save(profile);

    return this.mapPrivateProfile(profile, requestOrigin);
  }

  async getQrCode(userId, requestOrigin) {
    const profile = await this.getOrCreateProfile(userId);
    const publicUrl = this.buildPublicUrl(profile.emergencyToken, requestOrigin);
    const qrDataUrl = await this.qrCodeService.generate(publicUrl);

    return {
      publicUrl,
      qrDataUrl,
      emergencyAccessEnabled: profile.emergencyAccessEnabled,
    };
  }

  async getPublicProfile(token) {
    const normalizedToken = this.validator.validateToken(token);
    const profile = await this.emergencyProfileRepository.findByTokenAndEnabled(normalizedToken);

    if (!profile) {
      const error = new Error("Emergency profile unavailable");
      error.statusCode = 404;
      throw error;
    }

    return this.mapPublicProfile(profile);
  }
}

module.exports = EmergencyService;
